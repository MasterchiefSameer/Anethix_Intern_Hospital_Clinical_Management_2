/**
 * This file handles logic for contact form messages (enquiries).
 * Includes creating a new message (Public) and fetching all messages (Admin).
 */
import Message from '../models/Message.js';

// @desc    Create a new message (Contact Form)
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, message, relatedDoctor } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            res.status(400);
            throw new Error('Please fill all fields');
        }

        const newMessage = await Message.create({
            firstName,
            lastName,
            email,
            phone,
            message,
            relatedDoctor: relatedDoctor || null
        });

        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages based on role (RBAC)
// @route   GET /api/messages
// @access  Private/Admin/Receptionist/Doctor
const getMessages = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user && req.user.role === 'Doctor') {
            filter = { relatedDoctor: req.user._id };
        }
        const messages = await Message.find(filter)
            .populate('relatedDoctor', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

export { createMessage, getMessages };
