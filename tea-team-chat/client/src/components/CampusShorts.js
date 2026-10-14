import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  AddCircleOutline as AddIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  Send as SendIcon,
  MusicNote as MusicNoteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { translations } from '../utils/translations';

// High-quality educational campus sample shorts with real study visuals
const INITIAL_SHORTS = [
  {
    id: 'short-1',
    title: '3-Minute Masterclass: Fast Matrix Multiplication for AI',
    description: 'Breakdown of Strassen algorithm vs standard O(n^3) matrix multiplication. Vital for university exam preparation and neural networks!',
    author: 'Prof. Yohannes K.',
    role: 'teacher',
    department: 'Computer Science',
    views: '2.4K',
    likesCount: 342,
    commentsCount: 28,
    soundTrack: 'Faculty Lecture Series Vol. 4',
    bgGradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    videoCodeSnippet: 'C[i][j] = sum(A[i][k] * B[k][j])\n// Strassen recursive submatrices\nM1 = (A11 + A22) * (B11 + B22)\nM2 = (A21 + A22) * B11\nComplexity reduced to O(n^2.807) [Optimal]',
    comments: [
      { id: 'c1', user: 'Selamawit', role: 'student', text: 'Will this question appear in Monday midterm exam?' },
      { id: 'c2', user: 'Prof. Yohannes K.', role: 'teacher', text: 'Yes, Section 3 will include recursive master theorem calculation.' }
    ]
  },
  {
    id: 'short-2',
    title: 'Wollo University Lab: Digital Signal Processing Oscilloscope Demo',
    description: 'Capturing sinusoidal interference and configuring low-pass Butterworth filters on Lab Bench 4. Check out the noise attenuation!',
    author: 'Dr. Rahel M.',
    role: 'teacher',
    department: 'Electrical Engineering',
    views: '1.8K',
    likesCount: 289,
    commentsCount: 19,
    soundTrack: 'Lab Bench 4 Audio Log',
    bgGradient: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
    videoCodeSnippet: 'H(s) = 1 / (s^2 + sqrt(2)*s + 1)\nfc = 2.4 kHz Cutoff Frequency\nSignal-to-Noise Ratio: +18 dB Gain',
    comments: [
      { id: 'c3', user: 'Dawit B.', role: 'student', text: 'Thank you Doctor, this clears up the lab report calculations!' }
    ]
  },
  {
    id: 'short-3',
    title: 'Student Study Trick: How to Remember All 12 Cranial Nerves',
    description: 'Medical & Health Sciences campus mnemonic that saved our entire study pod during the anatomy practical session!',
    author: 'Blen Tesfaye',
    role: 'student',
    department: 'Medicine & Health',
    views: '4.1K',
    likesCount: 512,
    commentsCount: 46,
    soundTrack: 'Campus Study Lounge Beats',
    bgGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    videoCodeSnippet: 'I: Olfactory (Smell)\nII: Optic (Vision)\nIII: Oculomotor (Eye movement)\nIV: Trochlear (Superior oblique)\nV: Trigeminal (Facial sensory)',
    comments: [
      { id: 'c4', user: 'Kaleb A.', role: 'student', text: 'Saved this right to my bookmarks!' }
    ]
  }
];

const CampusShorts = ({ user, lang = 'en' }) => {
  const t = translations[lang] || translations.en;

  const [shortsList, setShortsList] = useState(INITIAL_SHORTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [bookmarkedMap, setBookmarkedMap] = useState({});
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newShortForm, setNewShortForm] = useState({
    title: '',
    description: '',
    department: 'Computer Science',
    snippet: ''
  });

  const activeShort = shortsList[currentIndex] || shortsList[0];

  const handleNext = () => {
    if (currentIndex < shortsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(shortsList.length - 1);
    }
  };

  const toggleLike = (shortId) => {
    const isLiked = likedMap[shortId];
    setLikedMap(prev => ({ ...prev, [shortId]: !isLiked }));
    setShortsList(prev => prev.map(s => {
      if (s.id === shortId) {
        return {
          ...s,
          likesCount: isLiked ? s.likesCount - 1 : s.likesCount + 1
        };
      }
      return s;
    }));
  };

  const toggleBookmark = (shortId) => {
    const isSaved = bookmarkedMap[shortId];
    setBookmarkedMap(prev => ({ ...prev, [shortId]: !isSaved }));
    toast.success(isSaved ? 'Removed from bookmarks' : 'Saved to campus bookmarks');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Campus short link copied to clipboard');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now().toString(),
      user: user?.username || 'You',
      role: user?.role || 'student',
      text: newComment.trim()
    };

    setShortsList(prev => prev.map(s => {
      if (s.id === activeShort.id) {
        return {
          ...s,
          commentsCount: (s.commentsCount || 0) + 1,
          comments: [...(s.comments || []), commentObj]
        };
      }
      return s;
    }));

    setNewComment('');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newShortForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const createdShort = {
      id: `short-${Date.now()}`,
      title: newShortForm.title,
      description: newShortForm.description || 'New campus study clip uploaded by faculty/student.',
      author: user?.username || 'You',
      role: user?.role || 'student',
      department: newShortForm.department || user?.department || 'Computer Science',
      views: '1',
      likesCount: 1,
      commentsCount: 0,
      soundTrack: 'Original Campus Clip',
      bgGradient: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
      videoCodeSnippet: newShortForm.snippet || '// Quick study concept demonstration',
      comments: []
    };

    setShortsList(prev => [createdShort, ...prev]);
    setCurrentIndex(0);
    setUploadOpen(false);
    setNewShortForm({ title: '', description: '', department: 'Computer Science', snippet: '' });
    toast.success('Campus Short published successfully');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0B0F19', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Top Header Bar */}
      <Box sx={{
        px: 3,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(11, 15, 25, 0.85)',
        zIndex: 10
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
            {t.shorts}
          </Typography>
          <Chip
            size="small"
            label={`${currentIndex + 1} / ${shortsList.length}`}
            sx={{ bgcolor: 'rgba(245, 166, 35, 0.2)', color: '#F5A623', fontWeight: 700 }}
          />
        </Stack>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setUploadOpen(true)}
          sx={{
            background: 'linear-gradient(45deg, #F5A623, #FF8C00)',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: '0 4px 14px rgba(245, 166, 35, 0.4)'
          }}
        >
          {t.createShort}
        </Button>
      </Box>

      {/* Main Shorts Container */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        p: { xs: 1, md: 2 }
      }}>
        {/* Vertical Reel Card */}
        <Paper
          elevation={12}
          sx={{
            width: '100%',
            maxWidth: 440,
            height: '100%',
            maxHeight: 700,
            borderRadius: 4,
            background: activeShort.bgGradient,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          {/* Animated Video Simulation / Visualizer Canvas */}
          <Box
            onClick={() => setIsPlaying(!isPlaying)}
            sx={{
              position: 'absolute',
              inset: 0,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 3,
              zIndex: 1
            }}
          >
            {/* Visualizer center card */}
            <Box sx={{
              width: '90%',
              bgcolor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(16px)',
              borderRadius: 3,
              p: 2.5,
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF5F56' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27C93F' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', ml: 1, fontFamily: 'monospace' }}>
                  Wollo_Academic_Study_Clip.mp4
                </Typography>
              </Stack>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#4ADE80',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  m: 0
                }}
              >
                {activeShort.videoCodeSnippet}
              </Typography>
            </Box>

            {/* Play/Pause overlay indicator */}
            {!isPlaying && (
              <Box sx={{
                position: 'absolute',
                bgcolor: 'rgba(0,0,0,0.65)',
                borderRadius: '50%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlayArrowIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Box>
            )}
          </Box>

          {/* Top Info overlay */}
          <Box sx={{ p: 2.5, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              icon={<SchoolIcon fontSize="small" sx={{ color: '#fff !important' }} />}
              label={activeShort.department}
              size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(8px)' }}
            />
            <IconButton
              size="small"
              onClick={() => setIsMuted(!isMuted)}
              sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
              {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
          </Box>

          {/* Floating Right Action Bar (TikTok Style) */}
          <Box sx={{
            position: 'absolute',
            right: 12,
            bottom: 110,
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            {/* Like */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton
                onClick={() => toggleLike(activeShort.id)}
                sx={{
                  bgcolor: likedMap[activeShort.id] ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0,0,0,0.45)',
                  color: likedMap[activeShort.id] ? '#EF4444' : '#fff',
                  p: 1.2,
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.15)', bgcolor: 'rgba(0,0,0,0.6)' }
                }}
              >
                {likedMap[activeShort.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 700, mt: 0.5, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {activeShort.likesCount}
              </Typography>
            </Box>

            {/* Comment */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton
                onClick={() => setCommentsOpen(true)}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.45)',
                  color: '#fff',
                  p: 1.2,
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                }}
              >
                <CommentIcon />
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 700, mt: 0.5, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {activeShort.commentsCount}
              </Typography>
            </Box>

            {/* Bookmark */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton
                onClick={() => toggleBookmark(activeShort.id)}
                sx={{
                  bgcolor: bookmarkedMap[activeShort.id] ? 'rgba(245, 166, 35, 0.3)' : 'rgba(0,0,0,0.45)',
                  color: bookmarkedMap[activeShort.id] ? '#F5A623' : '#fff',
                  p: 1.2,
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                }}
              >
                {bookmarkedMap[activeShort.id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 700, mt: 0.5, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {t.bookmark}
              </Typography>
            </Box>

            {/* Share */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton
                onClick={handleShare}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.45)',
                  color: '#fff',
                  p: 1.2,
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                }}
              >
                <ShareIcon />
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 700, mt: 0.5, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {t.share}
              </Typography>
            </Box>
          </Box>

          {/* Bottom Video Metadata */}
          <Box sx={{
            p: 2.5,
            zIndex: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)',
            pt: 4
          }}>
            {/* Creator Row */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: activeShort.role === 'teacher' ? '#3B82F6' : '#10B981' }}>
                {activeShort.role === 'teacher' ? <SchoolIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
              </Avatar>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {activeShort.author}
                {activeShort.role === 'teacher' && <VerifiedIcon sx={{ fontSize: 16, color: '#3B82F6' }} />}
              </Typography>
              <Chip
                size="small"
                label={activeShort.role === 'teacher' ? t.roleTeacher : t.roleStudent}
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: activeShort.role === 'teacher' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                  color: activeShort.role === 'teacher' ? '#93C5FD' : '#A7F3D0'
                }}
              />
            </Stack>

            {/* Title & Description */}
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, lineHeight: 1.3 }}>
              {activeShort.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {activeShort.description}
            </Typography>

            {/* Audio Track */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.2 }}>
              <MusicNoteIcon fontSize="small" sx={{ color: '#F5A623', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: '#F5A623', fontWeight: 600 }}>
                {activeShort.soundTrack}
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* Up / Down Navigation Buttons */}
        <Box sx={{
          position: 'absolute',
          right: { xs: 8, md: 30 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          zIndex: 5
        }}>
          <IconButton
            onClick={handlePrev}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
            }}
          >
            <UpIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
            }}
          >
            <DownIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Slide-over Comments Drawer */}
      <Drawer
        anchor="right"
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 380 },
            bgcolor: '#141A29',
            color: '#fff',
            p: 2.5
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {t.comment}s ({activeShort.comments?.length || 0})
          </Typography>
          <IconButton size="small" onClick={() => setCommentsOpen(false)} sx={{ color: '#aaa' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

        {/* Comments List */}
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {(activeShort.comments || []).map(c => (
            <ListItem key={c.id} alignItems="flex-start" sx={{ px: 0, py: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32, bgcolor: c.role === 'teacher' ? '#3B82F6' : '#10B981' }}>
                  {c.role === 'teacher' ? <SchoolIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                      {c.user}
                    </Typography>
                    <Chip
                      size="small"
                      label={c.role === 'teacher' ? t.roleTeacher : t.roleStudent}
                      sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.1)', color: '#bbb' }}
                    />
                  </Stack>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5, fontSize: '0.85rem' }}>
                    {c.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Post Comment Input */}
        <Box component="form" onSubmit={handleAddComment} sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t.comment + '...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              input: { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
            }}
          />
          <IconButton type="submit" sx={{ bgcolor: '#F5A623', color: '#fff', '&:hover': { bgcolor: '#E09212' } }}>
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Drawer>

      {/* Upload Short Modal */}
      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            bgcolor: '#192231',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t.createShort}
          </Typography>
          <IconButton size="small" onClick={() => setUploadOpen(false)} sx={{ color: '#888' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleUploadSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Short Title / Lesson Name"
                value={newShortForm.title}
                onChange={(e) => setNewShortForm({ ...newShortForm, title: e.target.value })}
                InputLabelProps={{ sx: { color: '#aaa' } }}
                sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Department"
                value={newShortForm.department}
                onChange={(e) => setNewShortForm({ ...newShortForm, department: e.target.value })}
                InputLabelProps={{ sx: { color: '#aaa' } }}
                sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Description & Key Takeaway"
                value={newShortForm.description}
                onChange={(e) => setNewShortForm({ ...newShortForm, description: e.target.value })}
                InputLabelProps={{ sx: { color: '#aaa' } }}
                sx={{ textarea: { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                label="Code Snippet / Formula / Visual Notes"
                value={newShortForm.snippet}
                onChange={(e) => setNewShortForm({ ...newShortForm, snippet: e.target.value })}
                InputLabelProps={{ sx: { color: '#aaa' } }}
                sx={{ textarea: { color: '#4ADE80', fontFamily: 'monospace' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setUploadOpen(false)} sx={{ color: '#aaa' }}>
              {t.cancel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#F5A623', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#E09212' } }}
            >
              {t.publish}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CampusShorts;
