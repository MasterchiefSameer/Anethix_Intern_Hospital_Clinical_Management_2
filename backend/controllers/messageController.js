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
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            res.status(400);
            throw new Error('Please fill all fields');
        }

        const newMessage = await Message.create({
            firstName,
            lastName,
            email,
            phone,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin/Receptionist
const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({});
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

export { createMessage, getMessages };
