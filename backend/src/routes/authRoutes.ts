import { Router } from 'express';
import {
  forgotPassword,
  getMe,
  login,
  requireAuth,
  resetPassword,
  signup,
  updateSettings,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, getMe);
router.patch('/settings', requireAuth, updateSettings);

export default router;
