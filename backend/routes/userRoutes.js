import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
} from '../controllers/UserController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Support both /api/user/profile and /api/user/profile/:id
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/profile/:id')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;