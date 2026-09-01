/**
 * This file defines the Mongoose schema for the Doctor model.
 * It contains all fields related to a doctor's profile, including their specialty,
 * experience, fees, availability schedule, and a reference to their user account (if any).
 */
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    specialty: {
        type: String,
        required: true,
    },
    languages: {
        type: String,
        default: 'Hindi, English',
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        default: 'MBBS, MD',
    },
    experience: {
        type: Number, // in years
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    timeSlots: {
        type: String,
        default: '09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM',
    },
    about: {
        type: String,
    },
    availableDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    image: {
        type: String, // URL of the doctor's profile image
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
