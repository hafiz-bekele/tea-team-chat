import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCursor from '../components/CustomCursor';
import {
  Box,
  Container,
  Typography,
  Button,
  Rating,
  Avatar,
  AvatarGroup,
  Grid,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import SecurityIcon from '@mui/icons-material/Security';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GroupIcon from '@mui/icons-material/Group';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BoltIcon from '@mui/icons-material/Bolt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(false);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Enable custom scrollbar strictly while on the Landing page
    document.body.classList.add('landing-page-active');
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF5E4 40%, #FFE8C2 100%)',
      overflowX: 'hidden',
      color: '#4A3728'
    }}>
      {/* Custom pointer strictly scoped to Landing page */}
      <CustomCursor />
      {/* Ambient Floating Glowing Orbs (Translucent Lighting) */}
      <Box sx={{
        position: 'fixed',
        top: '-10%',
        right: '-5%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 166, 35, 0.28) 0%, rgba(255, 215, 0, 0.12) 50%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'floatSlow 14s ease-in-out infinite'
      }} />

      <Box sx={{
        position: 'fixed',
        bottom: '10%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 165, 116, 0.25) 0%, rgba(144, 198, 149, 0.15) 50%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'floatReverse 18s ease-in-out infinite'
      }} />

      <Box sx={{
        position: 'fixed',
        top: '40%',
        left: '45%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 166, 35, 0.15) 0%, rgba(255, 255, 255, 0) 65%)',
        filter: 'blur(55px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'pulseGlow 10s ease-in-out infinite'
      }} />

      {/* Floating Glassmorphic Sticky Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 16, 
        zIndex: 1000, 
        px: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 }
      }}>
        <Container maxWidth="lg" sx={{ px: '0 !important' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(20px) saturate(190%)',
            WebkitBackdropFilter: 'blur(20px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 8px 32px 0 rgba(139, 111, 71, 0.12)',
            transition: 'all 0.3s ease'
          }}>
            {/* Logo */}
            <Box 
              onClick={() => navigate('/')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <Box sx={{
                width: 44,
                height: 44,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)',
                color: 'white',
              }}>
                <LocalCafeIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 800, 
                  letterSpacing: '0.5px',
                  color: '#4A3728', 
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.1
                }}>
                  TEA TEAM CHAT
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#D87B00', 
                  fontWeight: 700, 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontSize: '0.65rem'
                }}>
                  Wollo University Hub
                </Typography>
              </Box>
            </Box>

            {/* Nav Links (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Button 
                onClick={() => scrollToSection('features')}
                sx={{ 
                  color: '#4A3728', 
                  fontWeight: 600, 
                  borderRadius: '12px',
                  px: 2,
                  '&:hover': { background: 'rgba(245, 166, 35, 0.12)', color: '#D87B00' }
                }}
              >
                Features
              </Button>
              <Button 
                onClick={() => scrollToSection('preview')}
                sx={{ 
                  color: '#4A3728', 
                  fontWeight: 600, 
                  borderRadius: '12px',
                  px: 2,
                  '&:hover': { background: 'rgba(245, 166, 35, 0.12)', color: '#D87B00' }
                }}
              >
                Live Preview
              </Button>
              <Button 
                onClick={() => navigate('/mission')}
                sx={{ 
                  color: '#4A3728', 
                  fontWeight: 600, 
                  borderRadius: '12px',
                  px: 2,
                  '&:hover': { background: 'rgba(245, 166, 35, 0.12)', color: '#D87B00' }
                }}
              >
                Mission
              </Button>
              <Button 
                onClick={() => navigate('/about')}
                sx={{ 
                  color: '#4A3728', 
                  fontWeight: 600, 
                  borderRadius: '12px',
                  px: 2,
                  '&:hover': { background: 'rgba(245, 166, 35, 0.12)', color: '#D87B00' }
                }}
              >
                About
              </Button>
              <Button 
                onClick={() => scrollToSection('faq')}
                sx={{ 
                  color: '#4A3728', 
                  fontWeight: 600, 
                  borderRadius: '12px',
                  px: 2,
                  '&:hover': { background: 'rgba(245, 166, 35, 0.12)', color: '#D87B00' }
                }}
              >
                FAQ
              </Button>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: '#4A3728', 
                  fontWeight: 700,
                  px: { xs: 1.5, md: 2.5 },
                  borderRadius: '14px',
                  '&:hover': { background: 'rgba(245, 166, 35, 0.12)' }
                }}
              >
                Log In
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ 
                  background: 'linear-gradient(135deg, #F5A623 0%, #E08A00 100%)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '14px',
                  px: { xs: 2, md: 3 },
                  py: 1,
                  boxShadow: '0 4px 18px rgba(245, 166, 35, 0.4)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #FFB74D 0%, #D87B00 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 22px rgba(245, 166, 35, 0.55)',
                  },
                  transition: 'all 0.25s ease'
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 8 }, pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={5} alignItems="center">
          {/* Left Hero Column */}
          <Grid item xs={12} md={7}>
            {/* Campus Tag Pill */}
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: '50px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(245, 166, 35, 0.4)',
              boxShadow: '0 4px 15px rgba(245, 166, 35, 0.15)',
              mb: 3
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                boxShadow: '0 0 10px #4CAF50'
              }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#D87B00', fontSize: '0.85rem' }}>
                ☕ Wollo University's Premier Social Hub
              </Typography>
            </Box>

            {/* Hero Main Heading */}
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900, 
                color: '#4A3728',
                fontSize: { xs: '2.5rem', sm: '3.4rem', md: '4rem' },
                lineHeight: 1.12,
                letterSpacing: '-1px',
                mb: 2.5
              }}
            >
              Where Campus Stories <br />
              <Box component="span" className="text-gradient-shimmer" sx={{ display: 'inline-block' }}>
                Spill The Real Tea ☕
              </Box>
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                color: '#6B4423', 
                mb: 4, 
                lineHeight: 1.65,
                fontWeight: 400,
                fontSize: { xs: '1.05rem', md: '1.25rem' },
                maxWidth: '600px'
              }}
            >
              Experience ultra-fast real-time messaging, WebRTC study lounges, high-fidelity voice notes, and campus circles — built with frosted-glass elegance and student privacy at its core.
            </Typography>

            {/* CTA Buttons Group */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
                  color: 'white',
                  px: 4.5,
                  py: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  boxShadow: '0 8px 28px rgba(245, 166, 35, 0.45)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFB74D 0%, #C96E00 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(245, 166, 35, 0.6)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Join The Chat Free
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => scrollToSection('preview')}
                startIcon={<PlayArrowIcon />}
                sx={{
                  borderColor: 'rgba(245, 166, 35, 0.6)',
                  color: '#4A3728',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  px: 3.5,
                  py: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  '&:hover': {
                    borderColor: '#F5A623',
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Explore Live Demo
              </Button>
            </Box>

            {/* Social Trust Metrics */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              width: 'fit-content'
            }}>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 38, height: 38, fontSize: '0.9rem', fontWeight: 700 } }}>
                <Avatar sx={{ bgcolor: '#F5A623' }}>ED</Avatar>
                <Avatar sx={{ bgcolor: '#D4A574' }}>HB</Avatar>
                <Avatar sx={{ bgcolor: '#90C695' }}>SM</Avatar>
                <Avatar sx={{ bgcolor: '#6B4423' }}>TK</Avatar>
              </AvatarGroup>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Rating value={4.9} precision={0.1} readOnly size="small" />
                  <Typography sx={{ fontWeight: 800, color: '#4A3728', fontSize: '0.95rem' }}>
                    4.9 / 5.0
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#8B6F47', fontWeight: 600 }}>
                  Rated by over <strong>5,000+ Wollo University students</strong>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Hero Column: 3D Translucent Chat Glass Mockup */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Outer decorative glow ring */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '105%',
                height: '105%',
                borderRadius: '44px',
                background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.4) 0%, rgba(255, 215, 0, 0.2) 100%)',
                filter: 'blur(25px)',
                zIndex: 0
              }} />

              {/* Translucent Phone/App Frame */}
              <Box
                className="glass-panel"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  maxWidth: 380,
                  borderRadius: '36px',
                  p: 2.5,
                  background: 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(25px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(25px) saturate(200%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 25px 60px rgba(139, 111, 71, 0.2)',
                  overflow: 'hidden'
                }}
              >
                {/* Chat Mockup Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  pb: 2, 
                  borderBottom: '1px solid rgba(139, 111, 71, 0.12)',
                  mb: 2.5
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar sx={{ bgcolor: '#F5A623', width: 44, height: 44 }}>☕</Avatar>
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        bgcolor: '#4CAF50',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4A3728' }}>
                        Wollo CS Study Pod 🌿
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                        ● 48 students active
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label="LIVE" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(76, 175, 80, 0.15)', 
                      color: '#2E7D32', 
                      fontWeight: 800, 
                      fontSize: '0.7rem' 
                    }} 
                  />
                </Box>

                {/* Mockup Chat Stream */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                  {/* Message 1 */}
                  <Box sx={{
                    maxWidth: '85%',
                    p: 1.8,
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)'
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#D87B00', display: 'block', mb: 0.3 }}>
                      Eden (Software Eng.)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A3728', fontWeight: 500 }}>
                      Hey team! Did the lab assignments for Advanced DB get posted on Tea Team? 🫖
                    </Typography>
                  </Box>

                  {/* Message 2 (You) */}
                  <Box sx={{
                    alignSelf: 'flex-end',
                    maxWidth: '85%',
                    p: 1.8,
                    borderRadius: '18px 18px 4px 18px',
                    background: 'linear-gradient(135deg, #F5A623 0%, #E08A00 100%)',
                    color: 'white',
                    boxShadow: '0 6px 18px rgba(245, 166, 35, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Yes! Just uploaded the full PDF in the channel. Check files! 🚀
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.85 }}>10:42 AM</Typography>
                      <DoneAllIcon sx={{ fontSize: 14, opacity: 0.9 }} />
                    </Box>
                  </Box>

                  {/* Message 3 - Voice Note Preview */}
                  <Box sx={{
                    maxWidth: '90%',
                    p: 1.8,
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)'
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#8B6F47', display: 'block', mb: 0.8 }}>
                      Dawit (Medicine) • Voice Note
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <IconButton size="small" sx={{ bgcolor: '#F5A623', color: 'white', '&:hover': { bgcolor: '#D87B00' } }}>
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {[8, 16, 24, 12, 28, 18, 14, 26, 30, 20, 10, 22, 16, 8].map((h, i) => (
                          <Box key={i} sx={{
                            width: 3,
                            height: h,
                            borderRadius: '2px',
                            bgcolor: i < 7 ? '#F5A623' : 'rgba(139, 111, 71, 0.25)'
                          }} />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#8B6F47' }}>
                        0:24
                      </Typography>
                    </Box>
                  </Box>

                  {/* Typing Indicator */}
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.8,
                    py: 1,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    width: 'fit-content'
                  }}>
                    <Typography variant="caption" sx={{ color: '#8B6F47', fontStyle: 'italic', fontWeight: 600 }}>
                      Selamawit is typing
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '4px' }}>
                      <Box sx={{ width: 5, height: 5, bgcolor: '#F5A623', borderRadius: '50%' }} />
                      <Box sx={{ width: 5, height: 5, bgcolor: '#F5A623', borderRadius: '50%', opacity: 0.6 }} />
                      <Box sx={{ width: 5, height: 5, bgcolor: '#F5A623', borderRadius: '50%', opacity: 0.3 }} />
                    </Box>
                  </Box>
                </Box>

                {/* Mockup Quick Input */}
                <Box sx={{
                  mt: 3,
                  p: 1.2,
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(245, 166, 35, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <EmojiEmotionsIcon sx={{ color: '#F5A623', fontSize: 22 }} />
                  <Typography variant="body2" sx={{ color: '#A0826D', flex: 1, fontSize: '0.85rem' }}>
                    Spill the tea here...
                  </Typography>
                  <IconButton size="small" sx={{ bgcolor: '#F5A623', color: 'white' }}>
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Campus Impact Metrics Strip (Translucent Glass Bar) */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Container maxWidth="lg" sx={{ px: '0 !important' }}>
          <Box sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 10px 35px rgba(139, 111, 71, 0.08)'
          }}>
            <Grid container spacing={3} alignItems="center">
              {[
                { number: '50,000+', label: 'Messages Sent Daily', icon: <ChatIcon sx={{ color: '#F5A623' }} /> },
                { number: '8,500+', label: 'Active Wollo Students', icon: <SchoolIcon sx={{ color: '#F5A623' }} /> },
                { number: '< 40ms', label: 'Real-Time Latency', icon: <BoltIcon sx={{ color: '#F5A623' }} /> },
                { number: '100%', label: 'Encrypted & Private', icon: <SecurityIcon sx={{ color: '#F5A623' }} /> },
              ].map((stat, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    px: 1,
                    borderRight: { xs: idx % 2 === 0 ? '1px solid rgba(139, 111, 71, 0.12)' : 'none', md: idx < 3 ? '1px solid rgba(139, 111, 71, 0.12)' : 'none' }
                  }}>
                    <Box sx={{ display: 'inline-flex', p: 1, borderRadius: '12px', background: 'rgba(245, 166, 35, 0.12)', mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#4A3728', fontSize: { xs: '1.6rem', md: '2.1rem' } }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8B6F47', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Suite Section */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip 
            label="POWERFUL CAMPUS TOOLS" 
            sx={{ 
              bgcolor: 'rgba(245, 166, 35, 0.15)', 
              color: '#D87B00', 
              fontWeight: 800, 
              mb: 2,
              letterSpacing: '0.8px'
            }} 
          />
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#4A3728', fontSize: { xs: '2.2rem', md: '3.2rem' }, mb: 2 }}>
            Everything You Need For Campus Life
          </Typography>
          <Typography variant="h6" sx={{ color: '#8B6F47', maxWidth: 650, mx: 'auto', fontWeight: 400 }}>
            Designed specifically for student workflows: lightning-fast messaging, group study rooms, and secure community channels.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {[
            {
              icon: <ChatIcon sx={{ fontSize: 32, color: 'white' }} />,
              title: 'Real-Time Instant Chat',
              description: 'Powered by Socket.io for millisecond message dispatch. Enjoy read receipts, live typing indicators, and emoji reactions.',
              tag: 'Socket.io v4'
            },
            {
              icon: <VideocamIcon sx={{ fontSize: 32, color: 'white' }} />,
              title: 'HD Video & Audio Lounges',
              description: 'Host collaborative study pods with peer-to-peer WebRTC technology. Zero time limits, high clarity, and screen sharing support.',
              tag: 'WebRTC P2P'
            },
            {
              icon: <MicIcon sx={{ fontSize: 32, color: 'white' }} />,
              title: 'Voice Notes & Audio Waveforms',
              description: 'Record quick voice notes on the fly with native audio visualization. Perfect for explaining complex lecture concepts.',
              tag: 'Studio Audio'
            },
            {
              icon: <AttachFileIcon sx={{ fontSize: 32, color: 'white' }} />,
              title: 'Cloud Document & Media Hub',
              description: 'Exchange study guides, slides, images, and audio files up to 50MB. Inline file viewer and instant download links.',
              tag: '50MB Limit'
            },
            {
              icon: <GroupIcon sx={{ fontSize: 32, color: 'white' }} />,
              title: 'Department & Dorm Circles',
              description: 'Create customized channels for your batch, department, study club, or dormitory. Control member permissions easily.',
              tag: 'Multi-Channel'
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 32, color: 'white' }} />,
              title: 'Enterprise-Grade Security',
              description: 'Protected with JSON Web Tokens (JWT), Google OAuth 2.0 single sign-on, and secure cookie sessions.',
              tag: 'Google OAuth & JWT'
            },
          ].map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card className="glass-card" sx={{
                height: '100%',
                borderRadius: '26px',
                p: 2,
                cursor: 'pointer'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <Box sx={{
                      width: 58,
                      height: 58,
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(245, 166, 35, 0.35)'
                    }}>
                      {feature.icon}
                    </Box>
                    <Chip 
                      label={feature.tag} 
                      size="small" 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.7)',
                        color: '#D87B00',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: '1px solid rgba(245, 166, 35, 0.25)'
                      }} 
                    />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#4A3728', mb: 1.5, fontSize: '1.3rem' }}>
                    {feature.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#6B4423', lineHeight: 1.65, fontSize: '0.95rem' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Interactive Live Playground / Tabs Showcase */}
      <Box id="preview" sx={{ py: { xs: 8, md: 10 }, background: 'rgba(255, 255, 255, 0.35)', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#4A3728', fontSize: { xs: '2rem', md: '2.8rem' }, mb: 1.5 }}>
              Experience The Interface
            </Typography>
            <Typography variant="body1" sx={{ color: '#8B6F47', maxWidth: 600, mx: 'auto' }}>
              Switch between tabs to preview how Tea Team Chat elevates student collaboration.
            </Typography>

            {/* Translucent Tab Switcher */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3.5 }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, val) => setActiveTab(val)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '50px',
                  p: 0.6,
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 4px 20px rgba(139, 111, 71, 0.08)',
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
                    height: '100%',
                    borderRadius: '50px',
                    zIndex: 0
                  }
                }}
              >
                <Tab 
                  label="Direct & Group Messaging" 
                  sx={{ 
                    zIndex: 1, 
                    fontWeight: 700, 
                    color: activeTab === 0 ? 'white !important' : '#4A3728',
                    px: 3,
                    borderRadius: '50px',
                    transition: 'all 0.3s'
                  }} 
                />
                <Tab 
                  label="HD Video Study Rooms" 
                  sx={{ 
                    zIndex: 1, 
                    fontWeight: 700, 
                    color: activeTab === 1 ? 'white !important' : '#4A3728',
                    px: 3,
                    borderRadius: '50px',
                    transition: 'all 0.3s'
                  }} 
                />
                <Tab 
                  label="Campus Communities" 
                  sx={{ 
                    zIndex: 1, 
                    fontWeight: 700, 
                    color: activeTab === 2 ? 'white !important' : '#4A3728',
                    px: 3,
                    borderRadius: '50px',
                    transition: 'all 0.3s'
                  }} 
                />
              </Tabs>
            </Box>
          </Box>

          {/* Tab 1 Content: Direct Chat */}
          {activeTab === 0 && (
            <Box className="glass-panel" sx={{
              borderRadius: '32px',
              p: { xs: 3, md: 5 },
              maxWidth: 900,
              mx: 'auto'
            }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="SOCKET.IO REALTIME" size="small" sx={{ bgcolor: 'rgba(245, 166, 35, 0.2)', color: '#D87B00', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#4A3728' }}>
                    Lightning Fast & Zero Delay
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B4423', lineHeight: 1.7, mb: 3 }}>
                    Every keystroke, reaction, and read notification syncs across your devices without lag. Chat privately with classmates or create group threads for coursework.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['Read receipts (sent, delivered, read)', 'Interactive emoji reactions picker', 'Instant voice memos with visual scrubbers'].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A3728' }}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 8px 30px rgba(139, 111, 71, 0.1)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Avatar sx={{ bgcolor: '#90C695' }}>SM</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Selamawit (Accounting)</Typography>
                        <Typography variant="caption" sx={{ color: '#4CAF50' }}>Active now</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(245, 166, 35, 0.12)', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#D87B00' }}>📚 Midterm Prep Session</Typography>
                      <Typography variant="caption" sx={{ color: '#6B4423' }}>Meeting in Main Campus Library at 3 PM!</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(76, 175, 80, 0.12)' }}>
                      <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600 }}>👍 12 students confirmed attendance</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 2 Content: Video Calls */}
          {activeTab === 1 && (
            <Box className="glass-panel" sx={{
              borderRadius: '32px',
              p: { xs: 3, md: 5 },
              maxWidth: 900,
              mx: 'auto'
            }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="WEBRTC VIDEO ROOMS" size="small" sx={{ bgcolor: 'rgba(245, 166, 35, 0.2)', color: '#D87B00', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#4A3728' }}>
                    Crystal Clear Study Lounges
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B4423', lineHeight: 1.7, mb: 3 }}>
                    Hop into low-latency video and audio calls with fellow students right from the chat box. No external Zoom links or third-party apps required.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['Zero software downloads required', 'Screen sharing for presentations & slides', 'Encrypted peer-to-peer audio/video connection'].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A3728' }}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    height: 240,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: 'white',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.25)'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label="Study Lounge #4" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} />
                      <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 700 }}>● HD 1080p</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: '#F5A623', width: 56, height: 56, mx: 'auto', mb: 1 }}>🎓</Avatar>
                      <Typography variant="subtitle2">Computer Architecture Lab Call</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>4 participants connected</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MicIcon fontSize="small" />
                      </Box>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <VideocamIcon fontSize="small" />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 3 Content: Communities */}
          {activeTab === 2 && (
            <Box className="glass-panel" sx={{
              borderRadius: '32px',
              p: { xs: 3, md: 5 },
              maxWidth: 900,
              mx: 'auto'
            }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="CAMPUS NETWORKING" size="small" sx={{ bgcolor: 'rgba(245, 166, 35, 0.2)', color: '#D87B00', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#4A3728' }}>
                    Connect Across Campus
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B4423', lineHeight: 1.7, mb: 3 }}>
                    Find peers from other departments, join dorm circles, or create private interest clubs. The digital heartbeat of Wollo University.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['Public community bulletin channels', 'Department-specific announcements', 'Member search & custom profile avatars'].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A3728' }}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { name: '🌱 Wollo Green Campus Initiative', members: '430 members', icon: '🌿' },
                      { name: '💻 Competitive Programming Club', members: '280 members', icon: '⚡' },
                      { name: '🩺 Med School Study Cohort 2026', members: '195 members', icon: '🩺' }
                    ].map((group, i) => (
                      <Box key={i} sx={{
                        p: 2,
                        borderRadius: '18px',
                        background: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="h6">{group.icon}</Typography>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4A3728' }}>{group.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#8B6F47' }}>{group.members}</Typography>
                          </Box>
                        </Box>
                        <Chip label="Joined" size="small" sx={{ bgcolor: 'rgba(245, 166, 35, 0.15)', color: '#D87B00', fontWeight: 700 }} />
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* Student Testimonials (Frosted Glass Cards) */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip label="WHAT STUDENTS SAY" sx={{ bgcolor: 'rgba(245, 166, 35, 0.15)', color: '#D87B00', fontWeight: 800, mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#4A3728', fontSize: { xs: '2.2rem', md: '3rem' } }}>
            Loved Across Every Department
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {[
            {
              quote: "Tea Team Chat transformed how our final year project group works. Sharing lecture files and jumping into video study calls without lag is a game changer!",
              name: "Eden Tesfaye",
              role: "4th Year Software Engineering",
              avatar: "ET",
              rating: 5
            },
            {
              quote: "The voice notes feature and the clean warm aesthetic make everyday campus conversations feel personal. Plus, logging in with Google takes literally one click.",
              name: "Dawit Kebede",
              role: "Medicine & Health Sciences",
              avatar: "DK",
              rating: 5
            },
            {
              quote: "Unlike generic chat apps, Tea Team is built around Wollo University. Department channels make it effortless to stay on top of midterm schedules and announcements.",
              name: "Selamawit Mengistu",
              role: "Economics & Management",
              avatar: "SM",
              rating: 5
            }
          ].map((t, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Box className="glass-card" sx={{
                p: 3.5,
                borderRadius: '26px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#F5A623', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ color: '#4A3728', fontStyle: 'italic', mb: 3, lineHeight: 1.7 }}>
                    "{t.quote}"
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 2, borderTop: '1px solid rgba(139, 111, 71, 0.12)' }}>
                  <Avatar sx={{ bgcolor: '#F5A623', fontWeight: 800 }}>{t.avatar}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4A3728' }}>{t.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#8B6F47', fontWeight: 600 }}>{t.role}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section (Accordion) */}
      <Container id="faq" maxWidth="md" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="FREQUENTLY ASKED QUESTIONS" sx={{ bgcolor: 'rgba(245, 166, 35, 0.15)', color: '#D87B00', fontWeight: 800, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#4A3728', fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Got Questions? We've Got Tea.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            {
              id: 'panel1',
              q: 'Is Tea Team Chat completely free for Wollo University students?',
              a: 'Yes, 100% free! All core features including unlimited real-time chat, HD video lounges, voice notes, and file sharing are freely accessible to students and faculty.'
            },
            {
              id: 'panel2',
              q: 'Can I log in using my Google account?',
              a: 'Yes! Tea Team Chat features one-click Google OAuth single sign-on as well as standard email/password authentication.'
            },
            {
              id: 'panel3',
              q: 'How does WebRTC video calling work in study rooms?',
              a: 'Our video lounges use peer-to-peer WebRTC technology, ensuring high resolution and low latency directly between users without routing audio/video through third-party servers.'
            },
            {
              id: 'panel4',
              q: 'What is the file upload limit for lecture slides and documents?',
              a: 'You can upload documents, lecture presentations, PDFs, voice recordings, and photos up to 50MB per file.'
            },
            {
              id: 'panel5',
              q: 'Is my data and communication private?',
              a: 'Absolutely. We enforce strict JWT session verification, database access controls on MongoDB Atlas, and never share or sell student data.'
            }
          ].map((faq) => (
            <Accordion 
              key={faq.id}
              expanded={expandedFaq === faq.id}
              onChange={handleFaqChange(faq.id)}
              className="glass-card"
              sx={{
                borderRadius: '20px !important',
                background: 'rgba(255, 255, 255, 0.65)',
                '&:before': { display: 'none' },
                boxShadow: '0 4px 18px rgba(139, 111, 71, 0.08)'
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: '#F5A623' }} />}
                sx={{ px: 3, py: 1 }}
              >
                <Typography sx={{ fontWeight: 800, color: '#4A3728', fontSize: '1.05rem' }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Typography sx={{ color: '#6B4423', lineHeight: 1.7 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* High-Impact Bottom Call to Action Banner */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{
          position: 'relative',
          borderRadius: '36px',
          p: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.95) 0%, rgba(216, 123, 0, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 20px 60px rgba(245, 166, 35, 0.4)',
          color: 'white',
          overflow: 'hidden'
        }}>
          {/* Decorative Background Elements */}
          <Box sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)'
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)'
          }} />

          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' }, color: 'white' }}>
            Ready to Sip the Latest Campus Buzz? ☕
          </Typography>

          <Typography variant="h6" sx={{ maxWidth: 680, mx: 'auto', mb: 4, fontWeight: 400, opacity: 0.95, lineHeight: 1.6 }}>
            Join thousands of Wollo University students already connecting, studying, and laughing together on Tea Team Chat.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'white',
              color: '#D87B00',
              fontWeight: 800,
              fontSize: '1.15rem',
              px: 5,
              py: 2,
              borderRadius: '50px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: '#FFF8E7',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Create Your Free Account
          </Button>

          <Typography variant="body2" sx={{ mt: 2.5, opacity: 0.85, fontWeight: 600 }}>
            Instant setup • No credit card required • Verified Wollo student community
          </Typography>
        </Box>
      </Container>

      {/* Modern Translucent Footer */}
      <Box sx={{ 
        borderTop: '1px solid rgba(139, 111, 71, 0.15)',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(16px)',
        py: 6,
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F5A623 0%, #D87B00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <LocalCafeIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#4A3728' }}>
                  TEA TEAM CHAT
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8B6F47', lineHeight: 1.7, maxWidth: 300 }}>
                The official student communication platform for Wollo University. Bringing students closer through safe, instantaneous digital connection.
              </Typography>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4A3728', mb: 2 }}>
                Navigation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => scrollToSection('features')}>
                  Features & Tools
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => scrollToSection('preview')}>
                  Interactive Preview
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => navigate('/mission')}>
                  Mission & Objectives
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => navigate('/about')}>
                  About Us
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4A3728', mb: 2 }}>
                Account & Security
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => navigate('/login')}>
                  Student Login
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => navigate('/register')}>
                  Create Account
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B4423', cursor: 'pointer', '&:hover': { color: '#D87B00' } }} onClick={() => scrollToSection('faq')}>
                  FAQ & Support
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4A3728', mb: 2 }}>
                University Hub
              </Typography>
              <Chip label="Dessie, Ethiopia" size="small" sx={{ bgcolor: 'rgba(245, 166, 35, 0.15)', color: '#D87B00', fontWeight: 700, mb: 1 }} />
              <Typography variant="caption" sx={{ display: 'block', color: '#8B6F47' }}>
                Wollo University Campus Network
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ 
            pt: 4, 
            borderTop: '1px solid rgba(139, 111, 71, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body2" sx={{ color: '#8B6F47' }}>
              © {new Date().getFullYear()} Tea Team Chat - Wollo University. Crafted with ☕ & ❤️
            </Typography>
            <Typography variant="caption" sx={{ color: '#A0826D' }}>
              Socket.io • WebRTC • MongoDB Atlas Cloud
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
