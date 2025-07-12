import Note from "../../models/note/note.model.js";

// Create Note
export const createNote = async (req, res) => {
  try {
    const { headline, content, status } = req.body;
    const note = new Note({ headline, content, status });
    await note.save();
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Notes (excluding trash)
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: { $ne: 'trash' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: notes.length, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Note
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const { headline, content, status } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { headline, content, status },
      { new: true }
    );
    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Note (mark as trash)
export const softDeleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { status: 'trash' },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Note moved to trash', note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
