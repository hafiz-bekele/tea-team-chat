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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
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
      background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)'
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LocalCafeIcon sx={{ fontSize: 60, color: '#F5A623', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4A3728' }}>
            Welcome Back to Tea Team Chat
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
            Log In
          </Typography>

          <form onSubmit={handleSubmit}>
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
              Log In
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
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#F5A623', 
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Sign up
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

export default Login;
