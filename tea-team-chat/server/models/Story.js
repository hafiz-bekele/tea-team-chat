const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'ta'],
    default: 'student'
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  previewTitle: {
    type: String,
    maxlength: 100
  },
  bgGradient: {
    type: String,
    default: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)'
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  views: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

storySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Story', storySchema);
