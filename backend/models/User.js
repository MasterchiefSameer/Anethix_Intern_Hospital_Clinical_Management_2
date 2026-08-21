/**
 * This file defines the Mongoose schema for the User model.
 * It includes fields for user information, roles (Patient, Receptionist, Super Admin),
 * and methods for password hashing and matching using bcryptjs.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Patient', 'Receptionist', 'Doctor', 'Super Admin'],
        default: 'Patient'
    },
    isFirstLogin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        default: '',
    },
    pincode: {
        type: String,
        default: '',
    },
    languages: {
        type: String,
        default: 'Hindi, English',
    },
    emergencyContact: {
        type: String,
        default: '',
    },
    employeeId: {
        type: String,
        default: '',
    },
    deskNumber: {
        type: String,
        default: 'Front Desk #1',
    },
    shiftTimings: {
        type: String,
        default: 'Morning Shift (08:00 AM - 04:00 PM)',
    },
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
