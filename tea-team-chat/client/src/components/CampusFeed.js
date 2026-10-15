import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  IconButton,
  Stack,
  Divider,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Tooltip,
  Grid
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Send as SendIcon,
  PostAdd as PostAddIcon,
  Poll as PollIcon,
  Campaign as AnnouncementIcon,
  HelpOutline as QuestionIcon,
  MenuBook as MaterialIcon,
  Forum as ForumIcon,
  Verified as VerifiedIcon,
  AccessTime as AccessTimeIcon,
  Chat as MessageUserIcon,
  Add as AddIcon,
  PhotoLibrary as PhotoIcon,
  Public as PublicIcon,
  MoreHoriz as MoreHorizIcon,
  Lightbulb as LightbulbIcon,
  Event as EventIcon,
  NotificationsActive as AlertIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import CampusStories from './CampusStories';
import { translations } from '../utils/translations';

// Default initial campus posts if server is starting or empty
const FALLBACK_POSTS = [
  {
    _id: 'post-1',
    title: 'Midterm Exam Schedule & Laboratory Consultation Hours',
    content: 'All Software Engineering Year 3 students: The Distributed Systems midterm is scheduled for next Tuesday at 9:00 AM in Tech Hall C. My office consultation hours are extended on Monday 1:00 PM - 5:00 PM for project queries.',
    category: 'announcement',
    author: {
      _id: 'teacher-1',
      username: 'Prof. Yohannes K.',
      role: 'teacher',
      department: 'Computer Science',
      officeHours: 'Mon & Wed 2:00 PM - 5:00 PM',
      isVerified: true
    },
    role: 'teacher',
    department: 'Computer Science',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: ['user-10', 'user-11', 'user-12'],
    reactionCounts: { like: 14, helpful: 8, support: 5 },
    comments: [
      {
        _id: 'comm-1',
        username: 'Selamawit T.',
        role: 'student',
        text: 'Will the exam cover Raft consensus or only Paxos?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likesCount: 3
      },
      {
        _id: 'comm-2',
        username: 'Prof. Yohannes K.',
        role: 'teacher',
        text: 'Both will be covered, with emphasis on practical leader election in Raft.',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        likesCount: 6
      }
    ],
    poll: {
      question: 'Preferred Additional Review Session Time:',
      options: [
        { text: 'Monday 4:00 PM - 6:00 PM', votes: ['u1', 'u2', 'u3', 'u4'] },
        { text: 'Saturday Morning 10:00 AM', votes: ['u5', 'u6'] }
      ]
    }
  },
  {
    _id: 'post-2',
    title: 'Need help understanding Dijkstra vs A* Search heuristic admissibility',
    content: 'We are implementing shortest path finding in Artificial Intelligence Lab 2. Can someone from faculty or senior students explain why an inconsistent heuristic causes A* to revisit closed nodes?',
    category: 'studyQuestion',
    author: {
      _id: 'student-1',
      username: 'Dawit Bekele',
      role: 'student',
      department: 'Computer Science',
      officeHours: 'Available in Library 3rd Floor',
      isVerified: false
    },
    role: 'student',
    department: 'Computer Science',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: ['user-1', 'user-2'],
    reactionCounts: { like: 6, helpful: 4, support: 2 },
    comments: [
      {
        _id: 'comm-3',
        username: 'Abebe T. (TA)',
        role: 'ta',
        text: 'If h(n) violates the triangle inequality (h(n) <= c(n,a,n\') + h(n\')), the first path found to a state is no longer guaranteed to be the shortest.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        likesCount: 5
      }
    ]
  },
  {
    _id: 'post-3',
    title: 'Digital Signal Processing Slides & Matlab Code Repository',
    content: 'The complete set of Lecture Slides on Fourier Transforms, DFT formulas, and FFT algorithms is now updated in the university portal. Make sure to download the Matlab scripts before Thursday lab.',
    category: 'courseMaterial',
    author: {
      _id: 'teacher-2',
      username: 'Dr. Rahel Mengistu',
      role: 'teacher',
      department: 'Electrical Engineering',
      officeHours: 'Tue & Thu 10:00 AM - 12:00 PM',
      isVerified: true
    },
    role: 'teacher',
    department: 'Electrical Engineering',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    likes: ['user-3', 'user-4', 'user-5', 'user-6', 'user-7'],
    reactionCounts: { like: 19, helpful: 11, support: 7 },
    comments: []
  }
];

const ONLINE_FACULTY_CONTACTS = [
  { id: 'f-1', name: 'Prof. Yohannes K.', role: 'teacher', dept: 'Computer Science', office: 'Tech Block B-204', online: true },
  { id: 'f-2', name: 'Dr. Rahel Mengistu', role: 'teacher', dept: 'Electrical Eng.', office: 'EE Lab 4', online: true },
  { id: 'f-3', name: 'Abebe T. (TA)', role: 'ta', dept: 'Computer Science', office: 'Available online', online: true },
  { id: 's-1', name: 'Selamawit T.', role: 'student', dept: 'Software Eng.', office: 'Main Library 3rd Floor', online: true }
];

const CampusFeed = ({ user, onDirectMessage, lang = 'en' }) => {
  const t = translations[lang] || translations.en;

  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [facultyContacts, setFacultyContacts] = useState(ONLINE_FACULTY_CONTACTS);
  const [activeTab, setActiveTab] = useState('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [postMenuAnchor, setPostMenuAnchor] = useState(null);
  const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);

  // New Post Form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    audience: 'public',
    includePoll: false,
    pollQuestion: '',
    pollOptions: ['', '']
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data && res.data.length > 0) {
        const contacts = res.data.map(u => ({
          id: u._id,
          name: u.username,
          role: u.role || 'student',
          dept: u.department || 'Computer Science',
          office: u.officeHours || (u.role === 'teacher' ? 'Faculty Office' : 'Library / Campus'),
          online: true,
          userObj: u
        }));
        setFacultyContacts(contacts);
      }
    } catch (e) {
      // Fallback intact
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (activeTab === 'teachers') params.role = 'teacher';
      if (activeTab === 'questions') params.category = 'studyQuestion';
      if (activeTab === 'announcements') params.category = 'announcement';

      const res = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (res.data && res.data.length > 0) {
        setPosts(res.data);
      }
    } catch (error) {
      // Keep fallback posts if endpoint is initializing
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category
      };

      if (formData.includePoll && formData.pollQuestion.trim()) {
        payload.poll = {
          question: formData.pollQuestion,
          options: formData.pollOptions.filter(o => o.trim().length > 0)
        };
      }

      const res = await axios.post('/api/posts', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(prev => [res.data, ...prev]);
      setComposerOpen(false);
      resetFormData();
      toast.success('Campus post published to feed');
    } catch (error) {
      // Local fallback
      const localPost = {
        _id: `post-${Date.now()}`,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: {
          _id: user?._id || 'me',
          username: user?.username || 'You',
          role: user?.role || 'student',
          department: user?.department || 'Computer Science',
          officeHours: user?.officeHours || 'Available',
          isVerified: user?.role === 'teacher'
        },
        role: user?.role || 'student',
        department: user?.department || 'Computer Science',
        createdAt: new Date().toISOString(),
        likes: [],
        reactionCounts: { like: 1, helpful: 0, support: 0 },
        comments: []
      };
      setPosts(prev => [localPost, ...prev]);
      setComposerOpen(false);
      resetFormData();
      toast.success('Campus post published to feed');
    }
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      audience: 'public',
      includePoll: false,
      pollQuestion: '',
      pollOptions: ['', '']
    });
  };

  // Facebook Multi-Reaction Handler
  const handleReact = (postId, reactionType) => {
    const currentReaction = userReactions[postId];
    const isSame = currentReaction === reactionType;

    setUserReactions(prev => ({
      ...prev,
      [postId]: isSame ? null : reactionType
    }));

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const counts = p.reactionCounts || { like: p.likes?.length || 0, helpful: 0, support: 0 };
        const updatedCounts = { ...counts };

        if (currentReaction && updatedCounts[currentReaction] > 0) {
          updatedCounts[currentReaction] -= 1;
        }

        if (!isSame) {
          updatedCounts[reactionType] = (updatedCounts[reactionType] || 0) + 1;
        }

        return {
          ...p,
          reactionCounts: updatedCounts,
          likes: !isSame ? [...(p.likes || []), user?._id || 'my-id'] : (p.likes || []).filter(id => id !== (user?._id || 'my-id'))
        };
      }
      return p;
    }));

    setHoveredPostId(null);
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;

    const newCommentObj = {
      _id: `comm-${Date.now()}`,
      username: user?.username || 'You',
      role: user?.role || 'student',
      text: commentInput.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/posts/${postId}/comment`, { text: commentInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Local fallback
    }

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newCommentObj]
        };
      }
      return p;
    }));

    setCommentInput('');
  };

  const handleVotePoll = async (postId, optionIndex) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/posts/${postId}/vote`, { optionIndex }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Local fallback
    }

    setPosts(prev => prev.map(p => {
      if (p._id === postId && p.poll) {
        const userId = user?._id || 'my-vote';
        const updatedOptions = p.poll.options.map((opt, idx) => {
          const filteredVotes = opt.votes.filter(v => v !== userId);
          if (idx === optionIndex) {
            filteredVotes.push(userId);
          }
          return { ...opt, votes: filteredVotes };
        });
        return {
          ...p,
          poll: { ...p.poll, options: updatedOptions }
        };
      }
      return p;
    }));
    toast.success(t.voted);
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newState = !prev[postId];
      toast.success(newState ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
      return { ...prev, [postId]: newState };
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Post link copied to clipboard');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'announcement':
        return <AnnouncementIcon fontSize="small" sx={{ color: '#EF4444' }} />;
      case 'studyQuestion':
        return <QuestionIcon fontSize="small" sx={{ color: '#3B82F6' }} />;
      case 'courseMaterial':
        return <MaterialIcon fontSize="small" sx={{ color: '#10B981' }} />;
      default:
        return <ForumIcon fontSize="small" sx={{ color: '#F5A623' }} />;
    }
  };

  const getReactionIcon = (reactionType) => {
    switch (reactionType) {
      case 'helpful':
        return <LightbulbIcon sx={{ fontSize: 18, color: '#F59E0B' }} />;
      case 'support':
        return <SchoolIcon sx={{ fontSize: 18, color: '#10B981' }} />;
      case 'bookmark':
        return <BookmarkIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />;
      default:
        return <ThumbUpIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
    }
  };

  return (
    <Box sx={{ height: '100%', bgcolor: '#F0F2F5', overflowY: 'auto', p: { xs: 1.5, md: 3 } }}>
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        
        {/* Center Main Feed Column (Facebook News Feed) */}
        <Grid item xs={12} md={8}>
          
          {/* Facebook Stories Carousel */}
          <CampusStories user={user} lang={lang} />

          {/* Facebook-style "What's on your mind?" Composer Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: 3,
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #E4E6EB'
            }}
          >
            {/* Top row: Avatar + Pill Input */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: user?.role === 'teacher' ? '#3B82F6' : '#F5A623',
                  width: 42,
                  height: 42
                }}
              >
                {user?.role === 'teacher' ? <SchoolIcon /> : <PersonIcon />}
              </Avatar>
              <Box
                onClick={() => setComposerOpen(true)}
                sx={{
                  flex: 1,
                  bgcolor: '#F0F2F5',
                  py: 1.2,
                  px: 2,
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: '#E4E6E9' }
                }}
              >
                <Typography variant="body2" sx={{ color: '#65676B', fontWeight: 500 }}>
                  What's on your mind, {user?.username || 'Scholar'}?
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 0.5 }} />

            {/* Bottom Facebook Action Buttons */}
            <Stack direction="row" justifyContent="space-around" sx={{ pt: 1 }}>
              <Button
                startIcon={<PhotoIcon sx={{ color: '#45BD62 !important' }} />}
                onClick={() => setComposerOpen(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#65676B',
                  flex: 1,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#F2F2F2' }
                }}
              >
                Photo / Slide
              </Button>
              <Button
                startIcon={<PollIcon sx={{ color: '#1877F2 !important' }} />}
                onClick={() => {
                  setFormData(prev => ({ ...prev, includePoll: true }));
                  setComposerOpen(true);
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#65676B',
                  flex: 1,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#F2F2F2' }
                }}
              >
                Campus Poll
              </Button>
              <Button
                startIcon={<AnnouncementIcon sx={{ color: '#F3425F !important' }} />}
                onClick={() => {
                  setFormData(prev => ({ ...prev, category: 'announcement' }));
                  setComposerOpen(true);
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#65676B',
                  flex: 1,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#F2F2F2' }
                }}
              >
                Announcement
              </Button>
            </Stack>
          </Paper>

          {/* Filter Tabs */}
          <Paper
            elevation={0}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              bgcolor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #E4E6EB'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 44,
                px: 1,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  minHeight: 44,
                  color: '#65676B',
                  '&.Mui-selected': { color: '#1877F2' }
                },
                '& .MuiTabs-indicator': { bgcolor: '#1877F2', height: 3 }
              }}
            >
              <Tab value="all" label={t.allPosts} />
              <Tab value="teachers" label={t.teachersOnly} />
              <Tab value="questions" label={t.questions} />
              <Tab value="announcements" label={t.announcement} />
            </Tabs>
          </Paper>

          {/* Facebook Post Cards */}
          <Stack spacing={2.5}>
            {posts.map((post) => {
              const isAuthorTeacher = post.role === 'teacher' || post.author?.role === 'teacher';
              const isAuthorTA = post.role === 'ta' || post.author?.role === 'ta';
              const activeReaction = userReactions[post._id];
              const isBookmarked = bookmarkedPosts[post._id];
              const commentsList = post.comments || [];
              const isCommentsOpen = openCommentPostId === post._id;

              const reactionTotals = post.reactionCounts || {
                like: post.likes?.length || 0,
                helpful: 0,
                support: 0
              };
              const totalReactions = Object.values(reactionTotals).reduce((a, b) => a + b, 0);

              const totalPollVotes = post.poll?.options
                ? post.poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0)
                : 0;

              return (
                <Card
                  key={post._id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E4E6EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Post Header: Avatar, Name, Role, Timestamp, Privacy, Options */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: isAuthorTeacher ? '#1877F2' : isAuthorTA ? '#F59E0B' : '#10B981',
                            width: 44,
                            height: 44,
                            border: isAuthorTeacher ? '2px solid #1877F2' : 'none'
                          }}
                        >
                          {isAuthorTeacher ? <SchoolIcon /> : <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#050505', fontSize: '0.98rem' }}>
                              {post.author?.username || post.authorName || 'Campus Member'}
                            </Typography>
                            {(isAuthorTeacher || post.author?.isVerified) && (
                              <VerifiedIcon sx={{ fontSize: 16, color: '#1877F2' }} />
                            )}
                            <Chip
                              size="small"
                              label={isAuthorTeacher ? t.roleTeacher : isAuthorTA ? t.roleTA : t.roleStudent}
                              sx={{
                                height: 20,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                bgcolor: isAuthorTeacher ? '#E7F3FF' : isAuthorTA ? '#FEF3C7' : '#DEF7EC',
                                color: isAuthorTeacher ? '#1877F2' : isAuthorTA ? '#D97706' : '#047857'
                              }}
                            />
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.2 }}>
                            <Typography variant="caption" sx={{ color: '#65676B', fontWeight: 500 }}>
                              {post.department || post.author?.department || 'Wollo University'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#65676B' }}>•</Typography>
                            <Stack direction="row" spacing={0.4} alignItems="center">
                              <PublicIcon sx={{ fontSize: 12, color: '#65676B' }} />
                              <Typography variant="caption" sx={{ color: '#65676B' }}>
                                Campus Public
                              </Typography>
                            </Stack>
                            {post.author?.officeHours && (
                              <>
                                <Typography variant="caption" sx={{ color: '#65676B' }}>•</Typography>
                                <Typography variant="caption" sx={{ color: '#1877F2', fontWeight: 600 }}>
                                  {post.author.officeHours}
                                </Typography>
                              </>
                            )}
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Right Post Options */}
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Chip
                          icon={getCategoryIcon(post.category)}
                          label={post.category === 'announcement' ? t.announcement : post.category === 'studyQuestion' ? t.studyQuestion : post.category === 'courseMaterial' ? t.courseMaterial : t.general}
                          size="small"
                          sx={{ bgcolor: '#F0F2F5', fontWeight: 600, fontSize: '0.75rem' }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setPostMenuAnchor(e.currentTarget);
                            setSelectedPostForMenu(post);
                          }}
                        >
                          <MoreHorizIcon sx={{ color: '#65676B' }} />
                        </IconButton>
                      </Stack>
                    </Stack>

                    {/* Post Title & Content */}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#050505', mb: 1, fontSize: '1.05rem' }}>
                      {post.title}
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#050505', lineHeight: 1.6, whiteSpace: 'pre-line', mb: 2 }}>
                      {post.content}
                    </Typography>

                    {/* Attached Poll if present */}
                    {post.poll && post.poll.options && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2.5,
                          bgcolor: '#F7F8FA',
                          borderColor: '#E4E6EB'
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                          <PollIcon fontSize="small" sx={{ color: '#1877F2' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#050505' }}>
                            {post.poll.question || t.pollTitle}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${totalPollVotes} votes`}
                            sx={{ height: 20, fontSize: '0.68rem', bgcolor: '#E4E6EB', fontWeight: 600 }}
                          />
                        </Stack>

                        <Stack spacing={1.2}>
                          {post.poll.options.map((opt, idx) => {
                            const votesCount = opt.votes?.length || 0;
                            const percentage = totalPollVotes > 0 ? Math.round((votesCount / totalPollVotes) * 100) : 0;
                            const hasVotedThis = (opt.votes || []).includes(user?._id || 'my-vote');

                            return (
                              <Box
                                key={idx}
                                onClick={() => handleVotePoll(post._id, idx)}
                                sx={{
                                  p: 1.2,
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  border: hasVotedThis ? '1.5px solid #1877F2' : '1px solid #CCD0D5',
                                  bgcolor: hasVotedThis ? '#E7F3FF' : '#FFFFFF',
                                  transition: 'all 0.15s',
                                  '&:hover': { borderColor: '#1877F2', bgcolor: '#F0F2F5' }
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: hasVotedThis ? 700 : 500, color: '#050505' }}>
                                    {opt.text}
                                  </Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#65676B' }}>
                                    {percentage}% ({votesCount})
                                  </Typography>
                                </Stack>
                                <LinearProgress
                                  variant="determinate"
                                  value={percentage}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: '#E4E6EB',
                                    '& .MuiLinearProgress-bar': { bgcolor: hasVotedThis ? '#1877F2' : '#8A8D91' }
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Stack>
                      </Paper>
                    )}

                    {/* Facebook Reactions & Comments Stats Bar */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                      <Stack direction="row" spacing={0.6} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#1877F2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ThumbUpIcon sx={{ fontSize: 12 }} />
                          </Box>
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#F59E0B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: -0.6 }}>
                            <LightbulbIcon sx={{ fontSize: 12 }} />
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#65676B', fontWeight: 600 }}>
                          {totalReactions > 0 ? totalReactions : 1}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" sx={{ color: '#65676B' }}>
                        {commentsList.length} comments • 2 shares
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 0.5 }} />

                    {/* Facebook Action Bar: React, Comment, Share */}
                    <Box sx={{ position: 'relative' }}>
                      {/* Floating Multi-Reactions Bar (Facebook Style) */}
                      {hoveredPostId === post._id && (
                        <Paper
                          elevation={6}
                          onMouseEnter={() => setHoveredPostId(post._id)}
                          onMouseLeave={() => setHoveredPostId(null)}
                          sx={{
                            position: 'absolute',
                            top: -46,
                            left: 0,
                            zIndex: 20,
                            p: 0.6,
                            px: 1,
                            borderRadius: 6,
                            bgcolor: '#FFFFFF',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            display: 'flex',
                            gap: 1.2,
                            alignItems: 'center'
                          }}
                        >
                          <Tooltip title="Like">
                            <IconButton
                              size="small"
                              onClick={() => handleReact(post._id, 'like')}
                              sx={{
                                color: '#1877F2',
                                transition: 'transform 0.15s',
                                '&:hover': { transform: 'scale(1.25)' }
                              }}
                            >
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Helpful / Insightful">
                            <IconButton
                              size="small"
                              onClick={() => handleReact(post._id, 'helpful')}
                              sx={{
                                color: '#F59E0B',
                                transition: 'transform 0.15s',
                                '&:hover': { transform: 'scale(1.25)' }
                              }}
                            >
                              <LightbulbIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Academic Support">
                            <IconButton
                              size="small"
                              onClick={() => handleReact(post._id, 'support')}
                              sx={{
                                color: '#10B981',
                                transition: 'transform 0.15s',
                                '&:hover': { transform: 'scale(1.25)' }
                              }}
                            >
                              <SchoolIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Bookmark">
                            <IconButton
                              size="small"
                              onClick={() => handleReact(post._id, 'bookmark')}
                              sx={{
                                color: '#8B5CF6',
                                transition: 'transform 0.15s',
                                '&:hover': { transform: 'scale(1.25)' }
                              }}
                            >
                              <BookmarkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Paper>
                      )}

                      <Stack direction="row" justifyContent="space-between" sx={{ pt: 0.5 }}>
                        {/* React Button with hover popover */}
                        <Button
                          fullWidth
                          startIcon={activeReaction ? getReactionIcon(activeReaction) : <ThumbUpOutlinedIcon />}
                          onMouseEnter={() => setHoveredPostId(post._id)}
                          onClick={() => handleReact(post._id, activeReaction ? activeReaction : 'like')}
                          sx={{
                            color: activeReaction ? '#1877F2' : '#65676B',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#F2F2F2' }
                          }}
                        >
                          {activeReaction === 'helpful' ? 'Helpful' : activeReaction === 'support' ? 'Support' : activeReaction === 'bookmark' ? 'Saved' : t.like}
                        </Button>

                        {/* Comment Button */}
                        <Button
                          fullWidth
                          startIcon={<CommentIcon />}
                          onClick={() => setOpenCommentPostId(isCommentsOpen ? null : post._id)}
                          sx={{
                            color: '#65676B',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#F2F2F2' }
                          }}
                        >
                          {t.comment}
                        </Button>

                        {/* Share Button */}
                        <Button
                          fullWidth
                          startIcon={<ShareIcon />}
                          onClick={handleShare}
                          sx={{
                            color: '#65676B',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#F2F2F2' }
                          }}
                        >
                          {t.share}
                        </Button>
                      </Stack>
                    </Box>

                    {/* Inline Facebook Comments Section */}
                    {isCommentsOpen && (
                      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #E4E6EB' }}>
                        {/* Comments list */}
                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                          {commentsList.map((c, i) => (
                            <Stack key={c._id || i} direction="row" spacing={1.2} alignItems="flex-start">
                              <Avatar sx={{ width: 32, height: 32, bgcolor: c.role === 'teacher' ? '#1877F2' : '#10B981', mt: 0.5 }}>
                                {c.role === 'teacher' ? <SchoolIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ bgcolor: '#F0F2F5', p: 1.5, borderRadius: 3, display: 'inline-block', maxWidth: '90%' }}>
                                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#050505', fontSize: '0.85rem' }}>
                                      {c.username}
                                    </Typography>
                                    {c.role === 'teacher' && <VerifiedIcon sx={{ fontSize: 13, color: '#1877F2' }} />}
                                    <Chip
                                      size="small"
                                      label={c.role === 'teacher' ? t.roleTeacher : c.role === 'ta' ? t.roleTA : t.roleStudent}
                                      sx={{
                                        height: 16,
                                        fontSize: '0.6rem',
                                        fontWeight: 700,
                                        bgcolor: c.role === 'teacher' ? '#E7F3FF' : '#E4E6EB',
                                        color: c.role === 'teacher' ? '#1877F2' : '#65676B'
                                      }}
                                    />
                                  </Stack>
                                  <Typography variant="body2" sx={{ color: '#050505', fontSize: '0.88rem' }}>
                                    {c.text}
                                  </Typography>
                                </Box>
                                <Stack direction="row" spacing={2} sx={{ pl: 1.5, mt: 0.4 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#65676B', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                    Like
                                  </Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#65676B', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                    Reply
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#8A8D91' }}>
                                    Just now
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          ))}
                        </Stack>

                        {/* Add Comment Input (Facebook Style) */}
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: user?.role === 'teacher' ? '#1877F2' : '#F5A623' }}>
                            {user?.role === 'teacher' ? <SchoolIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                          </Avatar>
                          <Box sx={{ flex: 1, position: 'relative' }}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Write an academic comment or question..."
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(post._id);
                                }
                              }}
                              sx={{
                                bgcolor: '#F0F2F5',
                                borderRadius: 5,
                                '& .MuiOutlinedInput-root': { borderRadius: 5, pr: 5 }
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleAddComment(post._id)}
                              sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#1877F2' }}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Grid>

        {/* Facebook Right Sidebar (Contacts, Academic Notices, Deadlines) */}
        <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Stack spacing={2.5}>
            
            {/* University Notices & Announcements */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E4E6EB' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <AlertIcon sx={{ color: '#1877F2', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#050505' }}>
                  Wollo Academic Notices
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#050505', fontWeight: 600, mb: 0.5 }}>
                Faculty Office Hours Active
              </Typography>
              <Typography variant="caption" sx={{ color: '#65676B', display: 'block', mb: 1.5 }}>
                Professors are available for thesis and exam consultations today in Tech Hall C and EE Lab 4.
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="body2" sx={{ color: '#050505', fontWeight: 600, mb: 0.5 }}>
                Library 24/7 Access
              </Typography>
              <Typography variant="caption" sx={{ color: '#65676B', display: 'block' }}>
                Main Campus Study Lounges remain open around the clock for midterm preparation.
              </Typography>
            </Paper>

            {/* Online Faculty & Study Peers Contacts (Facebook Contacts List) */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E4E6EB' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#050505' }}>
                  Faculty & Contacts Online
                </Typography>
                <Chip size="small" label="Active" sx={{ height: 18, fontSize: '0.62rem', bgcolor: '#DEF7EC', color: '#047857', fontWeight: 700 }} />
              </Stack>

              <Stack spacing={1}>
                {facultyContacts.map((contact) => (
                  <Box
                    key={contact.id}
                    onClick={() => onDirectMessage && onDirectMessage(contact.userObj || { _id: contact.id, username: contact.name, role: contact.role, department: contact.dept, officeHours: contact.office })}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      '&:hover': { bgcolor: '#F0F2F5' }
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box sx={{ position: 'relative' }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: contact.role === 'teacher' ? '#1877F2' : contact.role === 'ta' ? '#F59E0B' : '#10B981' }}>
                          {contact.role === 'teacher' ? <SchoolIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                        </Avatar>
                        <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', bgcolor: '#31A24C', border: '2px solid #fff' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#050505', fontSize: '0.85rem' }}>
                          {contact.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#65676B', display: 'block', fontSize: '0.7rem' }}>
                          {contact.office}
                        </Typography>
                      </Box>
                    </Stack>

                    <IconButton size="small" sx={{ color: '#1877F2' }}>
                      <MessageUserIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Upcoming Academic Events */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E4E6EB' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <EventIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#050505' }}>
                  Academic Events & Deadlines
                </Typography>
              </Stack>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#050505', fontSize: '0.85rem' }}>
                  Algorithms Midterm Exam
                </Typography>
                <Typography variant="caption" sx={{ color: '#65676B' }}>
                  Tuesday at 9:00 AM • Tech Hall C
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#050505', fontSize: '0.85rem' }}>
                  DSP Laboratory Report Submission
                </Typography>
                <Typography variant="caption" sx={{ color: '#65676B' }}>
                  Thursday at 5:00 PM • Engineering Portal
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Facebook-style Create Post Modal */}
      <Dialog
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pb: 1, borderBottom: '1px solid #E4E6EB', color: '#050505' }}>
          Create Campus Post
        </DialogTitle>
        <form onSubmit={handleCreatePost}>
          <DialogContent sx={{ pt: 2.5 }}>
            <Stack spacing={2}>
              {/* User Identity & Audience selector */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: user?.role === 'teacher' ? '#1877F2' : '#F5A623', width: 44, height: 44 }}>
                  {user?.role === 'teacher' ? <SchoolIcon /> : <PersonIcon />}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#050505' }}>
                    {user?.username || 'You'}
                  </Typography>
                  <Chip
                    icon={<PublicIcon sx={{ fontSize: 13, color: '#050505 !important' }} />}
                    label="Campus Public"
                    size="small"
                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#E4E6EB' }}
                  />
                </Box>
              </Stack>

              {/* Title */}
              <TextField
                fullWidth
                size="small"
                placeholder="Post Title or Subject..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Content (Large What's on your mind textarea) */}
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={`What's on your mind, ${user?.username || 'Scholar'}?`}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Category */}
              <FormControl fullWidth size="small">
                <InputLabel>{t.postCategory}</InputLabel>
                <Select
                  value={formData.category}
                  label={t.postCategory}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="general">{t.general}</MenuItem>
                  <MenuItem value="studyQuestion">{t.studyQuestion}</MenuItem>
                  <MenuItem value="announcement">{t.announcement}</MenuItem>
                  <MenuItem value="courseMaterial">{t.courseMaterial}</MenuItem>
                </Select>
              </FormControl>

              {/* Poll builder toggle */}
              <Button
                variant={formData.includePoll ? 'contained' : 'outlined'}
                startIcon={<PollIcon />}
                onClick={() => setFormData({ ...formData, includePoll: !formData.includePoll })}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  bgcolor: formData.includePoll ? '#1877F2' : 'transparent',
                  borderColor: '#1877F2',
                  color: formData.includePoll ? '#fff' : '#1877F2',
                  '&:hover': { bgcolor: formData.includePoll ? '#0D6EFD' : '#E7F3FF' }
                }}
              >
                {formData.includePoll ? 'Remove Poll' : 'Attach Campus Quick Poll'}
              </Button>

              {formData.includePoll && (
                <Stack spacing={1.5} sx={{ p: 2, bgcolor: '#F0F2F5', borderRadius: 2, border: '1px solid #CCD0D5' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Poll Question"
                    value={formData.pollQuestion}
                    onChange={(e) => setFormData({ ...formData, pollQuestion: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                  />
                  {formData.pollOptions.map((opt, i) => (
                    <TextField
                      key={i}
                      fullWidth
                      size="small"
                      label={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.pollOptions];
                        newOpts[i] = e.target.value;
                        setFormData({ ...formData, pollOptions: newOpts });
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                    />
                  ))}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setFormData({ ...formData, pollOptions: [...formData.pollOptions, ''] })}
                    sx={{ alignSelf: 'flex-start', textTransform: 'none', color: '#1877F2' }}
                  >
                    Add Option
                  </Button>
                </Stack>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setComposerOpen(false)} sx={{ color: '#65676B', textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#1877F2',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                py: 1,
                fontSize: '0.95rem',
                '&:hover': { bgcolor: '#0D6EFD' }
              }}
            >
              Post
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Post Context / Options Menu */}
      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor)}
        onClose={() => setPostMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 180 } }}
      >
        <MenuItem
          onClick={() => {
            if (selectedPostForMenu) toggleBookmark(selectedPostForMenu._id);
            setPostMenuAnchor(null);
          }}
        >
          <BookmarkIcon fontSize="small" sx={{ mr: 1.5, color: '#8B5CF6' }} />
          Save post to Bookmarks
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleShare();
            setPostMenuAnchor(null);
          }}
        >
          <ShareIcon fontSize="small" sx={{ mr: 1.5, color: '#1877F2' }} />
          Copy post link
        </MenuItem>
        {selectedPostForMenu?.author?._id !== user?._id && (
          <MenuItem
            onClick={() => {
              if (selectedPostForMenu?.author && onDirectMessage) {
                onDirectMessage(selectedPostForMenu.author);
              }
              setPostMenuAnchor(null);
            }}
          >
            <MessageUserIcon fontSize="small" sx={{ mr: 1.5, color: '#10B981' }} />
            Message author directly
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default CampusFeed;
