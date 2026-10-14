const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000
  },
  category: {
    type: String,
    enum: ['announcement', 'studyQuestion', 'courseMaterial', 'general'],
    default: 'general'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'ta'],
    default: 'student'
  },
  department: {
    type: String,
    default: 'Computer Science'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    role: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  poll: {
    question: String,
    options: [{
      text: String,
      votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    }]
  },
  mediaType: {
    type: String,
    enum: ['none', 'image', 'video', 'short'],
    default: 'none'
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ role: 1 });

module.exports = mongoose.model('Post', postSchema);
