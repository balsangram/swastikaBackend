import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import {
  sendSpecialEventNotification,
  sendWorkReminder,
  sendDailyTimetableNotifications,
  sendNotificationToAll,
  sendLoginTimeNotification,
  sendCustomNotification
} from '../../controllers/notification/notification.controller.js';

const router = Router();


// Send special event notifications (e.g., birthday, anniversary)
router.post('/special-event', verifyJWT, sendSpecialEventNotification);

// Send work reminder after specific delay/time
router.post('/reminder', verifyJWT, sendWorkReminder);

// Send daily timetable notifications
router.post('/timetable', verifyJWT, sendDailyTimetableNotifications);

// Send notification to all users (can be admin-triggered or system-wide)
router.post('/broadcast', verifyJWT, sendNotificationToAll);

// Send login time notification (triggered on login)
router.post('/login', verifyJWT, sendLoginTimeNotification);

// Send any custom scheduled notification
router.post('/custom', verifyJWT, sendCustomNotification);

export default router;
