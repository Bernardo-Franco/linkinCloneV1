import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionRequests,
  getUserConnections,
  removeConnection,
  getConnectionStatus,
} from '../controllers/connection.controller.js';

router.post('/request/:userId', protectRoute, sendConnectionRequest);
router.put('/accept/:requestId', protectRoute, acceptConnectionRequest);
router.put('/reject/:requestId', protectRoute, rejectConnectionRequest);
// get all connection request for the current user
router.get('/requests', protectRoute, getConnectionRequests);
// gell connections for a user
router.get('/', protectRoute, getUserConnections);
router.delete('/:userId', protectRoute, removeConnection);
router.get('/status/:userId', protectRoute, getConnectionStatus);

export default router;
