const mongoose = require('mongoose');

const podSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  topic: {
    type: String,
    required: true,
    maxlength: 300
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostName: {
    type: String,
    required: true
  },
  hostRole: {
    type: String,
    enum: ['student', 'teacher', 'ta'],
    default: 'student'
  },
  membersCount: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['live', 'scheduled', 'ended'],
    default: 'live'
  },
  type: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pod', podSchema);
