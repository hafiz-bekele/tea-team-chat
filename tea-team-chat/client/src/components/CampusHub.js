import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Chip,
  Button,
  Paper,
  Divider
} from '@mui/material';
import {
  DynamicFeed as FeedIcon,
  PlayCircle as ShortsIcon,
  Groups as PodsIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import CampusFeed from './CampusFeed';
import CampusShorts from './CampusShorts';
import StudyPods from './StudyPods';
import { translations } from '../utils/translations';

const CampusHub = ({
  user,
  onOpenProfile,
  onDirectMessage,
  onStartVideoCall,
  lang = 'en'
}) => {
  const t = translations[lang] || translations.en;
  const [hubTab, setHubTab] = useState('feed');

  const isTeacher = user?.role === 'teacher';
  const isTA = user?.role === 'ta';

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC' }}>
      {/* Dynamic Top Bar with User Profile Card & Hub Tabs */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          pb: 0,
          borderBottom: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          borderRadius: 0
        }}
      >
        {/* Profile Card Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.8} alignItems="center">
            <Avatar
              sx={{
                bgcolor: isTeacher ? '#3B82F6' : isTA ? '#F59E0B' : '#10B981',
                width: 48,
                height: 48,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {isTeacher ? <SchoolIcon /> : <PersonIcon />}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || 'Wollo Scholar'}
                </Typography>
                {(isTeacher || user?.isVerified) && (
                  <VerifiedIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
                )}
                <Chip
                  size="small"
                  label={isTeacher ? t.roleTeacher : isTA ? t.roleTA : t.roleStudent}
                  sx={{
                    height: 22,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    bgcolor: isTeacher ? '#EFF6FF' : isTA ? '#FFFBEB' : '#ECFDF5',
                    color: isTeacher ? '#1D4ED8' : isTA ? '#B45309' : '#047857'
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.3 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  {user?.department || 'Computer Science Department'}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {user?.officeHours || (isTeacher ? 'Available for consultations' : 'Active study pod')}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* Edit Profile Action */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon fontSize="small" />}
            onClick={onOpenProfile}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              borderColor: '#CBD5E1',
              color: '#334155',
              '&:hover': { borderColor: '#F5A623', color: '#F5A623', bgcolor: '#FFFBEB' }
            }}
          >
            {t.editProfile}
          </Button>
        </Stack>

        {/* Hub Tabs */}
        <Tabs
          value={hubTab}
          onChange={(e, val) => setHubTab(val)}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#64748B',
              '&.Mui-selected': { color: '#F5A623' }
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#F5A623',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab
            value="feed"
            icon={<FeedIcon fontSize="small" />}
            iconPosition="start"
            label={t.feed}
          />
          <Tab
            value="shorts"
            icon={<ShortsIcon fontSize="small" />}
            iconPosition="start"
            label={t.shorts}
          />
          <Tab
            value="pods"
            icon={<PodsIcon fontSize="small" />}
            iconPosition="start"
            label={t.studyRooms}
          />
        </Tabs>
      </Paper>

      {/* Hub Tab View Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {hubTab === 'feed' && (
          <CampusFeed
            user={user}
            onDirectMessage={onDirectMessage}
            lang={lang}
          />
        )}
        {hubTab === 'shorts' && (
          <CampusShorts
            user={user}
            lang={lang}
          />
        )}
        {hubTab === 'pods' && (
          <StudyPods
            user={user}
            onStartVideoCall={onStartVideoCall}
            lang={lang}
          />
        )}
      </Box>
    </Box>
  );
};

export default CampusHub;
