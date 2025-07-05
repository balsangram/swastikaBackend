import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import {
  createOrUpdateActivity,
  recordActivityClick,
  getTodayTimetable,
  getUserActivityHistory
} from '../../controllers/timetable/timetable.controller.js';

const router = Router();

// Create or update a time table activity (like 'wake up', 'eat', etc.)
router.post('/create', verifyJWT, createOrUpdateActivity);

// Click an activity (saves time in DB)
router.post('/click', verifyJWT, recordActivityClick);

// Get today’s full timetable for the logged-in user
router.get('/today', verifyJWT, getTodayTimetable);

// Get all previous timetable activity logs for the user
router.get('/history', verifyJWT, getUserActivityHistory);

export default router;
