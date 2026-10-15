import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardActionArea,
  IconButton,
  Dialog,
  DialogContent,
  LinearProgress,
  Stack,
  TextField,
  Button,
  DialogTitle,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  Send as SendIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { translations } from '../utils/translations';

const formatStoryTime = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const CampusStories = ({ user, lang = 'en' }) => {
  const t = translations[lang] || translations.en;
  const [stories, setStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)');

  const progressTimerRef = useRef(null);

  // Fetch real stories from backend
  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/stories', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data && res.data.length > 0) {
        const formatted = res.data.map(s => ({
          id: s._id,
          author: s.author?.username || s.authorName || 'Campus Member',
          role: s.author?.role || s.role || 'student',
          avatar: s.author?.profilePicture || '',
          time: formatStoryTime(s.createdAt),
          bgGradient: s.bgGradient || 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          content: s.content,
          previewTitle: s.previewTitle || s.content.slice(0, 24) + '...',
          views: s.views || [],
          replies: s.replies || []
        }));
        setStories(formatted);
      }
    } catch (err) {
      console.warn('Using existing stories:', err.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Auto-advancing story timer
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + 2; // 50 steps * 100ms = 5 seconds per story
      });
    }, 100);

    return () => clearInterval(progressTimerRef.current);
  }, [activeStoryIndex, isPaused]);

  const handleOpenStory = async (index) => {
    setActiveStoryIndex(index);
    setProgress(0);
    setIsPaused(false);
    const targetStory = stories[index];
    if (targetStory?.id) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`/api/stories/${targetStory.id}/view`, {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
      } catch (e) {
        // Silent view count error
      }
    }
  };

  const handleCloseStory = () => {
    setActiveStoryIndex(null);
    setProgress(0);
    setIsPaused(false);
    clearInterval(progressTimerRef.current);
  };

  const handleNextStory = () => {
    setProgress(0);
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
    } else {
      handleCloseStory();
    }
  };

  const handlePrevStory = () => {
    setProgress(0);
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || activeStoryIndex === null) return;
    const currentStory = stories[activeStoryIndex];
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/stories/${currentStory.id}/reply`, { text: replyText }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      toast.success(`Reply sent to ${currentStory.author}`);
      setReplyText('');
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!storyText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/stories', {
        content: storyText.trim(),
        previewTitle: storyText.trim().slice(0, 24) + '...',
        bgGradient: selectedGradient
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const created = {
        id: res.data._id,
        author: res.data.author?.username || user?.username || 'You',
        role: res.data.author?.role || user?.role || 'student',
        avatar: res.data.author?.profilePicture || user?.profilePicture || '',
        time: 'Just now',
        bgGradient: res.data.bgGradient || selectedGradient,
        content: res.data.content,
        previewTitle: res.data.previewTitle || storyText.slice(0, 24) + '...'
      };

      setStories([created, ...stories]);
      setCreateStoryOpen(false);
      setStoryText('');
      toast.success('Your story was published successfully to campus');
    } catch (err) {
      console.error('Error creating story:', err);
      toast.error('Failed to publish story');
    }
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <Box sx={{ mb: 2.5, width: '100%' }}>
      {/* Horizontal Stories Ribbon */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 1,
          pt: 0.5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {/* Create Story Card (Facebook Style) */}
        <Card
          elevation={0}
          sx={{
            minWidth: 125,
            maxWidth: 125,
            height: 195,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' }
          }}
        >
          <CardActionArea
            onClick={() => setCreateStoryOpen(true)}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 0 }}
          >
            {/* Top Half Avatar */}
            <Box
              sx={{
                width: '100%',
                height: 130,
                bgcolor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'linear-gradient(180deg, #F5A623 0%, #FFF8E7 100%)'
              }}
            >
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: user?.role === 'teacher' ? '#3B82F6' : '#F5A623',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                }}
              >
                {user?.role === 'teacher' ? <SchoolIcon /> : <PersonIcon />}
              </Avatar>
            </Box>

            {/* Bottom Plus Icon & Text */}
            <Box
              sx={{
                width: '100%',
                bgcolor: '#FFFFFF',
                pt: 1.8,
                pb: 1.2,
                px: 1,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -18,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#1877F2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                <AddIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A', display: 'block', fontSize: '0.78rem' }}>
                Create story
              </Typography>
            </Box>
          </CardActionArea>
        </Card>

        {/* Existing Stories Cards */}
        {stories.map((story, idx) => {
          const isTeacher = story.role === 'teacher';

          return (
            <Card
              key={story.id}
              elevation={0}
              sx={{
                minWidth: 125,
                maxWidth: 125,
                height: 195,
                borderRadius: 3,
                background: story.bgGradient,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <CardActionArea
                onClick={() => handleOpenStory(idx)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 1.5,
                  alignItems: 'flex-start'
                }}
              >
                {/* Author Avatar with glowing blue/orange ring */}
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: isTeacher ? '#1D4ED8' : '#059669',
                    border: '3px solid #1877F2',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                  }}
                >
                  {isTeacher ? <SchoolIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                </Avatar>

                {/* Story Preview Snippet */}
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#fff',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '0.78rem',
                      lineHeight: 1.25,
                      textShadow: '0 1px 3px rgba(0,0,0,0.6)'
                    }}
                  >
                    {story.previewTitle}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                      display: 'block',
                      mt: 0.3,
                      fontSize: '0.68rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                    }}
                  >
                    {story.author}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      {/* Fullscreen-style Facebook Story Viewer Modal */}
      <Dialog
        open={activeStoryIndex !== null}
        onClose={handleCloseStory}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#0B0F19',
            color: '#fff',
            p: 0,
            height: 600
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {activeStory && (
            <Box
              sx={{
                flex: 1,
                background: activeStory.bgGradient,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Top Progress Bar */}
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#FFFFFF' }
                  }}
                />
              </Box>

              {/* Author Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Avatar sx={{ bgcolor: activeStory.role === 'teacher' ? '#3B82F6' : '#10B981', width: 38, height: 38 }}>
                    {activeStory.role === 'teacher' ? <SchoolIcon /> : <PersonIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {activeStory.author}
                      {activeStory.role === 'teacher' && <VerifiedIcon sx={{ fontSize: 16, color: '#60A5FA' }} />}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {activeStory.time}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => setIsPaused(!isPaused)} sx={{ color: '#fff' }}>
                    {isPaused ? <PlayIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={handleCloseStory} sx={{ color: '#fff' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Story Main Content */}
              <Box sx={{ my: 'auto', textAlign: 'center', px: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.5, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                  {activeStory.content}
                </Typography>
              </Box>

              {/* Previous & Next Navigation overlay arrows */}
              <IconButton
                onClick={handlePrevStory}
                disabled={activeStoryIndex === 0}
                sx={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                }}
              >
                <PrevIcon sx={{ fontSize: 16 }} />
              </IconButton>

              <IconButton
                onClick={handleNextStory}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                }}
              >
                <NextIcon sx={{ fontSize: 16 }} />
              </IconButton>

              {/* Bottom Reply Input */}
              <Box component="form" onSubmit={handleSendReply} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Reply to ${activeStory.author}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    input: { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' }
                  }}
                />
                <IconButton type="submit" sx={{ bgcolor: '#1877F2', color: '#fff', '&:hover': { bgcolor: '#0D6EFD' } }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Story Dialog */}
      <Dialog open={createStoryOpen} onClose={() => setCreateStoryOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#0F172A' }}>
          Create Campus Story
        </DialogTitle>
        <form onSubmit={handleCreateStory}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="What is your academic update or study thought for today?"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
                  Select Background Style
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {[
                    'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                    'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
                    'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
                    'linear-gradient(135deg, #C2410C 0%, #F97316 100%)',
                    'linear-gradient(135deg, #0F172A 0%, #334155 100%)'
                  ].map((grad, i) => (
                    <Box
                      key={i}
                      onClick={() => setSelectedGradient(grad)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: grad,
                        cursor: 'pointer',
                        border: selectedGradient === grad ? '3px solid #1877F2' : '2px solid #fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setCreateStoryOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#1877F2', color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#0D6EFD' } }}
            >
              Share to Story
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CampusStories;
