import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  isGroupChat: {
    type: Boolean,
    default: false,
  },

  chatName: {
    type: String,
    trim: true,
    default: '', // optional for 1-to-1, used in groups
  },

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  ],

  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // applicable only if isGroupChat is true
  },

  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },

  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }

}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
