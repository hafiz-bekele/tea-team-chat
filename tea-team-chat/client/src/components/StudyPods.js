import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import {
  Groups as GroupsIcon,
  VideoCall as VideoIcon,
  HeadsetMic as AudioIcon,
  School as SchoolIcon,
  LockOpen as PublicIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { translations } from '../utils/translations';

const DEFAULT_PODS = [
  {
    id: 'pod-1',
    name: 'CS Year 3: Distributed Systems & Cloud',
    host: 'Prof. Yohannes K.',
    hostRole: 'teacher',
    membersCount: 14,
    topic: 'Consensus Algorithms & Raft Election Practical Review',
    status: 'live',
    type: 'video'
  },
  {
    id: 'pod-2',
    name: 'AI & Machine Learning Study Sprint',
    host: 'Dawit B.',
    hostRole: 'student',
    membersCount: 8,
    topic: 'Neural Network Backpropagation Matrix Math',
    status: 'live',
    type: 'audio'
  },
  {
    id: 'pod-3',
    name: 'Faculty Q&A Consultation Lounge',
    host: 'Dr. Rahel Mengistu',
    hostRole: 'teacher',
    membersCount: 5,
    topic: 'Open Office Hours: DSP Lab 4 Inquiries & Filter Design',
    status: 'live',
    type: 'video'
  },
  {
    id: 'pod-4',
    name: 'Freshman Engineering Mathematics I',
    host: 'Kaleb A. (TA)',
    hostRole: 'ta',
    membersCount: 22,
    topic: 'Integration by Parts & Substitution Worksheets',
    status: 'live',
    type: 'audio'
  }
];

const StudyPods = ({ user, onStartVideoCall, lang = 'en' }) => {
  const t = translations[lang] || translations.en;
  const [pods, setPods] = useState(DEFAULT_PODS);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPod, setNewPod] = useState({ name: '', topic: '', type: 'video' });

  const handleJoinPod = (pod) => {
    toast.success(`Joined ${pod.name}! Connecting audio and video stream...`);
    if (onStartVideoCall) {
      onStartVideoCall(pod);
    }
  };

  const handleCreatePod = (e) => {
    e.preventDefault();
    if (!newPod.name.trim()) return;

    const created = {
      id: `pod-${Date.now()}`,
      name: newPod.name,
      host: user?.username || 'You',
      hostRole: user?.role || 'student',
      membersCount: 1,
      topic: newPod.topic || 'General Collaborative Study Session',
      status: 'live',
      type: newPod.type
    };

    setPods([created, ...pods]);
    setCreateDialogOpen(false);
    setNewPod({ name: '', topic: '', type: 'video' });
    toast.success('Study Pod created! Peers can now join.');
  };

  return (
    <Box sx={{ height: '100%', p: { xs: 2, md: 3 }, bgcolor: '#F8FAFC', overflowY: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.5 }}>
            {t.studyRooms}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Live collaborative study lounges for students, teaching assistants, and faculty
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
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
          Create Study Pod
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {pods.map((pod) => {
          const isTeacherHost = pod.hostRole === 'teacher';

          return (
            <Grid item xs={12} sm={6} md={6} key={pod.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: isTeacherHost ? '1.5px solid #BFDBFE' : '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  {/* Status header */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                      icon={<ActiveIcon sx={{ color: '#10B981 !important', fontSize: 16 }} />}
                      label="LIVE NOW"
                      size="small"
                      sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      {pod.type === 'video' ? <VideoIcon fontSize="small" sx={{ color: '#3B82F6' }} /> : <AudioIcon fontSize="small" sx={{ color: '#8B5CF6' }} />}
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B' }}>
                        {pod.membersCount} participants
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Name */}
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.8, fontSize: '1.05rem' }}>
                    {pod.name}
                  </Typography>

                  {/* Topic */}
                  <Typography variant="body2" sx={{ color: '#475569', mb: 2, minHeight: 40, lineHeight: 1.5 }}>
                    {pod.topic}
                  </Typography>

                  {/* Host info */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 1, borderTop: '1px solid #F1F5F9' }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: isTeacherHost ? '#3B82F6' : '#10B981' }}>
                      <SchoolIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E293B', display: 'block' }}>
                        Host: {pod.host}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                        {isTeacherHost ? t.roleTeacher : t.roleStudent}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={pod.type === 'video' ? <VideoIcon /> : <AudioIcon />}
                    onClick={() => handleJoinPod(pod)}
                    sx={{
                      bgcolor: isTeacherHost ? '#3B82F6' : '#F5A623',
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1,
                      '&:hover': { bgcolor: isTeacherHost ? '#2563EB' : '#E09212' }
                    }}
                  >
                    Join {pod.type === 'video' ? 'Video Study Room' : 'Audio Lounge'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create Pod Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>New Study Pod</Typography>
          <IconButton size="small" onClick={() => setCreateDialogOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleCreatePod}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Study Room Name"
                value={newPod.name}
                onChange={(e) => setNewPod({ ...newPod, name: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Study Topic / Agenda"
                value={newPod.topic}
                onChange={(e) => setNewPod({ ...newPod, topic: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#F5A623', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#E09212' } }}>
              Start Pod
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default StudyPods;
