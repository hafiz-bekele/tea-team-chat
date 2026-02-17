const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload single file
router.post('/file', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileInfo = {
      url: fileUrl,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    };

    res.status(200).json(fileInfo);
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Upload multiple files
router.post('/files', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const filesInfo = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: req.user._id
    }));

    res.status(200).json(filesInfo);
  } catch (error) {
    res.status(500).json({ message: 'Files upload failed', error: error.message });
  }
});

// Upload voice message
router.post('/voice', protect, upload.single('voice'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No voice file uploaded' });
    }

    const voiceUrl = `/uploads/${req.file.filename}`;
    const voiceInfo = {
      url: voiceUrl,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      duration: req.body.duration || 0,
      uploadedBy: req.user._id
    };

    res.status(200).json(voiceInfo);
  } catch (error) {
    res.status(500).json({ message: 'Voice upload failed', error: error.message });
  }
});

// Delete file
router.delete('/file/:filename', protect, async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'File deletion failed', error: error.message });
  }
});

module.exports = router;
