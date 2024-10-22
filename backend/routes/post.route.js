import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  likePost,
  getMyPosts,
} from '../controllers/post.controller.js';

router.get('/', protectRoute, getFeedPosts);
router.get('/mine', protectRoute, getMyPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/:id', protectRoute, getPostById);
router.post('/:id/comment', protectRoute, createComment);
router.post('/:id/like', protectRoute, likePost);

export default router;
