/**
 * This file defines the Express routes for user authentication.
 * It maps endpoints (like /login, /register, /profile) to their respective controller functions.
 */
import express from 'express';
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
