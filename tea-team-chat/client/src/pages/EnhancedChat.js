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
  IconButton,
  TextField,
  Button,
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  MoreVert as MoreVertIcon,
  Mic as MicIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { isSameDay } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';

// Import components
import MessageBubble from '../components/MessageBubble';
import MessageContextMenu from '../components/MessageContextMenu';
import DateSeparator from '../components/DateSeparator';
import TypingIndicator from '../components/TypingIndicator';
import ReplyPreview from '../components/ReplyPreview';
import FileUpload from '../components/FileUpload';
import VoiceRecorder from '../components/VoiceRecorder';
import VideoCall from '../components/VideoCall';

const drawerWidth = 320;

const EnhancedChat = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  
  // State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [callPeer, setCallPeer] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    if (socket) {
      // Receive message
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Mark as delivered
        if (message.receiver._id === user._id) {
          markAsDelivered(message._id);
        }
      });

      // User online/offline
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

      // Typing indicators
      socket.on('userTyping', ({ userId, isTyping }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      // Message read confirmation
      socket.on('messageReadConfirm', ({ messageId }) => {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId ? { ...msg, status: 'read' } : msg
        ));
      });

      // Message delivered
      socket.on('messageDelivered', ({ messageId, status }) => {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId ? { ...msg, status } : msg
        ));
      });

      // Reaction added
      socket.on('reactionAdded', ({ messageId, emoji, userId }) => {
        setMessages(prev => prev.map(msg => {
          if (msg._id === messageId) {
            const reactions = msg.reactions || [];
            const existingIndex = reactions.findIndex(
              r => r.user === userId && r.emoji === emoji
            );
            
            if (existingIndex !== -1) {
              reactions.splice(existingIndex, 1);
            } else {
              reactions.push({ user: userId, emoji });
            }
            
            return { ...msg, reactions: [...reactions] };
          }
          return msg;
        }));
      });

      // Message edited
      socket.on('messageEdited', ({ messageId, newContent }) => {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, content: newContent, edited: true, editedAt: new Date() }
            : msg
        ));
      });

      // Message deleted
      socket.on('messageDeleted', ({ messageId }) => {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, deletedForEveryone: true, content: 'This message was deleted' }
            : msg
        ));
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('userOnline');
        socket.off('userOffline');
        socket.off('userTyping');
        socket.off('messageReadConfirm');
        socket.off('messageDelivered');
        socket.off('reactionAdded');
        socket.off('messageEdited');
        socket.off('messageDeleted');
      };
    }
  }, [socket, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      messages.forEach(message => {
        if (message.receiver?._id === user._id && message.status !== 'read') {
          markAsRead(message._id, message.sender._id);
        }
      });
    }
  }, [selectedUser, messages, user]);

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
      messageType: 'text',
      replyTo: replyingTo?._id || null,
      status: 'sending'
    };

    // Optimistic update
    const tempMessage = {
      ...messageData,
      _id: Date.now().toString(),
      sender: { _id: user._id, username: user.username, profilePicture: user.profilePicture },
      receiver: selectedUser,
      createdAt: new Date(),
      reactions: []
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setReplyingTo(null);

    try {
      const response = await axios.post('/api/messages', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Replace temp message with real one
      setMessages(prev => prev.map(msg => 
        msg._id === tempMessage._id ? response.data : msg
      ));

      if (socket) {
        socket.emit('sendMessage', {
          ...response.data,
          receiverId: selectedUser._id
        });
      }

      // Stop typing
      if (socket) {
        socket.emit('stopTyping', {
          senderId: user._id,
          receiverId: selectedUser._id
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    }
  };

  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        senderId: user._id,
        receiverId: selectedUser._id
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', {
          senderId: user._id,
          receiverId: selectedUser._id
        });
      }, 3000);
    }
  };

  const markAsRead = async (messageId, senderId) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (socket) {
        socket.emit('messageRead', {
          messageId,
          senderId,
          readerId: user._id
        });
      }

      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: 'read' } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAsDelivered = async (messageId) => {
    try {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    } catch (error) {
      console.error('Error marking as delivered:', error);
    }
  };

  const addReaction = async (messageId, emoji) => {
    try {
      await axios.post(`/api/messages/${messageId}/react`, { emoji }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (socket) {
        socket.emit('addReaction', {
          messageId,
          emoji,
          userId: user._id,
          receiverId: selectedUser._id
        });
      }

      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg._id === messageId) {
          const reactions = msg.reactions || [];
          const existingIndex = reactions.findIndex(
            r => r.user === user._id && r.emoji === emoji
          );
          
          if (existingIndex !== -1) {
            reactions.splice(existingIndex, 1);
          } else {
            reactions.push({ user: user._id, emoji });
          }
          
          return { ...msg, reactions: [...reactions] };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  const editMessage = async (messageId, newContent) => {
    try {
      await axios.put(`/api/messages/${messageId}/edit`, { content: newContent }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (socket) {
        socket.emit('editMessage', {
          messageId,
          newContent,
          receiverId: selectedUser._id
        });
      }

      setMessages(prev => prev.map(msg => 
        msg._id === messageId 
          ? { ...msg, content: newContent, edited: true, editedAt: new Date() }
          : msg
      ));

      setEditingMessage(null);
      toast.success('Message edited');
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error(error.response?.data?.message || 'Failed to edit message');
    }
  };

  const deleteMessage = async (deleteForEveryone = false) => {
    if (!selectedMessage) return;

    try {
      const response = await axios.delete(`/api/messages/${selectedMessage._id}`, {
        data: { deleteForEveryone },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Emit socket event if delete for everyone
      if (socket && deleteForEveryone && response.data.receiverId) {
        socket.emit('deleteMessage', {
          messageId: selectedMessage._id,
          receiverId: response.data.receiverId,
          deleteForEveryone: true
        });
      }

      if (deleteForEveryone) {
        setMessages(prev => prev.map(msg => 
          msg._id === selectedMessage._id 
            ? { ...msg, deletedForEveryone: true, content: 'This message was deleted' }
            : msg
        ));
      } else {
        setMessages(prev => prev.filter(msg => msg._id !== selectedMessage._id));
      }

      setDeleteDialog(false);
      setSelectedMessage(null);
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchMessages(selectedUser._id);
    setMobileOpen(false);
    setMessages([]);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleContextMenu = (event, message) => {
    event.preventDefault();
    setContextMenu({ mouseX: event.clientX, mouseY: event.clientY });
    setSelectedMessage(message);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleReply = (message) => {
    setReplyingTo(message || selectedMessage);
    messageInputRef.current?.focus();
    handleCloseContextMenu();
  };

  const handleEdit = () => {
    if (selectedMessage) {
      setEditingMessage(selectedMessage);
      setNewMessage(selectedMessage.content);
      messageInputRef.current?.focus();
    }
    handleCloseContextMenu();
  };

  const handleCopy = () => {
    if (selectedMessage) {
      navigator.clipboard.writeText(selectedMessage.content);
      toast.success('Message copied');
    }
    handleCloseContextMenu();
  };

  const handlePin = async () => {
    if (!selectedMessage) return;

    try {
      await axios.put(`/api/messages/${selectedMessage._id}/pin`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMessages(prev => prev.map(msg => 
        msg._id === selectedMessage._id 
          ? { ...msg, pinned: !msg.pinned }
          : msg
      ));

      toast.success(selectedMessage.pinned ? 'Message unpinned' : 'Message pinned');
    } catch (error) {
      console.error('Error pinning message:', error);
      toast.error('Failed to pin message');
    }
    handleCloseContextMenu();
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // File upload handler
  const handleFileUpload = async (fileInfo) => {
    const messageData = {
      sender: user._id,
      receiver: selectedUser._id,
      content: fileInfo.filename,
      messageType: fileInfo.fileType.startsWith('image/') ? 'image' : 'file',
      attachments: [fileInfo]
    };

    try {
      const response = await axios.post('/api/messages', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMessages(prev => [...prev, response.data]);

      if (socket) {
        socket.emit('sendMessage', {
          ...response.data,
          receiverId: selectedUser._id
        });
      }

      toast.success('File sent successfully!');
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Failed to send file');
    }
  };

  // Voice message handler
  const handleVoiceSent = async (voiceInfo) => {
    const messageData = {
      sender: user._id,
      receiver: selectedUser._id,
      content: 'Voice message',
      messageType: 'voice',
      attachments: [voiceInfo]
    };

    try {
      const response = await axios.post('/api/messages', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMessages(prev => [...prev, response.data]);

      if (socket) {
        socket.emit('sendMessage', {
          ...response.data,
          receiverId: selectedUser._id
        });
      }

      toast.success('Voice message sent!');
    } catch (error) {
      console.error('Error sending voice:', error);
      toast.error('Failed to send voice message');
    }
  };

  // Video call handlers
  const startVideoCall = () => {
    if (!selectedUser) return;
    setCallPeer({ userId: selectedUser._id, username: selectedUser.username });
    setInVideoCall(true);
  };

  const endVideoCall = () => {
    setInVideoCall(false);
    setCallPeer(null);
  };

  // Render date separator
  const renderDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return <DateSeparator key={`date-${currentMessage._id}`} date={currentMessage.createdAt} />;
    
    const currentDate = new Date(currentMessage.createdAt);
    const previousDate = new Date(previousMessage.createdAt);
    
    if (!isSameDay(currentDate, previousDate)) {
      return <DateSeparator key={`date-${currentMessage._id}`} date={currentMessage.createdAt} />;
    }
    
    return null;
  };

  // Sidebar drawer content
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

      <Typography sx={{ px: 2, py: 1, fontWeight: 600, color: '#6B4423' }}>
        Chats
      </Typography>

      <List sx={{ px: 1, overflowY: 'auto', height: 'calc(100vh - 250px)' }}>
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
      {/* App Bar */}
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
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {selectedUser ? selectedUser.username : 'Select a chat'}
            </Typography>
            {selectedUser && typingUsers.has(selectedUser._id) && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                typing...
              </Typography>
            )}
          </Box>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          {selectedUser && (
            <IconButton color="inherit" onClick={startVideoCall}>
              <VideoCallIcon />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
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

      {/* Main Chat Area */}
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
            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {messages.map((message, index) => (
                <React.Fragment key={message._id}>
                  {renderDateSeparator(message, messages[index - 1])}
                  <MessageBubble
                    message={message}
                    isOwnMessage={message.sender._id === user._id}
                    onContextMenu={handleContextMenu}
                    onReactionClick={addReaction}
                    onReplyClick={handleReply}
                  />
                </React.Fragment>
              ))}
              
              {/* Typing Indicator */}
              {selectedUser && typingUsers.has(selectedUser._id) && (
                <TypingIndicator username={selectedUser.username} />
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            {/* Reply Preview */}
            {replyingTo && (
              <ReplyPreview 
                message={replyingTo} 
                onClose={() => setReplyingTo(null)} 
              />
            )}

            {/* Voice Recorder */}
            {showVoiceRecorder && (
              <Box sx={{ mb: 2 }}>
                <VoiceRecorder 
                  onVoiceSent={handleVoiceSent}
                  onClose={() => setShowVoiceRecorder(false)}
                />
              </Box>
            )}

            {/* Message Input */}
            <Box
              component="form"
              onSubmit={editingMessage ? (e) => {
                e.preventDefault();
                editMessage(editingMessage._id, newMessage);
              } : sendMessage}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <EmojiIcon sx={{ color: '#8B6F47' }} />
              </IconButton>
              <IconButton onClick={() => setShowFileUpload(true)}>
                <AttachFileIcon sx={{ color: '#8B6F47' }} />
              </IconButton>
              <IconButton onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}>
                <MicIcon sx={{ color: '#8B6F47' }} />
              </IconButton>
              <TextField
                fullWidth
                placeholder={editingMessage ? "Edit message..." : "Type a message..."}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                inputRef={messageInputRef}
                variant="outlined"
                size="small"
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              {editingMessage && (
                <Button
                  onClick={() => {
                    setEditingMessage(null);
                    setNewMessage('');
                  }}
                  sx={{ color: '#8B6F47' }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={!newMessage.trim()}
                sx={{
                  background: '#F5A623',
                  borderRadius: 3,
                  px: 3,
                  '&:hover': { background: '#D4A574' }
                }}
              >
                {editingMessage ? 'Save' : 'Send'}
              </Button>
            </Box>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <Box sx={{ position: 'absolute', bottom: 80, right: 20, zIndex: 1000 }}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </Box>
            )}
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

      {/* Context Menu */}
      <MessageContextMenu
        anchorEl={contextMenu}
        open={Boolean(contextMenu)}
        onClose={handleCloseContextMenu}
        message={selectedMessage}
        isOwnMessage={selectedMessage?.sender._id === user._id}
        onReply={() => handleReply()}
        onEdit={handleEdit}
        onDelete={() => setDeleteDialog(true)}
        onForward={() => toast.info('Forward feature coming soon')}
        onPin={handlePin}
        onCopy={handleCopy}
        onReact={() => {
          if (selectedMessage) {
            addReaction(selectedMessage._id, '❤️');
          }
          handleCloseContextMenu();
        }}
      />

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <Typography>Choose delete option:</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={() => deleteMessage(false)} color="warning">
            Delete for me
          </Button>
          {selectedMessage?.sender._id === user._id && (
            <Button onClick={() => deleteMessage(true)} color="error">
              Delete for everyone
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={showFileUpload} onClose={() => setShowFileUpload(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <FileUpload 
            onFileUploaded={handleFileUpload} 
            onClose={() => setShowFileUpload(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Video Call */}
      {inVideoCall && callPeer && (
        <VideoCall 
          socket={socket}
          user={user}
          peer={callPeer}
          onEndCall={endVideoCall}
        />
      )}
    </Box>
  );
};

export default EnhancedChat;
