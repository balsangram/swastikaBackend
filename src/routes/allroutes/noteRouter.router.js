import express from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  softDeleteNote,
} from '../../controllers/note/noteController.js';

const router = express.Router();

router.post('/create', createNote);          // Create Note
router.get('/', getAllNotes);                // Get All Notes
router.get('/:id', getNoteById);             // Get One Note
router.put('/update/:id', updateNote);       // Update Note
router.put('/delete/:id', softDeleteNote);   // Soft Delete (Trash)

export default router;
