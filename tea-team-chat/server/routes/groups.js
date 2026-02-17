const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Group = require('../models/Group');
const Message = require('../models/Message');

// Get all groups for user
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id
    })
    .populate('createdBy', 'username profilePicture')
    .populate('members.user', 'username profilePicture');

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create group
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, picture, members } = req.body;

    const group = await Group.create({
      name,
      description,
      picture,
      createdBy: req.user._id,
      members: [
        { user: req.user._id, role: 'admin' },
        ...members.map(userId => ({ user: userId, role: 'member' }))
      ]
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('createdBy', 'username profilePicture')
      .populate('members.user', 'username profilePicture');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get group messages
router.get('/:groupId/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
