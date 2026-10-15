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
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PushPin as PinIcon,
  PushPinOutlined as PinOutlinedIcon,
  DoneAll as ReadIcon,
  Clear as ClearIcon,
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
  School as SchoolIcon,
  Person as PersonIcon,
  Translate as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  DynamicFeed as HubIcon,
  FileDownload as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  Verified as VerifiedIcon,
  AccessTime as AccessTimeIcon,
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
import CampusHub from '../components/CampusHub';
import ProfileEditModal from '../components/ProfileEditModal';
import { translations } from '../utils/translations';

const EnhancedChat = () => {
  const { user, logout, setUser } = useAuth();
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

  // Advanced University Hub & Localization State
  const [lang, setLang] = useState(() => localStorage.getItem('tea_chat_lang') || 'en');
  const [langAnchor, setLangAnchor] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('tea_chat_theme') || 'light');

  // Collapsible Sidebar & Chat Filter State
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('tea_chat_sidebar');
    return saved !== null ? saved === 'true' : true;
  });
  const [chatFilter, setChatFilter] = useState('all'); // 'all', 'teachers', 'students', 'online'
  const [pinnedUserIds, setPinnedUserIds] = useState(() => new Set(['teacher-1']));
  const [conversationsMap, setConversationsMap] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('tea_chat_sidebar', String(next));
      return next;
    });
  };

  const togglePinUser = (userId, e) => {
    if (e) e.stopPropagation();
    setPinnedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
        toast.success('Chat unpinned');
      } else {
        next.add(userId);
        toast.success('Chat pinned to top');
      }
      return next;
    });
  };

  const handleUserSelect = (targetUser) => {
    setSelectedUser(targetUser);
    fetchMessages(targetUser._id);
    setActiveView('chat');
    setConversationsMap(prev => ({
      ...prev,
      [targetUser._id]: {
        ...(prev[targetUser._id] || {}),
        unreadCount: 0
      }
    }));
  };

  const t = translations[lang] || translations.en;

  const handleOpenLangMenu = (e) => setLangAnchor(e.currentTarget);
  const handleCloseLangMenu = () => setLangAnchor(null);
  const handleSelectLang = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('tea_chat_lang', selectedLang);
    setLangAnchor(null);
  };
  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    localStorage.setItem('tea_chat_theme', nextTheme);
  };

  const exportChatNotes = () => {
    if (!messages || messages.length === 0) {
      toast.error('No messages in this chat to export');
      return;
    }
    const partnerName = selectedUser?.username || 'Peer';
    let notes = `# Wollo University Study Notes & Lecture Discussion\n`;
    notes += `Participants: ${user?.username || 'You'} & ${partnerName}\n`;
    notes += `Export Date: ${new Date().toLocaleString()}\n`;
    notes += `========================================================\n\n`;

    messages.forEach(m => {
      const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sender = m.sender?._id === user?._id ? (user?.username || 'You') : partnerName;
      notes += `[${time}] ${sender}:\n${m.content || '[File / Audio Attachment]'}\n\n`;
    });

    const blob = new Blob([notes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Study_Notes_${partnerName}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Study notes downloaded successfully');
  };
  
  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // Fetch users & recent conversations on mount
  useEffect(() => {
    fetchUsers();
    fetchRecentConversations();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    if (socket) {
      // Receive message
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Mark as delivered
        if (message.receiver?._id === user._id) {
          markAsDelivered(message._id);
        }

        const partnerId = message.sender?._id === user._id
          ? (message.receiver?._id || message.receiver)
          : (message.sender?._id || message.sender);

        if (partnerId) {
          setConversationsMap(prev => ({
            ...prev,
            [partnerId]: {
              lastMessage: message.content || 'Attachment',
              createdAt: message.createdAt || new Date(),
              status: 'delivered',
              senderId: message.sender?._id || message.sender,
              unreadCount: selectedUser?._id === partnerId ? 0 : (prev[partnerId]?.unreadCount || 0) + 1
            }
          }));
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

  const fetchRecentConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations/recent', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConversationsMap(response.data || {});
    } catch (error) {
      console.warn('Error loading recent conversations:', error);
    }
  };

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

      // Update recent conversation snippet
      const partnerId = selectedUser._id;
      setConversationsMap(prev => ({
        ...prev,
        [partnerId]: {
          lastMessage: response.data.content || newMessage,
          createdAt: response.data.createdAt || new Date(),
          status: 'sent',
          senderId: user._id,
          unreadCount: 0
        }
      }));

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

  // Sidebar drawer content with Search, Role Filters, and Pinned chats
  const filteredUsers = users
    .filter(u => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = (
          u.username?.toLowerCase().includes(q) ||
          u.department?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }
      // Role & Status chip filter
      if (chatFilter === 'teachers') return u.role === 'teacher';
      if (chatFilter === 'students') return u.role === 'student' || u.role === 'ta';
      if (chatFilter === 'online') return onlineUsers.has(u._id);
      return true;
    })
    .sort((a, b) => {
      const aPinned = pinnedUserIds.has(a._id);
      const bPinned = pinnedUserIds.has(b._id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });

  const getChatSnippet = (targetUser, idx) => {
    if (targetUser.role === 'teacher') {
      return targetUser.officeHours || 'Consultation hours available';
    }
    const sampleSnippets = [
      'Just reviewed the lab exercise notes',
      'Are we meeting at the library?',
      'Thanks for sending the lecture slides!',
      'See you in the study pod session!'
    ];
    return sampleSnippets[idx % sampleSnippets.length];
  };

  const getChatTimestamp = (idx) => {
    const times = ['11:42 AM', '10:15 AM', 'Yesterday', 'Tuesday', 'Oct 12'];
    return times[idx % times.length];
  };

  const drawer = (
    <Box sx={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column', borderRight: '1px solid #E4E6EB' }}>
      {/* Drawer Header */}
      <Toolbar sx={{ background: '#F5A623', color: 'white', display: 'flex', justifyContent: 'space-between', px: 2, minHeight: '56px !important' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalCafeIcon />
          <Typography variant="h6" noWrap sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
            {t.appName}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.3} alignItems="center">
          {/* Hide / Collapse Sidebar Button */}
          <Tooltip title="Hide Sidebar">
            <IconButton size="small" color="inherit" onClick={toggleSidebar} sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t.language}>
            <IconButton size="small" color="inherit" onClick={handleOpenLangMenu}>
              <LanguageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={themeMode === 'light' ? t.darkMode : t.lightMode}>
            <IconButton size="small" color="inherit" onClick={toggleTheme}>
              {themeMode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      
      {/* Search Input with Clear Button */}
      <Box sx={{ p: 1.5, pb: 1 }}>
        <TextField
          fullWidth
          placeholder={t.searchPlaceholder}
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8A8D91', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: '#F0F2F5',
              borderRadius: 5,
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#E4E6EB' },
              '&.Mui-focused fieldset': { borderColor: '#F5A623' }
            }
          }}
        />
      </Box>

      {/* Quick Filter Pills (All, Teachers, Students, Online) */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', gap: 0.8, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        <Chip
          label="All"
          size="small"
          onClick={() => setChatFilter('all')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            cursor: 'pointer',
            bgcolor: chatFilter === 'all' ? '#1877F2' : '#F0F2F5',
            color: chatFilter === 'all' ? '#fff' : '#65676B',
            '&:hover': { bgcolor: chatFilter === 'all' ? '#0D6EFD' : '#E4E6EB' }
          }}
        />
        <Chip
          icon={<SchoolIcon sx={{ fontSize: 13, color: chatFilter === 'teachers' ? '#fff !important' : '#1877F2 !important' }} />}
          label="Teachers"
          size="small"
          onClick={() => setChatFilter('teachers')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            cursor: 'pointer',
            bgcolor: chatFilter === 'teachers' ? '#1877F2' : '#F0F2F5',
            color: chatFilter === 'teachers' ? '#fff' : '#65676B',
            '&:hover': { bgcolor: chatFilter === 'teachers' ? '#0D6EFD' : '#E4E6EB' }
          }}
        />
        <Chip
          icon={<PersonIcon sx={{ fontSize: 13, color: chatFilter === 'students' ? '#fff !important' : '#10B981 !important' }} />}
          label="Students"
          size="small"
          onClick={() => setChatFilter('students')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            cursor: 'pointer',
            bgcolor: chatFilter === 'students' ? '#1877F2' : '#F0F2F5',
            color: chatFilter === 'students' ? '#fff' : '#65676B',
            '&:hover': { bgcolor: chatFilter === 'students' ? '#0D6EFD' : '#E4E6EB' }
          }}
        />
        <Chip
          label="Online"
          size="small"
          onClick={() => setChatFilter('online')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            cursor: 'pointer',
            bgcolor: chatFilter === 'online' ? '#10B981' : '#F0F2F5',
            color: chatFilter === 'online' ? '#fff' : '#65676B',
            '&:hover': { bgcolor: chatFilter === 'online' ? '#059669' : '#E4E6EB' }
          }}
        />
      </Box>

      {/* Campus Hub Primary Button */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <ListItem
          button
          onClick={() => {
            setSelectedUser(null);
            setActiveView('hub');
          }}
          sx={{
            borderRadius: 2.5,
            py: 1,
            bgcolor: !selectedUser && activeView === 'hub' ? '#F5A623' : '#F8FAFC',
            color: !selectedUser && activeView === 'hub' ? '#fff' : '#0F172A',
            border: '1px solid #E2E8F0',
            '&:hover': {
              bgcolor: !selectedUser && activeView === 'hub' ? '#E09212' : '#FFFBEB'
            }
          }}
        >
          <ListItemAvatar sx={{ minWidth: 42 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: !selectedUser && activeView === 'hub' ? '#fff' : '#F5A623', color: !selectedUser && activeView === 'hub' ? '#F5A623' : '#fff' }}>
              <HubIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t.hubTitle}
            secondary={`${t.feed} • ${t.shorts}`}
            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.88rem' }}
            secondaryTypographyProps={{ sx: { fontSize: '0.72rem', color: !selectedUser && activeView === 'hub' ? 'rgba(255,255,255,0.85)' : '#64748B' } }}
          />
        </ListItem>
      </Box>

      {/* Chats Section Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 0.8, borderTop: '1px solid #F0F2F5' }}>
        <Typography sx={{ fontWeight: 700, color: '#65676B', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {t.chats} ({filteredUsers.length})
        </Typography>
        {pinnedUserIds.size > 0 && (
          <Stack direction="row" spacing={0.4} alignItems="center">
            <PinIcon sx={{ fontSize: 13, color: '#F5A623' }} />
            <Typography variant="caption" sx={{ color: '#F5A623', fontWeight: 700, fontSize: '0.7rem' }}>
              Pinned
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Modern Chat List (WhatsApp / Telegram / Messenger style) */}
      <List sx={{ px: 1, flex: 1, overflowY: 'auto', py: 0 }}>
        {filteredUsers.map((u, idx) => {
          const isUserTeacher = u.role === 'teacher';
          const isUserTA = u.role === 'ta';
          const isSelected = selectedUser?._id === u._id && activeView === 'chat';
          const isPinned = pinnedUserIds.has(u._id);
          const isOnline = onlineUsers.has(u._id);

          return (
            <ListItem
              key={u._id}
              button
              onClick={() => {
                handleUserSelect(u);
                setActiveView('chat');
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.6,
                py: 1,
                px: 1.2,
                bgcolor: isSelected ? '#EFF6FF' : 'transparent',
                border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
                transition: 'all 0.15s',
                '&:hover': {
                  bgcolor: isSelected ? '#EFF6FF' : '#F0F2F5',
                  '& .pin-btn': { opacity: 1 }
                },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 48 }}>
                <Badge
                  color={isOnline ? 'success' : 'default'}
                  variant="dot"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      border: '2px solid #fff',
                      bgcolor: isOnline ? '#31A24C' : '#CCD0D5'
                    }
                  }}
                >
                  <Avatar
                    src={u.profilePicture}
                    sx={{
                      bgcolor: isUserTeacher ? '#1877F2' : isUserTA ? '#F59E0B' : '#10B981',
                      width: 40,
                      height: 40,
                      border: isUserTeacher ? '2px solid #1877F2' : 'none'
                    }}
                  >
                    {isUserTeacher ? <SchoolIcon fontSize="small" /> : (u.username[0] || '?').toUpperCase()}
                  </Avatar>
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={0.6} alignItems="center" sx={{ maxWidth: 170 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#050505', fontSize: '0.9rem', noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.username}
                      </Typography>
                      {isUserTeacher && <VerifiedIcon sx={{ fontSize: 14, color: '#1877F2' }} />}
                    </Stack>
                    <Typography variant="caption" sx={{ color: isSelected ? '#1877F2' : '#8A8D91', fontSize: '0.7rem', fontWeight: 600 }}>
                      {getChatTimestamp(idx)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.3 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ maxWidth: 185 }}>
                      <ReadIcon sx={{ fontSize: 14, color: isSelected ? '#1877F2' : '#8A8D91' }} />
                      <Typography variant="caption" sx={{ color: '#65676B', fontSize: '0.74rem', noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getChatSnippet(u, idx)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {isPinned && <PinIcon sx={{ fontSize: 13, color: '#F5A623' }} />}
                      <IconButton
                        size="small"
                        className="pin-btn"
                        onClick={(e) => togglePinUser(u._id, e)}
                        sx={{ opacity: isPinned ? 1 : 0, p: 0.3, transition: 'opacity 0.15s' }}
                      >
                        {isPinned ? <PinIcon sx={{ fontSize: 14, color: '#F5A623' }} /> : <PinOutlinedIcon sx={{ fontSize: 14, color: '#8A8D91' }} />}
                      </IconButton>
                    </Stack>
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Profile & Logout */}
      <Box sx={{ p: 1.5, bgcolor: '#FFFFFF', borderTop: '1px solid #E4E6EB' }}>
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ mb: 1.2, p: 1, borderRadius: 2, cursor: 'pointer', bgcolor: '#F0F2F5', '&:hover': { bgcolor: '#E4E6EB' } }}
          onClick={() => setProfileModalOpen(true)}
        >
          <Avatar sx={{ bgcolor: user?.role === 'teacher' ? '#1877F2' : '#F5A623', width: 36, height: 36 }}>
            {user?.role === 'teacher' ? <SchoolIcon fontSize="small" /> : (user?.username?.[0] || 'U').toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#050505', noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: '#65676B', display: 'block', fontSize: '0.7rem' }}>
              {user?.role === 'teacher' ? t.roleTeacher : user?.department || 'Student'} • {t.editProfile}
            </Typography>
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            background: '#F5A623',
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            py: 0.8,
            boxShadow: 'none',
            '&:hover': { background: '#D4A574' }
          }}
        >
          {t.logOut}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarOpen ? 'calc(100% - 340px)' : '100%' },
          ml: { sm: sidebarOpen ? '340px' : 0 },
          transition: 'width 0.25s ease-in-out, margin 0.25s ease-in-out',
          background: '#F5A623',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Sidebar Toggle Button */}
          <Tooltip title={sidebarOpen ? "Hide Chat Sidebar" : "Show Chat Sidebar"}>
            <IconButton
              color="inherit"
              onClick={toggleSidebar}
              sx={{ mr: 1.5, display: { xs: 'none', sm: 'inline-flex' } }}
            >
              {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>

          {selectedUser && activeView === 'chat' ? (
            <>
              <Tooltip title="Back to Campus Hub">
                <IconButton color="inherit" onClick={() => { setSelectedUser(null); setActiveView('hub'); }} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Avatar src={selectedUser?.profilePicture} sx={{ mr: 1.5, bgcolor: 'white', color: '#F5A623' }}>
                {selectedUser?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                    {selectedUser.username}
                  </Typography>
                  {selectedUser.role === 'teacher' && <VerifiedIcon sx={{ fontSize: 18, color: '#fff' }} />}
                  <Chip
                    size="small"
                    label={selectedUser.role === 'teacher' ? t.roleTeacher : selectedUser.role === 'ta' ? t.roleTA : t.roleStudent}
                    sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                  />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 13, opacity: 0.85 }} />
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                    {typingUsers.has(selectedUser._id) ? 'typing...' : (selectedUser.officeHours || selectedUser.department || 'Active')}
                  </Typography>
                </Stack>
              </Box>
              <Tooltip title={t.exportChat}>
                <IconButton color="inherit" onClick={exportChatNotes}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t.videoLounge}>
                <IconButton color="inherit" onClick={startVideoCall}>
                  <VideoCallIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <SchoolIcon sx={{ mr: 1.5 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
                  {t.appName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                  {t.hubTitle} • Wollo University
                </Typography>
              </Box>
            </>
          )}

          {/* Language Switcher */}
          <Tooltip title={t.language}>
            <IconButton color="inherit" onClick={handleOpenLangMenu} sx={{ ml: 1 }}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>

          {/* Profile Edit Trigger */}
          <Tooltip title={t.editProfile}>
            <IconButton color="inherit" onClick={() => setProfileModalOpen(true)}>
              <PersonIcon />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={themeMode === 'light' ? t.darkMode : t.lightMode}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Collapsible Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarOpen ? 340 : 0 },
          flexShrink: { sm: 0 },
          transition: 'width 0.25s ease-in-out'
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 340,
              borderRight: '1px solid #E4E6EB',
              transition: 'transform 0.25s ease-in-out'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Chat / Hub Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 3 },
          width: { sm: sidebarOpen ? 'calc(100% - 340px)' : '100%' },
          ml: { sm: sidebarOpen ? '340px' : 0 },
          transition: 'width 0.25s ease-in-out, margin 0.25s ease-in-out',
          background: themeMode === 'dark' ? '#0F172A' : '#F0F2F5',
          minHeight: '100vh',
          boxSizing: 'border-box'
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
          <CampusHub
            user={user}
            onOpenProfile={() => setProfileModalOpen(true)}
            onDirectMessage={(targetUser) => {
              handleUserSelect(targetUser);
              setActiveView('chat');
            }}
            onStartVideoCall={(pod) => {
              setInVideoCall(true);
              setCallPeer({ username: pod.name || 'Study Pod' });
            }}
            lang={lang}
          />
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
            addReaction(selectedMessage._id, 'starred');
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

      {/* Profile Edit Modal */}
      <ProfileEditModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onProfileUpdated={(updated) => setUser(updated)}
        lang={lang}
      />

      {/* Language Selector Menu */}
      <Menu
        anchorEl={langAnchor}
        open={Boolean(langAnchor)}
        onClose={handleCloseLangMenu}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
      >
        <MenuItem onClick={() => handleSelectLang('en')} selected={lang === 'en'}>
          English
        </MenuItem>
        <MenuItem onClick={() => handleSelectLang('am')} selected={lang === 'am'}>
          አማርኛ (Amharic)
        </MenuItem>
        <MenuItem onClick={() => handleSelectLang('om')} selected={lang === 'om'}>
          Afaan Oromoo (Oromo)
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EnhancedChat;
