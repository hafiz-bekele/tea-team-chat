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
  MenuItem
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
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
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
    comments: [
      {
        _id: 'comm-1',
        username: 'Selamawit T.',
        role: 'student',
        text: 'Will the exam cover Raft consensus or only Paxos?',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        _id: 'comm-2',
        username: 'Prof. Yohannes K.',
        role: 'teacher',
        text: 'Both will be covered, with emphasis on practical leader election in Raft.',
        createdAt: new Date(Date.now() - 1800000).toISOString()
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
    comments: [
      {
        _id: 'comm-3',
        username: 'Abebe T. (TA)',
        role: 'ta',
        text: 'If h(n) violates the triangle inequality (h(n) <= c(n,a,n\') + h(n\')), the first path found to a state is no longer guaranteed to be the shortest.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
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
    comments: []
  }
];

const CampusFeed = ({ user, onDirectMessage, lang = 'en' }) => {
  const t = translations[lang] || translations.en;

  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [activeTab, setActiveTab] = useState('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  // New Post Form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    includePoll: false,
    pollQuestion: '',
    pollOptions: ['', '']
  });

  useEffect(() => {
    fetchPosts();
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
      // Keep fallback posts if server endpoint is initializing
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
      setFormData({
        title: '',
        content: '',
        category: 'general',
        includePoll: false,
        pollQuestion: '',
        pollOptions: ['', '']
      });
      toast.success('Campus post published');
    } catch (error) {
      // Offline fallback post
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
        comments: []
      };
      setPosts(prev => [localPost, ...prev]);
      setComposerOpen(false);
      toast.success('Campus post published');
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Local state update
    }

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const userId = user?._id || 'my-id';
        const hasLiked = (p.likes || []).includes(userId);
        const newLikes = hasLiked
          ? (p.likes || []).filter(id => id !== userId)
          : [...(p.likes || []), userId];
        return { ...p, likes: newLikes };
      }
      return p;
    }));
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;

    const newCommentObj = {
      _id: `comm-${Date.now()}`,
      username: user?.username || 'You',
      role: user?.role || 'student',
      text: commentInput.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/posts/${postId}/comment`, { text: commentInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Local state update
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
      // Local state update
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
      toast.success(newState ? 'Post bookmarked' : 'Bookmark removed');
      return { ...prev, [postId]: newState };
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard');
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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', overflowY: 'auto' }}>
      {/* Top Banner & Composer Trigger */}
      <Box sx={{
        p: { xs: 2, md: 3 },
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.5 }}>
              {t.feed}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Wollo University Academic Exchange & Announcements
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<PostAddIcon />}
            onClick={() => setComposerOpen(true)}
            sx={{
              bgcolor: '#F5A623',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2.5,
              px: 2.5,
              py: 1,
              boxShadow: '0 4px 14px rgba(245, 166, 35, 0.3)',
              '&:hover': { bgcolor: '#E09212' }
            }}
          >
            {t.postSomething}
          </Button>
        </Stack>

        {/* Filter Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              minHeight: 40,
              color: '#64748B',
              '&.Mui-selected': { color: '#F5A623' }
            },
            '& .MuiTabs-indicator': { bgcolor: '#F5A623', height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab value="all" label={t.allPosts} />
          <Tab value="teachers" label={t.teachersOnly} />
          <Tab value="questions" label={t.questions} />
          <Tab value="announcements" label={t.announcement} />
        </Tabs>
      </Box>

      {/* Posts Feed List */}
      <Box sx={{ maxWidth: 840, mx: 'auto', width: '100%', p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          {posts.map((post) => {
            const isAuthorTeacher = post.role === 'teacher' || post.author?.role === 'teacher';
            const isAuthorTA = post.role === 'ta' || post.author?.role === 'ta';
            const hasLiked = (post.likes || []).includes(user?._id || 'my-id');
            const isBookmarked = bookmarkedPosts[post._id];
            const commentsList = post.comments || [];
            const isCommentsOpen = openCommentPostId === post._id;

            // Poll calculation
            const totalPollVotes = post.poll?.options
              ? post.poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0)
              : 0;

            return (
              <Card
                key={post._id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: isAuthorTeacher ? '1.5px solid #BFDBFE' : '1px solid #E2E8F0',
                  boxShadow: isAuthorTeacher ? '0 4px 16px rgba(59, 130, 246, 0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Author Header */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.8 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{
                        bgcolor: isAuthorTeacher ? '#3B82F6' : isAuthorTA ? '#F59E0B' : '#10B981',
                        width: 44,
                        height: 44
                      }}>
                        {isAuthorTeacher ? <SchoolIcon /> : <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {post.author?.username || post.authorName || 'Campus Member'}
                            {(isAuthorTeacher || post.author?.isVerified) && (
                              <VerifiedIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                            )}
                          </Typography>
                          <Chip
                            size="small"
                            label={isAuthorTeacher ? t.roleTeacher : isAuthorTA ? t.roleTA : t.roleStudent}
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              bgcolor: isAuthorTeacher ? '#EFF6FF' : isAuthorTA ? '#FFFBEB' : '#ECFDF5',
                              color: isAuthorTeacher ? '#1D4ED8' : isAuthorTA ? '#B45309' : '#047857',
                              border: isAuthorTeacher ? '1px solid #BFDBFE' : '1px solid #A7F3D0'
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.3 }}>
                          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                            {post.department || post.author?.department || 'Wollo University'}
                          </Typography>
                          {post.author?.officeHours && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <AccessTimeIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                {post.author.officeHours}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Category Chip & Direct Chat Button */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={getCategoryIcon(post.category)}
                        label={post.category === 'announcement' ? t.announcement : post.category === 'studyQuestion' ? t.studyQuestion : post.category === 'courseMaterial' ? t.courseMaterial : t.general}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9', fontWeight: 600, fontSize: '0.75rem' }}
                      />
                      {onDirectMessage && post.author?._id !== user?._id && (
                        <IconButton
                          size="small"
                          onClick={() => onDirectMessage(post.author)}
                          title="Message this person directly"
                          sx={{ color: '#64748B', '&:hover': { color: '#F5A623', bgcolor: '#FFFBEB' } }}
                        >
                          <MessageUserIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {/* Post Title & Content */}
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 1, fontSize: '1.05rem' }}>
                    {post.title}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line', mb: 2 }}>
                    {post.content}
                  </Typography>

                  {/* Campus Poll Widget if attached */}
                  {post.poll && post.poll.options && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2.5,
                        bgcolor: '#F8FAFC',
                        borderColor: '#E2E8F0'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <PollIcon fontSize="small" sx={{ color: '#F5A623' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {post.poll.question || t.pollTitle}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${totalPollVotes} votes`}
                          sx={{ height: 20, fontSize: '0.68rem', bgcolor: '#E2E8F0', fontWeight: 600 }}
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
                                border: hasVotedThis ? '1.5px solid #F5A623' : '1px solid #CBD5E1',
                                bgcolor: hasVotedThis ? '#FFFBEB' : '#FFFFFF',
                                transition: 'all 0.15s',
                                '&:hover': { borderColor: '#F5A623', bgcolor: '#FFFBEB' }
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: hasVotedThis ? 700 : 500, color: '#1E293B' }}>
                                  {opt.text}
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                                  {percentage}% ({votesCount})
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: '#E2E8F0',
                                  '& .MuiLinearProgress-bar': { bgcolor: hasVotedThis ? '#F5A623' : '#94A3B8' }
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Stack>
                    </Paper>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  {/* Actions Row */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1}>
                      {/* Like */}
                      <Button
                        size="small"
                        startIcon={hasLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                        onClick={() => handleToggleLike(post._id)}
                        sx={{
                          color: hasLiked ? '#F5A623' : '#64748B',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#FFFBEB' }
                        }}
                      >
                        {post.likes?.length || 0} {t.like}
                      </Button>

                      {/* Comment */}
                      <Button
                        size="small"
                        startIcon={<CommentIcon />}
                        onClick={() => setOpenCommentPostId(isCommentsOpen ? null : post._id)}
                        sx={{
                          color: '#64748B',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#F1F5F9' }
                        }}
                      >
                        {commentsList.length} {t.comment}
                      </Button>
                    </Stack>

                    <Stack direction="row" spacing={0.5}>
                      {/* Bookmark */}
                      <IconButton size="small" onClick={() => toggleBookmark(post._id)} sx={{ color: isBookmarked ? '#F5A623' : '#94A3B8' }}>
                        {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                      </IconButton>

                      {/* Share */}
                      <IconButton size="small" onClick={handleShare} sx={{ color: '#94A3B8' }}>
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {/* Inline Comments Section */}
                  {isCommentsOpen && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #E2E8F0' }}>
                      {/* Existing comments */}
                      <Stack spacing={1.5} sx={{ mb: 2 }}>
                        {commentsList.map((c, i) => (
                          <Paper key={c._id || i} elevation={0} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                                {c.username}
                              </Typography>
                              <Chip
                                size="small"
                                label={c.role === 'teacher' ? t.roleTeacher : c.role === 'ta' ? t.roleTA : t.roleStudent}
                                sx={{
                                  height: 18,
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  bgcolor: c.role === 'teacher' ? '#DBEAFE' : '#E2E8F0',
                                  color: c.role === 'teacher' ? '#1D4ED8' : '#475569'
                                }}
                              />
                            </Stack>
                            <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.88rem' }}>
                              {c.text}
                            </Typography>
                          </Paper>
                        ))}
                      </Stack>

                      {/* Add comment */}
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={t.comment + '...'}
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleAddComment(post._id)}
                          sx={{
                            bgcolor: '#F5A623',
                            borderRadius: 2,
                            px: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: '#E09212' }
                          }}
                        >
                          <SendIcon fontSize="small" />
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

      {/* Create Campus Post Dialog */}
      <Dialog
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#0F172A' }}>
          {t.newPost}
        </DialogTitle>
        <form onSubmit={handleCreatePost}>
          <DialogContent>
            <Stack spacing={2.2}>
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

              {/* Title */}
              <TextField
                fullWidth
                size="small"
                label={t.postTitle}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Content */}
              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                label={t.postContent}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Poll toggle */}
              <Button
                variant={formData.includePoll ? 'contained' : 'outlined'}
                startIcon={<PollIcon />}
                onClick={() => setFormData({ ...formData, includePoll: !formData.includePoll })}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  bgcolor: formData.includePoll ? '#F5A623' : 'transparent',
                  borderColor: '#F5A623',
                  color: formData.includePoll ? '#fff' : '#F5A623',
                  '&:hover': { bgcolor: formData.includePoll ? '#E09212' : '#FFFBEB' }
                }}
              >
                {formData.includePoll ? 'Remove Poll' : 'Attach Quick Poll'}
              </Button>

              {formData.includePoll && (
                <Stack spacing={1.5} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Poll Question"
                    value={formData.pollQuestion}
                    onChange={(e) => setFormData({ ...formData, pollQuestion: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  ))}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setFormData({ ...formData, pollOptions: [...formData.pollOptions, ''] })}
                    sx={{ alignSelf: 'flex-start', textTransform: 'none', color: '#F5A623' }}
                  >
                    Add Option
                  </Button>
                </Stack>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setComposerOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
              {t.cancel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                bgcolor: '#F5A623',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': { bgcolor: '#E09212' }
              }}
            >
              {t.publish}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CampusFeed;
