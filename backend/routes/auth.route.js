import express from 'express';
const router = express.Router();
import {
  signup,
  login,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', protectRoute, getCurrentUser);

export default router;
