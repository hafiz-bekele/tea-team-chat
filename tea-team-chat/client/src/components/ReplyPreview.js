import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ReplyPreview = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        background: 'rgba(245, 166, 35, 0.1)',
        borderLeft: '3px solid #F5A623',
        borderRadius: 1,
        mb: 1
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" sx={{ color: '#F5A623', fontWeight: 600 }}>
          Replying to {message.sender?.username || 'User'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6B4423',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {message.content}
        </Typography>
      </Box>
      <IconButton size="small" onClick={onClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ReplyPreview;
