import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js';
const router = express.Router();

router.get('/', protectRoute, getUserNotifications);

router.put('/:id/read', protectRoute, markNotificationAsRead);
router.delete('/:id', protectRoute, deleteNotification);

export default router;
