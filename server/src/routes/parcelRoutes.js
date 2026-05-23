import express from 'express';
import {
  createParcelActivity,
  getActiveParcelHelpers
} from '../controllers/parcelController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/helpers', getActiveParcelHelpers);
router.post('/helpers', authMiddleware, createParcelActivity);

export default router;

