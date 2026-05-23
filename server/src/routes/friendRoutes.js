import express from 'express';
import {
  getFriends,
  getIncomingFriendRequests,
  respondToFriendRequest,
  searchUsers,
  sendFriendRequest
} from '../controllers/friendController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/search', searchUsers);
router.get('/requests', getIncomingFriendRequests);
router.get('/', getFriends);
router.post('/requests', sendFriendRequest);
router.patch('/requests/:requestId', respondToFriendRequest);

export default router;

