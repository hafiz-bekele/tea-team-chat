const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Pod = require('../models/Pod');
const User = require('../models/User');

// Get all study pods
router.get('/', protect, async (req, res) => {
  try {
    const pods = await Pod.find()
      .populate('host', 'username role department profilePicture isVerified')
      .sort({ status: 1, createdAt: -1 })
      .limit(30);

    res.json(pods);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving study pods', error: error.message });
  }
});

// Create a new study pod
router.post('/', protect, async (req, res) => {
  try {
    const { name, topic, type } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Pod name is required' });
    }

    const user = await User.findById(req.user._id);

    const pod = new Pod({
      name: name.trim(),
      topic: topic ? topic.trim() : 'General Collaborative Study Session',
      host: user._id,
      hostName: user.username,
      hostRole: user.role || 'student',
      membersCount: 1,
      status: 'live',
      type: type === 'audio' ? 'audio' : 'video'
    });

    await pod.save();

    const populatedPod = await Pod.findById(pod._id)
      .populate('host', 'username role department profilePicture isVerified');

    res.status(201).json(populatedPod);
  } catch (error) {
    res.status(500).json({ message: 'Error creating study pod', error: error.message });
  }
});

// Join study pod (increment count)
router.put('/:id/join', protect, async (req, res) => {
  try {
    const pod = await Pod.findByIdAndUpdate(
      req.params.id,
      { $inc: { membersCount: 1 } },
      { new: true }
    ).populate('host', 'username role department profilePicture');

    if (!pod) {
      return res.status(404).json({ message: 'Study pod not found' });
    }

    res.json(pod);
  } catch (error) {
    res.status(500).json({ message: 'Error joining study pod', error: error.message });
  }
});

module.exports = router;
