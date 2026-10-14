const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');

// Get messages between two users
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId, deletedFor: { $ne: req.user._id } },
        { sender: req.params.userId, receiver: req.user._id, deletedFor: { $ne: req.user._id } }
      ],
      deletedForEveryone: false
    })
    .populate('sender', 'username profilePicture')
    .populate('receiver', 'username profilePicture')
    .populate('replyTo')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/', protect, async (req, res) => {
  try {
    const { receiver, content, messageType, group, replyTo, silent, attachments } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver || null,
      group: group || null,
      content,
      messageType: messageType || 'text',
      replyTo: replyTo || null,
      silent: silent || false,
      attachments: attachments || [],
      status: 'sent'
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .populate('replyTo');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark message as read
router.put('/:messageId/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.some(
      read => read.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({ user: req.user._id });
      message.status = 'read';
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add reaction to message
router.post('/:messageId/react', protect, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.findIndex(
      r => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingReaction !== -1) {
      // Remove reaction
      message.reactions.splice(existingReaction, 1);
    } else {
      // Add reaction
      message.reactions.push({
        user: req.user._id,
        emoji
      });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Edit message
router.put('/:messageId/edit', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    // Check if message is within edit time limit (48 hours)
    const hoursSinceCreation = (Date.now() - message.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation > 48) {
      return res.status(400).json({ message: 'Message edit time limit exceeded' });
    }

    message.originalContent = message.content;
    message.content = content;
    message.edited = true;
    message.editedAt = Date.now();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete message
router.delete('/:messageId', protect, async (req, res) => {
  try {
    const { deleteForEveryone } = req.body;
    const message = await Message.findById(req.params.messageId)
      .populate('sender', '_id')
      .populate('receiver', '_id');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (deleteForEveryone) {
      // Only sender can delete for everyone
      if (message.sender._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Check if within delete time limit (1 hour)
      const minutesSinceCreation = (Date.now() - message.createdAt) / (1000 * 60);
      if (minutesSinceCreation > 60) {
        return res.status(400).json({ message: 'Delete time limit exceeded' });
      }

      message.deletedForEveryone = true;
      message.content = 'This message was deleted';
    } else {
      // Delete for self
      if (!message.deletedFor.includes(req.user._id)) {
        message.deletedFor.push(req.user._id);
      }
    }

    await message.save();
    
    // Return the receiver ID so frontend can emit socket event
    res.json({ 
      message: 'Message deleted', 
      deletedForEveryone,
      receiverId: message.receiver?._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Pin message
router.put('/:messageId/pin', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.pinned = !message.pinned;
    message.pinnedAt = message.pinned ? Date.now() : null;
    message.pinnedBy = message.pinned ? req.user._id : null;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forward message
router.post('/:messageId/forward', protect, async (req, res) => {
  try {
    const { receiverIds } = req.body; // Array of user IDs
    const originalMessage = await Message.findById(req.params.messageId);

    if (!originalMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const forwardedMessages = [];

    for (const receiverId of receiverIds) {
      const forwardedMessage = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        content: originalMessage.content,
        messageType: originalMessage.messageType,
        attachments: originalMessage.attachments,
        forwarded: true,
        forwardedFrom: originalMessage.sender,
        status: 'sent'
      });

      forwardedMessages.push(forwardedMessage);
    }

    res.status(201).json(forwardedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search messages (simple query)
router.get('/search/:query', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ],
      content: { $regex: req.params.query, $options: 'i' },
      deletedForEveryone: false,
      deletedFor: { $ne: req.user._id }
    })
    .populate('sender', 'username profilePicture')
    .populate('receiver', 'username profilePicture')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Advanced message search with filtering (chatId, messageType, pagination)
router.get('/search/advanced/filter', protect, async (req, res) => {
  try {
    const { q, targetId, messageType, limit = 50, page = 1 } = req.query;
    
    const filter = {
      deletedForEveryone: false,
      deletedFor: { $ne: req.user._id }
    };

    if (q) {
      filter.content = { $regex: q.trim(), $options: 'i' };
    }

    if (messageType && messageType !== 'all') {
      filter.messageType = messageType;
    }

    if (targetId) {
      filter.$or = [
        { sender: req.user._id, receiver: targetId },
        { sender: targetId, receiver: req.user._id },
        { group: targetId }
      ];
    } else {
      filter.$or = [
        { sender: req.user._id },
        { receiver: req.user._id }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const totalCount = await Message.countDocuments(filter);
    const messages = await Message.find(filter)
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      total: totalCount,
      page: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / parseInt(limit, 10)),
      results: messages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error in advanced search', error: error.message });
  }
// Toggle pin/unpin on a message
router.put('/:messageId/pin', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.pinned = !message.pinned;
    if (message.pinned) {
      message.pinnedAt = new Date();
      message.pinnedBy = req.user._id;
    } else {
      message.pinnedAt = null;
      message.pinnedBy = null;
    }

    await message.save();
    const updated = await Message.findById(message._id)
      .populate('sender', 'username profilePicture')
      .populate('pinnedBy', 'username');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error while toggling pin', error: error.message });
  }
});

// Fetch all pinned messages in a conversation (1-on-1 or group)
router.get('/pinned/:targetId', protect, async (req, res) => {
  try {
    const { targetId } = req.params;
    const filter = {
      pinned: true,
      deletedForEveryone: false,
      deletedFor: { $ne: req.user._id },
      $or: [
        { sender: req.user._id, receiver: targetId },
        { sender: targetId, receiver: req.user._id },
        { group: targetId }
      ]
    };

    const pinnedMessages = await Message.find(filter)
      .populate('sender', 'username profilePicture')
      .populate('pinnedBy', 'username')
      .sort({ pinnedAt: -1 });

    res.json(pinnedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pinned messages', error: error.message });
  }
});

// Toggle star/bookmark on a message for current user
router.put('/:messageId/star', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const userIdStr = req.user._id.toString();
    const hasStarred = (message.starredBy || []).some(id => id.toString() === userIdStr);

    if (hasStarred) {
      message.starredBy = message.starredBy.filter(id => id.toString() !== userIdStr);
    } else {
      message.starredBy = message.starredBy || [];
      message.starredBy.push(req.user._id);
    }

    await message.save();
    res.json({
      messageId: message._id,
      isStarred: !hasStarred,
      starredCount: message.starredBy.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while toggling star', error: error.message });
  }
});

// Get all starred/bookmarked messages for current user
router.get('/starred/saved', protect, async (req, res) => {
  try {
    const starredMessages = await Message.find({
      starredBy: req.user._id,
      deletedForEveryone: false,
      deletedFor: { $ne: req.user._id }
    })
    .populate('sender', 'username profilePicture')
    .populate('receiver', 'username profilePicture')
    .populate('group', 'name')
    .sort({ createdAt: -1 });

    res.json(starredMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching starred messages', error: error.message });
  }
});

// Add or toggle emoji reaction on a message
router.put('/:messageId/reactions', protect, async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const userIdStr = req.user._id.toString();
    const existingIndex = (message.reactions || []).findIndex(
      r => r.user && r.user.toString() === userIdStr
    );

    if (existingIndex > -1) {
      if (message.reactions[existingIndex].emoji === emoji) {
        // Toggle off if same emoji clicked again
        message.reactions.splice(existingIndex, 1);
      } else {
        // Update to new emoji
        message.reactions[existingIndex].emoji = emoji;
        message.reactions[existingIndex].createdAt = new Date();
      }
    } else {
      // Add new reaction
      message.reactions = message.reactions || [];
      message.reactions.push({
        user: req.user._id,
        emoji,
        createdAt: new Date()
      });
    }

    await message.save();

    const updated = await Message.findById(message._id)
      .populate('sender', 'username profilePicture')
      .populate('reactions.user', 'username profilePicture');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating reaction', error: error.message });
  }
});

module.exports = router;
