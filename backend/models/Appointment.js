/**
 * This file defines the Mongoose schema for the Appointment model.
 * It tracks patient appointments with doctors, storing date, time, status,
 * and optional payment details (like Razorpay payment ID).
 */
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor',
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true, // e.g. "10:00 AM"
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Pending', 'Confirmed', 'Checked-In', 'Completed', 'No-Show', 'Cancelled'],
        default: 'Scheduled',
    },
    reason: {
        type: String,
    },
    isWalkIn: {
        type: Boolean,
        default: false,
    },
    tokenNumber: {
        type: Number,
    },
    patientName: {
        type: String,
    },
    patientPhone: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    razorpayPaymentId: {
        type: String,
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
