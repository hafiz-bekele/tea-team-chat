import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, PhotoCamera, LocalCafe } from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await axios.post('/api/upload/file', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update profile picture URL
      const imageUrl = `http://localhost:5000${response.data.url}`;
      setFormData({ ...formData, profilePicture: imageUrl });
      toast.success('Image uploaded! Click Save to update your profile.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', {
        username: formData.username,
        profilePicture: formData.profilePicture
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update user in context
      setUser({ ...user, ...response.data });
      
      toast.success('Profile updated successfully! ☕');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)' }}>
      <AppBar position="static" sx={{ background: '#F5A623' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/chat')}>
            <ArrowBack />
          </IconButton>
          <LocalCafe sx={{ ml: 2, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Profile Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: '#FFFBF0' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={formData.profilePicture}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: '#F5A623', 
                  fontSize: '3rem',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {formData.username[0]?.toUpperCase()}
              </Avatar>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              
              {/* Upload button */}
              <IconButton
                onClick={handleImageClick}
                disabled={uploading}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#F5A623',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: '#D4A574' },
                  '&:disabled': { bgcolor: '#CCC' }
                }}
              >
                {uploading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <PhotoCamera />
                )}
              </IconButton>
            </Box>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600, color: '#4A3728' }}>
              {formData.username}
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B6F47', mt: 0.5 }}>
              Click camera icon to upload photo
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#F5A623' },
                  '&.Mui-focused fieldset': { borderColor: '#F5A623' },
                }
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              disabled
              helperText="Email cannot be changed"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#F5A623' },
                  '&.Mui-focused fieldset': { borderColor: '#F5A623' },
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                background: '#F5A623',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { background: '#D4A574' }
              }}
            >
              Save Changes
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/chat')}
              sx={{
                mt: 2,
                py: 1.5,
                borderColor: '#F5A623',
                color: '#F5A623',
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#D4A574',
                  background: 'rgba(245, 166, 35, 0.05)'
                }
              }}
            >
              Cancel
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
