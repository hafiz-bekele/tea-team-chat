import React from 'react';
import { 
  AccessTime as AccessTimeIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const MessageStatusIcon = ({ status }) => {
  const iconStyle = { fontSize: 14, ml: 0.5 };

  switch (status) {
    case 'sending':
      return <AccessTimeIcon sx={{ ...iconStyle, color: 'rgba(255,255,255,0.7)' }} />;
    case 'sent':
      return <DoneIcon sx={{ ...iconStyle, color: 'rgba(255,255,255,0.7)' }} />;
    case 'delivered':
      return <DoneAllIcon sx={{ ...iconStyle, color: 'rgba(255,255,255,0.7)' }} />;
    case 'read':
      return <DoneAllIcon sx={{ ...iconStyle, color: '#0088CC' }} />;
    case 'failed':
      return <ErrorIcon sx={{ ...iconStyle, color: '#E54646' }} />;
    default:
      return null;
  }
};

export default MessageStatusIcon;
