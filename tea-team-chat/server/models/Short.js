const mongoose = require('mongoose');

const shortSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: ''
  },
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
  department: {
    type: String,
    default: 'Computer Science'
  },
  videoCodeSnippet: {
    type: String,
    default: ''
  },
  soundTrack: {
    type: String,
    default: 'Original Campus Audio'
  },
  bgGradient: {
    type: String,
    default: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 1
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
  }]
}, {
  timestamps: true
});

shortSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Short', shortSchema);
