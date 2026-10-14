const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true
  },
  phoneNumber: {
    type: String,
    sparse: true
  },
  firstName: String,
  lastName: String,
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  department: {
    type: String,
    default: 'General'
  },
  faculty: {
    type: String,
    default: 'Wollo University'
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 7,
    default: 1
  },
  campus: {
    type: String,
    default: 'Wollo University - Main Campus'
  },
  socialLinks: {
    github: { type: String, default: '' },
    telegram: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  profilePicture: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  customStatus: {
    text: String,
    emoji: String,
    expiresAt: Date
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Typing status
  typing: {
    chatId: String,
    isTyping: Boolean,
    lastTyped: Date
  },
  // Friends & Contacts
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Privacy Settings
  privacySettings: {
    lastSeen: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone'
    },
    profilePhoto: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone'
    },
    about: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone'
    },
    readReceipts: {
      type: Boolean,
      default: true
    }
  },
  // Notification Settings
  notificationSettings: {
    messageNotifications: {
      type: Boolean,
      default: true
    },
    groupNotifications: {
      type: Boolean,
      default: true
    },
    callNotifications: {
      type: Boolean,
      default: true
    },
    sound: {
      type: Boolean,
      default: true
    },
    vibration: {
      type: Boolean,
      default: true
    }
  },
  // Theme Settings
  themeSettings: {
    mode: {
      type: String,
      enum: ['light', 'dark', 'amoled', 'system'],
      default: 'light'
    },
    accentColor: {
      type: String,
      default: '#F5A623'
    },
    chatBackground: String,
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    }
  },
  // Chat Settings
  archivedChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  pinnedChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  mutedChats: [{
    chatId: mongoose.Schema.Types.ObjectId,
    mutedUntil: Date
  }]
}, {
  timestamps: true
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model('User', userSchema);
