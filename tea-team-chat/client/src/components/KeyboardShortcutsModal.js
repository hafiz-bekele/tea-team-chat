import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

const shortcuts = [
  { keys: ['Enter'], desc: 'Send typed message' },
  { keys: ['Shift', 'Enter'], desc: 'Add new line in text input' },
  { keys: ['Ctrl', 'K'], desc: 'Focus user / channel search' },
  { keys: ['Esc'], desc: 'Close dialogs & context menus' },
  { keys: ['?'], desc: 'Open keyboard shortcuts guide' },
  { keys: ['Alt', 'V'], desc: 'Start or toggle video study room' }
];

const KeyboardShortcutsModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user is actively typing in an input
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable;

      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 60px rgba(139, 111, 71, 0.2)',
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1,
        color: '#4A3728',
        fontWeight: 800,
        fontSize: '1.15rem'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <KeyboardIcon sx={{ color: '#F5A623' }} />
          <span>Keyboard Shortcuts</span>
        </Box>
        <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#8B6F47' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Grid container spacing={1.5}>
          {shortcuts.map((sc, i) => (
            <Grid item xs={12} key={i}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.2,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(139, 111, 71, 0.1)'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A3728', fontSize: '0.85rem' }}>
                  {sc.desc}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {sc.keys.map((k, kIdx) => (
                    <Box
                      component="span"
                      key={kIdx}
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: '6px',
                        background: '#FFF8E7',
                        border: '1px solid rgba(245, 166, 35, 0.4)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#D87B00',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      {k}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#8B6F47' }}>
          Tip: Press <strong>?</strong> anywhere outside text fields to toggle this guide.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
