/**
 * Express routes for user authentication.
 * Maps /register, /login, /logout endpoints to authController.
 */
import express from 'express';
import {
    loginUser,
    registerUser,
    logoutUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
