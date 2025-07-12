import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['public', 'private', 'trash'],
    default: 'private',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
