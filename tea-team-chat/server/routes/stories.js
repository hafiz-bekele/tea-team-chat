const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

// Get all active campus stories
router.get('/', protect, async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'username role department profilePicture isVerified')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving stories', error: error.message });
  }
});

// Create a new campus story
router.post('/', protect, async (req, res) => {
  try {
    const { content, previewTitle, bgGradient, mediaUrl } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Story content is required' });
    }

    const user = await User.findById(req.user._id);

    const story = new Story({
      author: user._id,
      authorName: user.username,
      role: user.role || 'student',
      content: content.trim(),
      previewTitle: previewTitle ? previewTitle.trim() : content.trim().slice(0, 30) + '...',
      bgGradient: bgGradient || 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      mediaUrl: mediaUrl || '',
      views: [user._id]
    });

    await story.save();

    const populatedStory = await Story.findById(story._id)
      .populate('author', 'username role department profilePicture isVerified');

    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error: error.message });
  }
});

// Reply to a story
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const reply = {
      user: req.user._id,
      username: req.user.username,
      text: text.trim(),
      createdAt: new Date()
    };

    story.replies.push(reply);
    await story.save();

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Error replying to story', error: error.message });
  }
});

// Mark story as viewed
router.post('/:id/view', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyViewed = story.views.some(v => v.toString() === userIdStr);

    if (!alreadyViewed) {
      story.views.push(req.user._id);
      await story.save();
    }

    res.json({ viewsCount: story.views.length });
  } catch (error) {
    res.status(500).json({ message: 'Error marking story view', error: error.message });
  }
});

module.exports = router;
