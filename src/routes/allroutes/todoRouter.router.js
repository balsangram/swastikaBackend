import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { addTodo, deleteTodo, getAllTodoHistory, getYesterdayTodoHistory, markTodoCompleted, updateTodo } from './todo.controller.js';

const router = Router();

// Add a new todo
router.post('/add', verifyJWT, addTodo);

// Update existing todo
router.patch('/update/:id', verifyJWT, updateTodo);

// Mark todo as completed
router.patch('/complete/:id', verifyJWT, markTodoCompleted);

// Delete a todo
router.delete('/delete/:id', verifyJWT, deleteTodo);

// Get all todo history for user
router.get('/history', verifyJWT, getAllTodoHistory);

// Get only one-day-before (yesterday's) todo history
router.get('/history/yesterday', verifyJWT, getYesterdayTodoHistory);

export default router;
