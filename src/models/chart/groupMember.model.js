import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // only for group chats (isGroupChat: true)
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member',
  },

  isMuted: {
    type: Boolean,
    default: false,
  },

  isBanned: {
    type: Boolean,
    default: false,
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  },

  lastActiveAt: {
    type: Date,
    default: null,
  }

}, {
  timestamps: true, // includes createdAt and updatedAt
});

// Compound index to ensure a user joins a group only once
groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

const GroupMember = mongoose.model('GroupMember', groupMemberSchema);
export default GroupMember;
