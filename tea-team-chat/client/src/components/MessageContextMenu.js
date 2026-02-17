import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Forward as ForwardIcon,
  PushPin as PinIcon,
  ContentCopy as CopyIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';

const MessageContextMenu = ({ 
  anchorEl, 
  open, 
  onClose, 
  message, 
  isOwnMessage,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onPin,
  onCopy,
  onReact
}) => {
  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 200
        }
      }}
    >
      <MenuItem onClick={() => handleAction(onReply)}>
        <ListItemIcon>
          <ReplyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Reply</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onReact)}>
        <ListItemIcon>
          <EmojiIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>React</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onForward)}>
        <ListItemIcon>
          <ForwardIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Forward</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onCopy)}>
        <ListItemIcon>
          <CopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleAction(onPin)}>
        <ListItemIcon>
          <PinIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{message?.pinned ? 'Unpin' : 'Pin'}</ListItemText>
      </MenuItem>

      {isOwnMessage && (
        <>
          <Divider />
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        </>
      )}

      <Divider />
      <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MessageContextMenu;
