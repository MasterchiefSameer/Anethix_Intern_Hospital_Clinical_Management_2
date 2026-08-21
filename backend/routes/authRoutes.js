/**
 * Express routes for user and staff authentication.
 * Maps /register, /login, /staff/login, /first-login-password, /logout endpoints.
 */
import express from 'express';
import {
    loginUser,
    staffLogin,
    changeFirstLoginPassword,
    registerUser,
    logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Patient Authentication
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// router.post('/google', google);

// Staff Unified Authentication (Doctors, Receptionists, Super Admins)
router.post('/staff/login', staffLogin);
router.post('/first-login-password', protect, changeFirstLoginPassword);

export default router;
