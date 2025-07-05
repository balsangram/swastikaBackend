import { Router } from 'express';

import userAuthRouter from './allroutes/authRouter.router.js';
import chatRouter from './allroutes/chatRouter.router.js';
import notificationRouter from './allroutes/notificationRouter.router.js';
import timeTableRouter from './allroutes/timeTableRouter.router.js';
import todoRouter from './allroutes/todoRouter.router.js';

const router = Router();

// Route groups
router.use('/auth', userAuthRouter);
router.use('/chat', chatRouter);
router.use('/notification', notificationRouter);
router.use('/time-table', timeTableRouter);
router.use('/todo', todoRouter);

export default router;
