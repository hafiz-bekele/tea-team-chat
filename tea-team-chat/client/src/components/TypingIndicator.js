import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`;

const TypingIndicator = ({ username }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        background: 'rgba(245, 166, 35, 0.1)',
        borderRadius: 2,
        mb: 1
      }}
    >
      <Typography variant="body2" sx={{ color: '#F5A623', fontWeight: 500 }}>
        {username} is typing
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#F5A623',
              animation: `${bounce} 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;
