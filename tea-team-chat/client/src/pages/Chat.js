import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
  Avatar,
  Badge,
  Paper,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Send as SendIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachFileIcon,
  LocalCafe as LocalCafeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const drawerWidth = 320;

const Chat = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
        toast.success(`New message from ${message.sender.username}`);
      });

      socket.on('userOnline', ({ userId }) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      socket.on('userOffline', ({ userId }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('userOnline');
        socket.off('userOffline');
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      sender: user._id,
      receiver: selectedUser._id,
      content: newMessage,
      messageType: 'text'
    };

    try {
      const response = await axios.post('/api/messages', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (socket) {
        socket.emit('sendMessage', {
          ...response.data,
          receiverId: selectedUser._id
        });
      }

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchMessages(selectedUser._id);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', background: '#FFF8E7' }}>
      <Toolbar sx={{ background: '#F5A623', color: 'white' }}>
        <LocalCafeIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
          Tea Team Chat
        </Typography>
      </Toolbar>
      
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8B6F47' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'white',
              borderRadius: 3,
            }
          }}
        />
      </Box>

      <Divider />

      <Typography sx={{ px: 2, py: 1, fontWeight: 600, color: '#6B4423' }}>
        Friends
      </Typography>

      <List sx={{ px: 1 }}>
        {users.map((u) => (
          <ListItem
            key={u._id}
            button
            onClick={() => handleUserSelect(u)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: selectedUser?._id === u._id ? 'rgba(245, 166, 35, 0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(245, 166, 35, 0.1)' },
            }}
          >
            <ListItemAvatar>
              <Badge
                color={onlineUsers.has(u._id) ? 'success' : 'default'}
                variant="dot"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar src={u.profilePicture} sx={{ bgcolor: '#F5A623' }}>
                  {u.username[0].toUpperCase()}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={u.username}
              secondary={onlineUsers.has(u._id) ? 'Online' : 'Offline'}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            background: '#F5A623',
            '&:hover': { background: '#D4A574' }
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: '#F5A623',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar src={selectedUser?.profilePicture} sx={{ mr: 2, bgcolor: 'white', color: '#F5A623' }}>
            {selectedUser?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedUser ? selectedUser.username : 'Select a chat'}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
        }}
      >
        <Toolbar />
        {selectedUser ? (
          <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender._id === user._id ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.sender._id === user._id ? '#90C695' : 'white',
                      color: message.sender._id === user._id ? 'white' : '#4A3728',
                      borderRadius: 3,
                      boxShadow: 2,
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            <Paper
              component="form"
              onSubmit={sendMessage}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 3,
                background: 'white',
              }}
            >
              <IconButton>
                <AttachFileIcon sx={{ color: '#8B6F47' }} />
              </IconButton>
              <IconButton>
                <EmojiIcon sx={{ color: '#8B6F47' }} />
              </IconButton>
              <TextField
                fullWidth
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  background: '#F5A623',
                  borderRadius: 3,
                  px: 3,
                  '&:hover': { background: '#D4A574' }
                }}
              >
                Send
              </Button>
            </Paper>
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LocalCafeIcon sx={{ fontSize: 100, color: '#F5A623', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#6B4423', fontWeight: 600 }}>
              Select a friend to start chatting ☕
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
