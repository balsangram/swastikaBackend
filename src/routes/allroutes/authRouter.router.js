// routes/auth.router.js
import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  verifyCaptcha,
  logoutUser,
  deleteUser,
  updateUser,
  refreshToken
} from '../../controllers/auth.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', verifyJWT, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/captcha', verifyCaptcha);
router.post('/logout', verifyJWT, logoutUser);
router.post('/delete', verifyJWT, deleteUser);
router.patch('/update', verifyJWT, updateUser);
router.post('/refresh-token', refreshToken);

export default router;
