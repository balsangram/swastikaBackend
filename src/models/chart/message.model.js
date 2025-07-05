import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Link to Chat (conversation/group)
    required: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  content: {
    type: String,
    default: '',
  },

  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file'],
    default: 'text',
  },

  mediaUrl: {
    type: String,
    default: '', // Set file URL if type is image, video, etc.
  },

  isReadBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
