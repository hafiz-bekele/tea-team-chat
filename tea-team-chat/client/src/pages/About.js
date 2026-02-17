import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  Avatar,
  Grid,
} from '@mui/material';
import { ArrowBack, LocalCafe, GitHub, LinkedIn } from '@mui/icons-material';

const About = () => {
  const navigate = useNavigate();

  const developers = [
    {
      name: 'Hafiz Bekele',
      role: 'Frontend Developer',
      description: 'Responsible for designing and developing the user interface of the website, ensuring a smooth and responsive user experience.',
      image: '/images/hafiz.jpg', // You can replace with actual image path
    },
    {
      name: 'Ashenafi',
      role: 'Backend Developer',
      description: 'Built the server-side functionality and managed the system logic and data processing.',
      image: '/images/ashenafi.jpg', // You can replace with actual image path
    },
    {
      name: 'Mekdelawit (Butu)',
      role: 'UI/UX Designer',
      description: 'Designed the layout, color scheme, and overall user experience of the platform.',
      image: '/images/mekdelawit.jpg', // You can replace with actual image path
    },
    {
      name: 'Binyam (Balemual)',
      role: 'Database Manager',
      description: 'Structured and managed the database to ensure secure and efficient data handling.',
      image: '/images/binyam.jpg', // You can replace with actual image path
    },
    {
      name: 'Kalkidan',
      role: 'Project Coordinator',
      description: 'Managed team collaboration, planning, and ensured the project goals were achieved on time.',
      image: '/images/kalkidan.jpg', // You can replace with actual image path
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)' }}>
      <AppBar position="static" sx={{ background: '#F5A623' }}>
        <Toolbar>
          <Button startIcon={<ArrowBack />} color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>
          <LocalCafe sx={{ ml: 2, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            About Tea Team Chat
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 4, background: '#FFFBF0' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#4A3728', mb: 2 }}>
            About Tea Team Chat
          </Typography>
          <Typography variant="h6" sx={{ color: '#6B4423', mb: 3 }}>
            Meet the passionate students behind this platform.
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#4A3728', mb: 2 }}>
              💡 Why We Built This Platform
            </Typography>
            <Typography sx={{ color: '#6B4423', lineHeight: 1.8 }}>
              We created Tea Team Chat to help students connect, collaborate, and grow together.
              Our goal was to design a simple, engaging, and safe communication space specifically for
              Wollo University students.
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#4A3728', mb: 3 }}>
            🚀 Meet the Developers
          </Typography>

          <Grid container spacing={3}>
            {developers.map((dev, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'white',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #F5A623',
                        mb: 2,
                        background: '#FFF8E7'
                      }}
                    >
                      <img
                        src={dev.image}
                        alt={dev.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div style="
                              width: 100%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: #F5A623;
                              color: white;
                              font-size: 2.5rem;
                              font-weight: bold;
                            ">
                              ${dev.name.charAt(0)}
                            </div>
                          `;
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4A3728', textAlign: 'center' }}>
                      {dev.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F5A623', fontWeight: 600 }}>
                      {dev.role}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#6B4423', textAlign: 'center', mb: 2 }}>
                    {dev.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button size="small" startIcon={<GitHub />} sx={{ color: '#8B6F47' }}>
                      GitHub
                    </Button>
                    <Button size="small" startIcon={<LinkedIn />} sx={{ color: '#8B6F47' }}>
                      LinkedIn
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, p: 3, background: '#FFF8E7', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4A3728', mb: 2 }}>
              🎯 Our Commitment
            </Typography>
            <Typography sx={{ color: '#6B4423', mb: 2 }}>
              We are committed to continuously improving Tea Team Chat to better serve the students of
              Wollo University.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: '#F5A623',
                '&:hover': { background: '#D4A574' }
              }}
              onClick={() => navigate('/register')}
            >
              Join Our Community
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
