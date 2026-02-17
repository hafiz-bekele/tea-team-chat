import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
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
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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

    const success = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (success) {
      navigate('/chat');
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
      background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LocalCafeIcon sx={{ fontSize: 60, color: '#F5A623', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4A3728' }}>
            Join Tea Team Chat
          </Typography>
        </Box>

        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: '#FFFBF0',
            border: '2px solid #F5A623'
          }}
        >
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: '#4A3728' }}>
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
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
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#F5A623' },
                  '&.Mui-focused fieldset': { borderColor: '#F5A623' },
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#F5A623' },
                  '&.Mui-focused fieldset': { borderColor: '#F5A623' },
                }
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
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
                mb: 2,
                py: 1.5,
                background: '#F5A623',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { background: '#D4A574' }
              }}
            >
              Sign Up
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography sx={{ color: '#8B6F47' }}>OR</Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ 
              mb: 2,
              py: 1.5,
              borderColor: '#F5A623',
              color: '#F5A623',
              fontWeight: 600,
              '&:hover': { 
                borderColor: '#D4A574',
                background: 'rgba(245, 166, 35, 0.1)'
              }
            }}
          >
            Continue with Google
          </Button>

          <Typography align="center" sx={{ mt: 2, color: '#6B4423' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#F5A623', 
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Log in
            </Link>
          </Typography>

          <Typography align="center" sx={{ mt: 1 }}>
            <Link 
              to="/" 
              style={{ 
                color: '#8B6F47', 
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              ← Back to Home
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
