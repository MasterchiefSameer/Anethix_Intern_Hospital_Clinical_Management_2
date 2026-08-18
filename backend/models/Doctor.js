/**
 * This file defines the Mongoose schema for the Doctor model.
 * It contains all fields related to a doctor's profile, including their specialty,
 * experience, fees, availability schedule, and a reference to their user account (if any).
 */
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
    experience: {
        type: Number, // in years
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    about: {
        type: String,
    },
    availableDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
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
