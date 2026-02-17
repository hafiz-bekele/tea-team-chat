import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Rating,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: '#F5A623', boxShadow: 'none' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LocalCafeIcon sx={{ fontSize: 40, mr: 1, color: 'white' }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              TEA TEAM CHAT
            </Typography>
          </Box>
          
          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2, mr: 3 }}>
            <Button 
              onClick={() => navigate('/mission')}
              sx={{ 
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { background: 'rgba(255,255,255,0.1)' }
              }}
            >
              Mission & Objectives
            </Button>
            <Button 
              onClick={() => navigate('/about')}
              sx={{ 
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { background: 'rgba(255,255,255,0.1)' }
              }}
            >
              About Us
            </Button>
          </Box>

          <Button 
            onClick={() => navigate('/login')}
            sx={{ 
              color: 'white', 
              mr: 2,
              fontWeight: 600,
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            Log In
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            variant="contained"
            sx={{ 
              background: 'white', 
              color: '#F5A623',
              fontWeight: 600,
              '&:hover': { background: '#FFF8E7' }
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          minHeight: '80vh',
          py: 8
        }}>
          {/* Left Content */}
          <Box sx={{ flex: 1, pr: 4 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                color: '#4A3728',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Where Conversations Spill the Real Tea ☕
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#6B4423', 
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Join live group chats, share stories, and connect with your circle — safely and instantly.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                background: '#F5A623',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '50px',
                boxShadow: '0 4px 20px rgba(245, 166, 35, 0.4)',
                '&:hover': {
                  background: '#D4A574',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(245, 166, 35, 0.5)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Join the Chat
            </Button>

            {/* Ratings */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <AvatarGroup max={4} sx={{ mr: 2 }}>
                <Avatar sx={{ bgcolor: '#F5A623', width: 35, height: 35 }}>S</Avatar>
                <Avatar sx={{ bgcolor: '#D4A574', width: 35, height: 35 }}>H</Avatar>
                <Avatar sx={{ bgcolor: '#8B6F47', width: 35, height: 35 }}>R</Avatar>
                <Avatar sx={{ bgcolor: '#6B4423', width: 35, height: 35 }}>D</Avatar>
              </AvatarGroup>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={4.9} precision={0.1} readOnly size="small" />
                  <Typography sx={{ ml: 1, fontWeight: 600, color: '#4A3728' }}>
                    4.9
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#8B6F47' }}>
                  (1,220 ratings)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Content - Phone Mockup */}
          <Box sx={{ 
            flex: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box
              sx={{
                width: 300,
                height: 600,
                background: 'white',
                borderRadius: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                border: '8px solid #2C2C2C',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box sx={{ 
                background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
                height: '100%',
                p: 2
              }}>
                <Typography variant="h6" sx={{ textAlign: 'center', color: '#4A3728', mb: 2 }}>
                  The Tea Team 🍵
                </Typography>
                <Box sx={{ 
                  background: 'white', 
                  borderRadius: '15px', 
                  p: 2, 
                  mb: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Sarah</Typography>
                  <Typography variant="body2">OMG, spill it! 🫖</Typography>
                </Box>
                <Box sx={{ 
                  background: '#90C695', 
                  borderRadius: '15px', 
                  p: 2, 
                  mb: 1,
                  ml: 'auto',
                  maxWidth: '80%',
                  color: 'white'
                }}>
                  <Typography variant="body2">Haha! Omg, tell us everything! ☕</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Stats */}
        <Box sx={{ textAlign: 'center', pb: 6 }}>
          <Typography variant="h6" sx={{ color: '#6B4423', mb: 1 }}>
            Loved by over <strong>5,000 tea lovers</strong>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Rating value={4.9} precision={0.1} readOnly />
            <Typography sx={{ ml: 1, fontWeight: 600, color: '#4A3728' }}>
              4.9 / 5 (1,220 ratings)
            </Typography>
          </Box>
        </Box>

        {/* Footer Navigation */}
        <Box sx={{ 
          borderTop: '2px solid #F5A623',
          pt: 4,
          pb: 6,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap'
        }}>
          <Button
            onClick={() => navigate('/mission')}
            sx={{
              color: '#F5A623',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'rgba(245, 166, 35, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s'
            }}
          >
            📋 Mission & Objectives
          </Button>
          <Button
            onClick={() => navigate('/about')}
            sx={{
              color: '#F5A623',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'rgba(245, 166, 35, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s'
            }}
          >
            👥 About Us
          </Button>
          <Button
            onClick={() => navigate('/register')}
            sx={{
              color: '#F5A623',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'rgba(245, 166, 35, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s'
            }}
          >
            🚀 Get Started
          </Button>
        </Box>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', pb: 4 }}>
          <Typography variant="body2" sx={{ color: '#8B6F47' }}>
            © 2024 Tea Team Chat - Wollo University. Made with ☕ and ❤️
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
