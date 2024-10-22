import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from '../controllers/user.controller.js';

router.get('/suggestions', protectRoute, getSuggestedConnections);
router.get('/:username', protectRoute, getPublicProfile);

router.put('/profile', protectRoute, updateProfile);

export default router;
