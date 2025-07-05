import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import {
  displayFriends,
  followFriend,
  unfollowFriend,
  createGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  changeAdminToUser,
  createRoom,
  enterRoom,
  sendMessage,
  getMessages,
  globalChat
} from '../../controllers/chart/chart.controller.js';

const router = Router();

// Friends
router.get('/friends', verifyJWT, displayFriends);
router.post('/follow', verifyJWT, followFriend);
router.post('/unfollow', verifyJWT, unfollowFriend);

// Groups
router.post('/group/create', verifyJWT, createGroup);
router.delete('/group/delete', verifyJWT, deleteGroup);
router.post('/group/member/add', verifyJWT, addGroupMember);
router.post('/group/member/remove', verifyJWT, removeGroupMember);
router.post('/group/change-admin', verifyJWT, changeAdminToUser);

// Rooms
router.post('/room/create', verifyJWT, createRoom);
router.post('/room/enter', verifyJWT, enterRoom);

// Messages
router.post('/message/send', verifyJWT, sendMessage);
router.get('/message/list', verifyJWT, getMessages);

// Global Chat
router.get('/global', verifyJWT, globalChat);

export default router;
