import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { translations } from '../utils/translations';

const ProfileEditModal = ({ open, onClose, user, onProfileUpdated, lang = 'en' }) => {
  const t = translations[lang] || translations.en;

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    role: user?.role || 'student',
    academicTitle: user?.academicTitle || (user?.role === 'teacher' ? 'Lecturer' : 'Undergraduate Student'),
    department: user?.department || 'Computer Science',
    officeHours: user?.officeHours || 'Monday & Wednesday 2:00 PM - 4:00 PM',
    campus: user?.campus || 'Wollo University - Main Campus',
    bio: user?.bio || ''
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(lang === 'am' ? 'መገለጫዎ በተሳካ ሁኔታ ተሻሽሏል' : lang === 'om' ? 'Profaayiliin keessan sirreeffameera' : 'Profile updated successfully');
      if (onProfileUpdated) {
        onProfileUpdated(response.data);
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: '#F5A623', width: 36, height: 36 }}>
            <SchoolIcon fontSize="small" sx={{ color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2B2B2B', fontSize: '1.15rem' }}>
              {t.editProfile}
            </Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>
              Wollo University Academic Profile
            </Typography>
          </Box>
        </Stack>
        <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', color: '#888' }}>
          <CloseIcon fontSize="small" />
        </Button>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2.5, pb: 2 }}>
          <Stack spacing={2.2}>
            {/* Academic Role Selection */}
            <FormControl fullWidth size="small">
              <InputLabel id="role-select-label">Academic Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                label="Academic Role"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <BadgeIcon fontSize="small" sx={{ color: '#F5A623' }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="student">{t.roleStudent}</MenuItem>
                <MenuItem value="teacher">{t.roleTeacher}</MenuItem>
                <MenuItem value="ta">{t.roleTA}</MenuItem>
              </Select>
            </FormControl>

            {/* Names row */}
            <Stack direction="row" spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Stack>

            {/* Academic Title / Rank */}
            <TextField
              fullWidth
              size="small"
              label={formData.role === 'teacher' ? 'Academic Rank (e.g. Associate Professor)' : 'Study Status (e.g. 3rd Year Software Engineering)'}
              name="academicTitle"
              value={formData.academicTitle}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Department / Faculty */}
            <TextField
              fullWidth
              size="small"
              label={t.department}
              name="department"
              value={formData.department}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon fontSize="small" sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Office Hours / Availability */}
            <TextField
              fullWidth
              size="small"
              label={formData.role === 'teacher' ? 'Office Consultation Hours' : 'Study Group Availability'}
              name="officeHours"
              value={formData.officeHours}
              onChange={handleChange}
              helperText={formData.role === 'teacher' ? 'When students can visit or consult you' : 'When peers can reach out for study sessions'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon fontSize="small" sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Campus / Location */}
            <TextField
              fullWidth
              size="small"
              label={t.campusOffice}
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon fontSize="small" sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Bio */}
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label={t.bio}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder={formData.role === 'teacher' ? 'Research interests, courses taught, lab details...' : 'Major interests, projects, study interests...'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <DescriptionIcon fontSize="small" sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}>
            {t.cancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={<SaveIcon />}
            sx={{
              background: '#F5A623',
              color: '#fff',
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(245, 166, 35, 0.3)',
              '&:hover': { background: '#E09212' }
            }}
          >
            {saving ? 'Saving...' : t.saveChanges}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileEditModal;
