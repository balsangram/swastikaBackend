import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  time: {
    type: String, // You can also use Date if needed
    required: true,
  },
}, {
  timestamps: true // Adds createdAt & updatedAt
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
