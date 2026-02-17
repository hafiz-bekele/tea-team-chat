import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { 
  Home as HomeIcon,
  Public as PublicIcon,
  Groups as GroupsIcon,
  EmojiObjects as LightbulbIcon,
  Handshake as HandshakeIcon,
  TrendingUp as GrowthIcon,
  School as UniversityIcon,
  Visibility as VisionIcon,
  MenuBook as BookIcon,
  Chat as ChatIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

const Mission = () => {
  const navigate = useNavigate();

  const objectives = [
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/681/681494.png', // Group/Team icon
      title: 'Encourage Student Interaction',
      description: 'Create an active platform where students can freely communicate and build connections.',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3079/3079652.png', // Lightbulb/Idea icon
      title: 'Develop Skills',
      description: 'Through conversations and teamwork, help students improve their communication, leadership, and problem-solving skills.',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3588/3588592.png', // Handshake icon
      title: 'Promote Peer Support',
      description: 'Encourage students to support each other academically and build positive friendships.',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png', // Growth chart icon
      title: 'Personal Growth',
      description: 'Help students grow both socially and personally.',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Plant/Growth icon
      title: 'Personal Growth',
      description: 'Help students grow both socially and personally.',
    },
    {
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3074/3074767.png', // University building icon
      title: 'Strengthen University',
      description: 'Build unity among students across all departments and years.',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
      py: 4
    }}>
      {/* Breadcrumb */}
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#6B4423' }}>
          <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography 
            variant="body2" 
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/')}
          >
            Home
          </Typography>
          <Typography variant="body2" sx={{ mx: 1 }}>›</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Our Mission & Objectives
          </Typography>
        </Box>

        {/* Header Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4,
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
            textAlign: 'center',
            border: '2px solid #F5A623'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              background: '#F5A623',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3976/3976625.png"
                alt="Graduation"
                style={{ width: '50px', height: '50px', filter: 'brightness(0) invert(1)' }}
              />
            </Box>
            <Box sx={{ 
              width: 120, 
              height: 80, 
              background: 'white',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2702/2702154.png"
                alt="Books"
                style={{ width: '50px', height: '50px' }}
              />
            </Box>
          </Box>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#4A3728', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Our Mission & Objectives
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#6B4423', 
              fontWeight: 400,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Building a stronger, smarter, and more connected student community at Wollo University.
          </Typography>
        </Paper>

        {/* Mission Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4, 
            background: '#FFFBF0',
            border: '1px solid #F5A623'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PublicIcon sx={{ fontSize: 50, color: '#F5A623', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#4A3728' }}>
              Our Mission
            </Typography>
          </Box>

          <Typography 
            sx={{ 
              color: '#4A3728', 
              fontSize: '1.1rem', 
              lineHeight: 1.8,
              mb: 2
            }}
          >
            Tea Team Chat exists <strong>to create a safe, interactive, and and supportive digital space</strong> where{' '}
            <strong>students</strong> of Wollo University can connect, collaborate, and <strong>grow together</strong>.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mt: 3,
            p: 2,
            background: '#FFF8E7',
            borderRadius: 2
          }}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
              alt="Chat"
              style={{ width: '50px', height: '50px' }}
            />
            <Box sx={{ 
              width: 50, 
              height: 50, 
              background: '#F5A623',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/924/924514.png"
                alt="Tea"
                style={{ width: '35px', height: '35px', filter: 'brightness(0) invert(1)' }}
              />
            </Box>
            <Box>
              <Typography sx={{ color: '#4A3728', fontSize: '1.1rem', fontWeight: 600 }}>
                We believe that communication builds confidence, teamwork develops leadership, and support creates success.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Core Objectives Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4, 
            background: '#FFFBF0',
            border: '1px solid #F5A623'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 50, 
              height: 50, 
              background: '#F5A623',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png"
                alt="Target"
                style={{ width: '30px', height: '30px', filter: 'brightness(0) invert(1)' }}
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#4A3728' }}>
              Our Core Objectives
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {objectives.map((obj, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'white',
                    height: '100%',
                    border: '2px solid #FFE4B5',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(245, 166, 35, 0.3)',
                      borderColor: '#F5A623'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 70, 
                    height: 70, 
                    background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    border: '2px solid #F5A623',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={obj.imageUrl} 
                      alt={obj.title}
                      style={{ 
                        width: '45px', 
                        height: '45px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#4A3728', 
                      mb: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    {obj.title}
                  </Typography>
                  <Typography sx={{ color: '#6B4423', lineHeight: 1.6 }}>
                    {obj.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Vision Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #F5A623 0%, #D4A574 100%)',
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <VisionIcon sx={{ fontSize: 50, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Our Vision
            </Typography>
          </Box>
          
          <Typography 
            sx={{ 
              fontSize: '1.2rem', 
              mb: 3,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8
            }}
          >
            To become the leading student communication platform at Wollo University — empowering students to collaborate, innovate, and succeed together.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              background: 'white',
              color: '#F5A623',
              px: 5,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: '50px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '&:hover': { 
                background: '#FFF8E7',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Join the Tea Team
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Mission;
