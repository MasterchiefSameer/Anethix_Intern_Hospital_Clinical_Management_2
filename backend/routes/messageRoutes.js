/**
 * This file defines the routes for contact form messages.
 */
import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(createMessage)
    .get(protect, authorizeRoles('Super Admin', 'Receptionist'), getMessages);

export default router;
