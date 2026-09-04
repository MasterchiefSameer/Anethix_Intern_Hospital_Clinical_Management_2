/**
 * This file defines the Mongoose schema for the Message model.
 * It stores inquiries and feedback submitted through the frontend Contact Page.
 */
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    relatedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
