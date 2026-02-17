import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LocalCafe as LocalCafeIcon } from '@mui/icons-material';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      
      if (token) {
        try {
          // Store token
          localStorage.setItem('token', token);
          
          // Fetch user data
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            // Update auth context
            login({ ...userData, token });
            
            // Redirect to chat
            navigate('/chat', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        } catch (error) {
          console.error('Auth error:', error);
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, navigate, login]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
      }}
    >
      <LocalCafeIcon sx={{ fontSize: 80, color: '#F5A623', mb: 3 }} />
      <CircularProgress sx={{ color: '#F5A623', mb: 2 }} />
      <Typography variant="h6" sx={{ color: '#4A3728' }}>
        Signing you in...
      </Typography>
      <Typography variant="body2" sx={{ color: '#8B6F47', mt: 1 }}>
        Please wait while we prepare your chat
      </Typography>
    </Box>
  );
};

export default AuthSuccess;
