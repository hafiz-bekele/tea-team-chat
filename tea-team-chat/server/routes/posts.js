const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts with optional filtering
router.get('/', protect, async (req, res) => {
  try {
    const { category, role, search, mediaType } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (mediaType) {
      filter.mediaType = mediaType;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'username role department profilePicture isVerified officeHours')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
});

// Create a new campus post or poll or short
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, poll, mediaType, mediaUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const user = await User.findById(req.user._id);

    const postData = {
      title,
      content,
      category: category || 'general',
      author: user._id,
      authorName: user.username,
      role: user.role || 'student',
      department: user.department || 'Computer Science',
      mediaType: mediaType || 'none',
      mediaUrl: mediaUrl || ''
    };

    if (poll && poll.question && Array.isArray(poll.options)) {
      postData.poll = {
        question: poll.question,
        options: poll.options.map(opt => ({
          text: typeof opt === 'string' ? opt : opt.text,
          votes: []
        }))
      };
    }

    const post = new Post(postData);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username role department profilePicture isVerified officeHours');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Like / unlike post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes, liked: index === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like', error: error.message });
  }
});

// Add comment to post
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);

    const comment = {
      user: user._id,
      username: user.username,
      role: user.role || 'student',
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Vote in poll
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || !post.poll || !post.poll.options) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const userId = req.user._id.toString();

    // Check if user already voted in this poll
    let userVoted = false;
    post.poll.options.forEach(opt => {
      const idx = opt.votes.findIndex(v => v.toString() === userId);
      if (idx !== -1) {
        opt.votes.splice(idx, 1); // Remove previous vote
        userVoted = true;
      }
    });

    // Add new vote if valid index
    if (optionIndex >= 0 && optionIndex < post.poll.options.length) {
      post.poll.options[optionIndex].votes.push(req.user._id);
    }

    await post.save();
    res.json(post.poll);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting vote', error: error.message });
  }
});

// Delete post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

module.exports = router;
