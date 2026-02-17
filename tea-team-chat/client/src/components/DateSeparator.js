import React from 'react';
import { Box, Typography } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';

const DateSeparator = ({ date }) => {
  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    
    if (isToday(messageDate)) return 'Today';
    if (isYesterday(messageDate)) return 'Yesterday';
    
    return format(messageDate, 'MMMM d, yyyy');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        my: 2
      }}
    >
      <Typography
        sx={{
          background: 'rgba(0, 0, 0, 0.05)',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontSize: '0.75rem',
          color: '#6B4423',
          fontWeight: 500
        }}
      >
        {formatDate(date)}
      </Typography>
    </Box>
  );
};

export default DateSeparator;
