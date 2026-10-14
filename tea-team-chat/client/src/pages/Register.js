import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Google as GoogleIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const success = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        navigate('/chat');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF5E4 40%, #FFE8C2 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: 4,
      px: 2
    }}>
      {/* Soft Ambient Floating Orbs */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 166, 35, 0.22) 0%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        left: '15%',
        width: '340px',
        height: '340px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 165, 116, 0.22) 0%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(45px)',
        pointerEvents: 'none'
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, px: { xs: 1.5, sm: 2 } }}>
        {/* Compact Back Link */}
        <Box sx={{ mb: 2 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#8B6F47',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '20px',
              px: 1.5,
              py: 0.5,
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#D87B00'
              }
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Refined Glassmorphic Card */}
        <Box 
          sx={{ 
            p: { xs: 3, sm: 3.5 }, 
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 12px 40px rgba(139, 111, 71, 0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Box sx={{
              width: 46,
              height: 46,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 14px rgba(245, 166, 35, 0.35)',
              mb: 1.2
            }}>
              <LocalCafeIcon sx={{ fontSize: 24 }} />
            </Box>

            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                color: '#4A3728', 
                fontSize: '1.25rem',
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}
            >
              Create Account
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                color: '#8B6F47', 
                fontSize: '0.82rem',
                mt: 0.5,
                fontWeight: 500
              }}
            >
              Join Wollo University's Tea Team Chat
            </Typography>
          </Box>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4 }}>
              <TextField
                fullWidth
                size="small"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.88rem',
                    '& fieldset': {
                      borderColor: 'rgba(139, 111, 71, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F5A623',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D87B00',
                      borderWidth: '1.5px',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.85rem', color: '#8B6F47' }
                }}
              />

              <TextField
                fullWidth
                size="small"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.88rem',
                    '& fieldset': {
                      borderColor: 'rgba(139, 111, 71, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F5A623',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D87B00',
                      borderWidth: '1.5px',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.85rem', color: '#8B6F47' }
                }}
              />

              <TextField
                fullWidth
                size="small"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#8B6F47' }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.88rem',
                    '& fieldset': {
                      borderColor: 'rgba(139, 111, 71, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F5A623',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D87B00',
                      borderWidth: '1.5px',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.85rem', color: '#8B6F47' }
                }}
              />

              <TextField
                fullWidth
                size="small"
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.88rem',
                    '& fieldset': {
                      borderColor: 'rgba(139, 111, 71, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F5A623',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D87B00',
                      borderWidth: '1.5px',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.85rem', color: '#8B6F47' }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 0.5,
                  py: 1,
                  background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(245, 166, 35, 0.35)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #FFB74D 0%, #C96E00 100%)',
                    boxShadow: '0 6px 18px rgba(245, 166, 35, 0.45)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Box>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 2, borderColor: 'rgba(139, 111, 71, 0.15)' }}>
            <Typography sx={{ color: '#8B6F47', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.5px' }}>
              OR
            </Typography>
          </Divider>

          {/* Google Sign In */}
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
            onClick={handleGoogleLogin}
            sx={{ 
              py: 0.9,
              borderColor: 'rgba(139, 111, 71, 0.25)',
              background: 'rgba(255, 255, 255, 0.6)',
              color: '#4A3728',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              borderRadius: '12px',
              '&:hover': { 
                borderColor: '#F5A623',
                background: 'rgba(255, 255, 255, 0.95)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Continue with Google
          </Button>

          {/* Footer Login Link */}
          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6B4423', fontSize: '0.82rem' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#D87B00', 
                  textDecoration: 'none',
                  fontWeight: 700
                }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
