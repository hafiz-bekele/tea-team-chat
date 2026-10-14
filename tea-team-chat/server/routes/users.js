const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get all users (for friends list)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search users
router.get('/search', protect, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('-password').limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { 
      username, 
      profilePicture, 
      status, 
      bio, 
      department, 
      faculty, 
      yearOfStudy, 
      campus, 
      socialLinks, 
      firstName, 
      lastName 
    } = req.body;
    
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (status) user.status = status;
    if (bio !== undefined) user.bio = bio;
    if (department) user.department = department;
    if (faculty) user.faculty = faculty;
    if (yearOfStudy) user.yearOfStudy = Number(yearOfStudy);
    if (campus) user.campus = campus;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks
      };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
});

// Discover students in the same department
router.get('/department/:deptName', protect, async (req, res) => {
  try {
    const { deptName } = req.params;
    const students = await User.find({
      _id: { $ne: req.user._id },
      department: { $regex: deptName, $options: 'i' }
    })
    .select('-password')
    .limit(30);

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error finding department peers', error: error.message });
  }
});

module.exports = router;
