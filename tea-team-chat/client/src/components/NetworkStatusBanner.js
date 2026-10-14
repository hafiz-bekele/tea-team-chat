import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

const NetworkStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 1.2,
        px: 2.5,
        py: 1,
        borderRadius: '50px',
        background: isOnline ? 'rgba(46, 125, 50, 0.92)' : 'rgba(211, 47, 47, 0.92)',
        color: 'white',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.3s ease',
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      {isOnline ? (
        <>
          <WifiIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
            Back Online • Messages Synced
          </Typography>
        </>
      ) : (
        <>
          <WifiOffIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
            No Internet Connection • Reconnecting...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default NetworkStatusBanner;
