import React, { useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import MessageStatusIcon from './MessageStatusIcon';
import { 
  Reply as ReplyIcon,
  PushPin as PinIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  onContextMenu,
  onReactionClick,
  onReplyClick
}) => {
  const [showActions, setShowActions] = useState(false);

  const bubbleStyles = {
    sent: {
      background: 'linear-gradient(135deg, #90C695 0%, #7FB685 100%)',
      color: 'white',
      borderRadius: '12px 12px 2px 12px',
      marginLeft: 'auto',
      maxWidth: '65%',
      minWidth: '80px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
    },
    received: {
      background: 'white',
      color: '#2C2C2C',
      borderRadius: '12px 12px 12px 2px',
      marginRight: 'auto',
      maxWidth: '65%',
      minWidth: '80px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }
  };

  const style = isOwnMessage ? bubbleStyles.sent : bubbleStyles.received;

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { emoji: reaction.emoji, users: [], count: 0 };
    }
    acc[reaction.emoji].users.push(reaction.user);
    acc[reaction.emoji].count++;
    return acc;
  }, {});

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 0.5,
        px: 1,
        position: 'relative'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, message);
      }}
    >
      <Box sx={{ position: 'relative', maxWidth: '65%' }}>
        {/* Forwarded label */}
        {message.forwarded && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: isOwnMessage ? 'rgba(255,255,255,0.7)' : '#8B6F47',
              fontStyle: 'italic',
              fontSize: '0.7rem',
              ml: 2
            }}
          >
            Forwarded
          </Typography>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <Box
            sx={{
              background: isOwnMessage ? 'rgba(0,0,0,0.15)' : 'rgba(245,166,35,0.12)',
              borderLeft: `2.5px solid ${isOwnMessage ? 'rgba(255,255,255,0.6)' : '#F5A623'}`,
              p: 0.8,
              px: 1,
              mb: 0.8,
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onClick={() => onReplyClick && onReplyClick(message.replyTo)}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.75rem',
                color: isOwnMessage ? 'rgba(255,255,255,0.95)' : '#F5A623'
              }}
            >
              {message.replyTo.sender?.username}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                fontSize: '0.8rem',
                color: isOwnMessage ? 'rgba(255,255,255,0.8)' : '#5A5A5A',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mt: 0.2
              }}
            >
              {message.replyTo.content}
            </Typography>
          </Box>
        )}

        {/* Main message bubble */}
        <Box
          sx={{
            ...style,
            p: 1.2,
            px: 1.5,
            position: 'relative',
            display: 'inline-block'
          }}
        >
          {/* Pinned indicator */}
          {message.pinned && (
            <PinIcon 
              sx={{ 
                fontSize: 14, 
                position: 'absolute',
                top: 4,
                right: 4,
                color: isOwnMessage ? 'rgba(255,255,255,0.7)' : '#F5A623'
              }} 
            />
          )}

          {/* Image display */}
          {message.messageType === 'image' && message.attachments?.[0] && (
            <Box
              component="img"
              src={`http://localhost:5000${message.attachments[0].url}`}
              alt="Shared image"
              sx={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                display: 'block'
              }}
              onClick={() => window.open(`http://localhost:5000${message.attachments[0].url}`, '_blank')}
            />
          )}

          {/* File display */}
          {message.messageType === 'file' && message.attachments?.[0] && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                background: isOwnMessage ? 'rgba(0,0,0,0.1)' : 'rgba(245,166,35,0.1)',
                borderRadius: 2,
                mb: 1
              }}
            >
              <InsertDriveFileIcon />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {message.attachments[0].filename}
                </Typography>
                <Typography variant="caption">
                  {(message.attachments[0].fileSize / 1024).toFixed(2)} KB
                </Typography>
              </Box>
              <IconButton
                size="small"
                component="a"
                href={`http://localhost:5000${message.attachments[0].url}`}
                download
                sx={{ color: isOwnMessage ? 'white' : '#F5A623' }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          )}

          {/* Voice message display */}
          {message.messageType === 'voice' && message.attachments?.[0] && (
            <Box sx={{ mb: 1 }}>
              <audio 
                controls 
                src={`http://localhost:5000${message.attachments[0].url}`}
                style={{ 
                  width: '100%', 
                  maxWidth: 300,
                  height: 40
                }}
              />
            </Box>
          )}

          {/* Message content */}
          {message.messageType === 'text' && (
            <Typography 
              variant="body2" 
              sx={{ 
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                pr: message.pinned ? 3 : 0,
                fontSize: '0.95rem',
                lineHeight: 1.4,
                mb: 0.3
              }}
            >
              {message.deletedForEveryone ? (
                <em style={{ opacity: 0.7, fontSize: '0.9rem' }}>This message was deleted</em>
              ) : (
                message.content
              )}
            </Typography>
          )}

          {/* Timestamp and status */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
              mt: 0.3
            }}
          >
            {message.edited && (
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.65rem',
                  opacity: 0.6,
                  fontStyle: 'italic'
                }}
              >
                edited
              </Typography>
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.7rem',
                opacity: 0.7,
                fontWeight: 500
              }}
            >
              {format(new Date(message.createdAt), 'HH:mm')}
            </Typography>
            {isOwnMessage && <MessageStatusIcon status={message.status} />}
          </Box>
        </Box>

        {/* Reactions */}
        {groupedReactions && Object.keys(groupedReactions).length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 0.4, 
              mt: 0.4,
              flexWrap: 'wrap'
            }}
          >
            {Object.values(groupedReactions).map((reaction, index) => (
              <Tooltip 
                key={index}
                title={`${reaction.users.length} reaction${reaction.users.length > 1 ? 's' : ''}`}
              >
                <Chip
                  label={`${reaction.emoji} ${reaction.count}`}
                  size="small"
                  onClick={() => onReactionClick && onReactionClick(message._id, reaction.emoji)}
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    background: isOwnMessage ? 'rgba(255,255,255,0.25)' : 'rgba(245,166,35,0.15)',
                    border: `1px solid ${isOwnMessage ? 'rgba(255,255,255,0.3)' : 'rgba(245,166,35,0.3)'}`,
                    '&:hover': {
                      background: isOwnMessage ? 'rgba(255,255,255,0.35)' : 'rgba(245,166,35,0.25)',
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        )}

        {/* Quick actions (show on hover) */}
        {showActions && !message.deletedForEveryone && (
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              [isOwnMessage ? 'left' : 'right']: -10,
              background: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              gap: 0.5,
              p: 0.5
            }}
          >
            <IconButton 
              size="small" 
              onClick={() => onReactionClick && onReactionClick(message._id, '❤️')}
              sx={{ width: 28, height: 28 }}
            >
              ❤️
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => onReplyClick && onReplyClick(message)}
              sx={{ width: 28, height: 28 }}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;
