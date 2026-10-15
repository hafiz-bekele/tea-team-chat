const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Short = require('../models/Short');
const User = require('../models/User');

// Get all campus shorts
router.get('/', protect, async (req, res) => {
  try {
    const shorts = await Short.find()
      .populate('author', 'username role department profilePicture isVerified')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(shorts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving shorts', error: error.message });
  }
});

// Create a new campus short
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, videoCodeSnippet, soundTrack, bgGradient, mediaUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Short title is required' });
    }

    const user = await User.findById(req.user._id);

    const short = new Short({
      title: title.trim(),
      description: (description || '').trim(),
      author: user._id,
      authorName: user.username,
      role: user.role || 'student',
      department: user.department || 'Computer Science',
      videoCodeSnippet: videoCodeSnippet || '',
      soundTrack: soundTrack || 'Campus Educational Audio',
      bgGradient: bgGradient || 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
      mediaUrl: mediaUrl || '',
      views: 1,
      likes: [],
      comments: []
    });

    await short.save();

    const populatedShort = await Short.findById(short._id)
      .populate('author', 'username role department profilePicture isVerified');

    res.status(201).json(populatedShort);
  } catch (error) {
    res.status(500).json({ message: 'Error creating short', error: error.message });
  }
});

// Toggle like on a short
router.post('/:id/like', protect, async (req, res) => {
  try {
    const short = await Short.findById(req.params.id);
    if (!short) {
      return res.status(404).json({ message: 'Short not found' });
    }

    const userIdStr = req.user._id.toString();
    const index = short.likes.findIndex(id => id.toString() === userIdStr);

    if (index === -1) {
      short.likes.push(req.user._id);
    } else {
      short.likes.splice(index, 1);
    }

    await short.save();
    res.json({ likesCount: short.likes.length, isLiked: index === -1, likes: short.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like', error: error.message });
  }
});

// Add comment to a short
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const short = await Short.findById(req.params.id);
    if (!short) {
      return res.status(404).json({ message: 'Short not found' });
    }

    const comment = {
      user: req.user._id,
      username: req.user.username,
      role: req.user.role || 'student',
      text: text.trim(),
      createdAt: new Date()
    };

    short.comments.push(comment);
    await short.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment to short', error: error.message });
  }
});

// Increment view count
router.post('/:id/view', protect, async (req, res) => {
  try {
    const short = await Short.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!short) {
      return res.status(404).json({ message: 'Short not found' });
    }
    res.json({ views: short.views });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing views', error: error.message });
  }
});

module.exports = router;
