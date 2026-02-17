const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const socketIO = require('socket.io');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/groups');
const uploadRoutes = require('./routes/upload');

// Import passport config
require('./config/passport');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Socket.io
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'tea-team-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tea-team-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Tea Team Chat API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Tea Team Chat API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      messages: '/api/messages',
      groups: '/api/groups',
      upload: '/api/upload'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Socket.io connection
const onlineUsers = new Map();
const typingUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // User joins
  socket.on('join', (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    
    // Broadcast online status
    io.emit('userOnline', { userId, status: 'online' });
    console.log(`👤 User ${userId} joined`);
  });

  // Send message
  socket.on('sendMessage', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', data);
      // Send delivery confirmation
      socket.emit('messageDelivered', { messageId: data._id, status: 'delivered' });
    }
  });

  // Typing indicators
  socket.on('typing', (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      typingUsers.set(senderId, Date.now());
      io.to(receiverSocketId).emit('userTyping', { userId: senderId, isTyping: true });
      
      // Auto-stop typing after 3 seconds
      setTimeout(() => {
        const lastTyped = typingUsers.get(senderId);
        if (lastTyped && Date.now() - lastTyped >= 3000) {
          typingUsers.delete(senderId);
          io.to(receiverSocketId).emit('userTyping', { userId: senderId, isTyping: false });
        }
      }, 3000);
    }
  });

  socket.on('stopTyping', (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    typingUsers.delete(senderId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', { userId: senderId, isTyping: false });
    }
  });

  // Message read
  socket.on('messageRead', (data) => {
    const { messageId, senderId, readerId } = data;
    const senderSocketId = onlineUsers.get(senderId);
    
    if (senderSocketId) {
      io.to(senderSocketId).emit('messageReadConfirm', { 
        messageId, 
        readerId, 
        readAt: new Date() 
      });
    }
  });

  // Message reactions
  socket.on('addReaction', (data) => {
    const { messageId, emoji, userId, receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('reactionAdded', { messageId, emoji, userId });
    }
  });

  // Message edit
  socket.on('editMessage', (data) => {
    const { messageId, newContent, receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageEdited', { messageId, newContent });
    }
  });

  // Message delete
  socket.on('deleteMessage', (data) => {
    const { messageId, receiverId, deleteForEveryone } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId && deleteForEveryone) {
      io.to(receiverSocketId).emit('messageDeleted', { messageId });
    }
  });

  // Voice/Video call signaling
  socket.on('callUser', (data) => {
    const { to, offer, callType } = data;
    const receiverSocketId = onlineUsers.get(to);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('incomingCall', {
        from: socket.userId,
        offer,
        callType
      });
    }
  });

  socket.on('answerCall', (data) => {
    const { to, answer } = data;
    const callerSocketId = onlineUsers.get(to);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('callAnswered', { answer });
    }
  });

  socket.on('rejectCall', (data) => {
    const { to } = data;
    const callerSocketId = onlineUsers.get(to);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('callRejected');
    }
  });

  socket.on('endCall', (data) => {
    const { to } = data;
    const receiverSocketId = onlineUsers.get(to);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('callEnded');
    }
  });

  // ICE candidates for WebRTC
  socket.on('iceCandidate', (data) => {
    const { to, candidate } = data;
    const receiverSocketId = onlineUsers.get(to);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('iceCandidate', { candidate });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      typingUsers.delete(socket.userId);
      io.emit('userOffline', { userId: socket.userId, status: 'offline', lastSeen: new Date() });
      console.log(`👤 User ${socket.userId} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
