/**
 * Admin & Staff Management Controller.
 * Handles Super Admin analytics, staff creation (Doctors & Receptionists),
 * soft deactivation, and temporary password resets.
 */
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

// @desc    Get Overall Hospital Statistics (Financials & Queue)
// @route   GET /api/admin/stats
// @access  Private (Super Admin & Receptionist restricted)
export const getAdminStats = async (req, res, next) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'Patient' });
        const totalDoctors = await Doctor.countDocuments({ isActive: true });
        const totalReceptionists = await User.countDocuments({ role: 'Receptionist', isActive: true });
        const totalAppointments = await Appointment.countDocuments();
        const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
        const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

        // Calculate Revenue (Completed appointments * fees or payments)
        const appointmentsWithFees = await Appointment.find({
            status: { $in: ['Completed', 'Confirmed'] }
        }).populate('doctor', 'fees');

        const totalRevenue = appointmentsWithFees.reduce((acc, curr) => {
            const fee = curr.doctor?.fees || 500;
            return acc + fee;
        }, 0);

        res.status(200).json({
            totalPatients,
            totalDoctors,
            totalReceptionists,
            totalAppointments,
            completedAppointments,
            pendingAppointments,
            totalRevenue,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Hospital Staff (Doctors, Receptionists, Admins)
// @route   GET /api/admin/staff
// @access  Private/Super Admin
export const getStaffList = async (req, res, next) => {
    try {
        const staffUsers = await User.find({
            role: { $in: ['Super Admin', 'Doctor', 'Receptionist'] }
        }).select('-password').sort({ createdAt: -1 });

        // Merge with Doctor profile info if applicable
        const doctors = await Doctor.find({});
        const doctorMap = {};
        doctors.forEach((d) => {
            if (d.user) doctorMap[d.user.toString()] = d;
            if (d.email) doctorMap[d.email.toLowerCase()] = d;
        });

        const enrichedStaff = staffUsers.map((staff) => {
            const docObj = staff._doc;
            const linkedDoc = doctorMap[staff._id.toString()] || doctorMap[staff.email.toLowerCase()];
            return {
                ...docObj,
                doctorProfile: linkedDoc || null,
            };
        });

        res.status(200).json(enrichedStaff);
    } catch (error) {
        next(error);
    }
};

// @desc    Add New Staff Member (Doctor or Receptionist) with Temporary Password
// @route   POST /api/admin/staff
// @access  Private/Super Admin
export const createStaffMember = async (req, res, next) => {
    const {
        name,
        email,
        role,
        phone,
        gender,
        temporaryPassword = 'Welcome@123',
        specialty,
        experience,
        fees,
        about,
        availableDays,
        image
    } = req.body;

    try {
        // 1. Validation
        if (!name || !email || !role) {
            res.status(400);
            throw new Error('Please provide name, email, and staff role');
        }

        const validStaffRoles = ['Doctor', 'Receptionist', 'Super Admin'];
        if (!validStaffRoles.includes(role)) {
            res.status(400);
            throw new Error('Invalid staff role specified');
        }

        // 2. Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400);
            throw new Error(`A user with email ${email} already exists.`);
        }

        // 3. Create the User account with isFirstLogin: true
        const newStaffUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: temporaryPassword,
            role,
            phone: phone || '',
            gender: gender || 'Male',
            isFirstLogin: true, // Forces password change on first login
            isActive: true,
        });

        let createdDoctorProfile = null;

        // 4. If creating a Doctor, create and link Doctor document
        if (role === 'Doctor') {
            createdDoctorProfile = await Doctor.create({
                user: newStaffUser._id,
                name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
                email: email.toLowerCase(),
                phone: phone || '',
                specialty: specialty || 'General Medicine',
                experience: Number(experience) || 3,
                fees: Number(fees) || 500,
                about: about || 'Experienced healthcare specialist at MedTrust.',
                availableDays: availableDays && availableDays.length > 0 ? availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                image: image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
                isActive: true,
            });
        }

        const { password: pass, ...rest } = newStaffUser._doc;

        res.status(201).json({
            message: `Staff member (${role}) created successfully with temporary password.`,
            user: rest,
            temporaryPassword,
            doctorProfile: createdDoctorProfile,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Staff Member Details
// @route   PUT /api/admin/staff/:id
// @access  Private/Super Admin
export const updateStaffMember = async (req, res, next) => {
    try {
        const { name, email, phone, gender, role, specialty, experience, fees, about, availableDays, image } = req.body;

        const staffUser = await User.findById(req.params.id);
        if (!staffUser) {
            res.status(404);
            throw new Error('Staff user not found');
        }

        // Update User info
        staffUser.name = name || staffUser.name;
        staffUser.email = email ? email.toLowerCase() : staffUser.email;
        staffUser.phone = phone !== undefined ? phone : staffUser.phone;
        staffUser.gender = gender || staffUser.gender;
        if (role && ['Doctor', 'Receptionist', 'Super Admin'].includes(role)) {
            staffUser.role = role;
        }

        await staffUser.save();

        // If Doctor, update linked Doctor document
        if (staffUser.role === 'Doctor') {
            let docProfile = await Doctor.findOne({
                $or: [{ user: staffUser._id }, { email: staffUser.email }]
            });

            if (docProfile) {
                docProfile.name = name || docProfile.name;
                docProfile.specialty = specialty || docProfile.specialty;
                docProfile.experience = experience !== undefined ? Number(experience) : docProfile.experience;
                docProfile.fees = fees !== undefined ? Number(fees) : docProfile.fees;
                docProfile.about = about !== undefined ? about : docProfile.about;
                if (availableDays) docProfile.availableDays = availableDays;
                if (image) docProfile.image = image;
                await docProfile.save();
            }
        }

        const { password: pass, ...rest } = staffUser._doc;
        res.status(200).json({
            message: 'Staff member updated successfully',
            user: rest,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle Staff Active/Inactive Status (Soft Deletion)
// @route   PATCH /api/admin/staff/:id/toggle-status
// @access  Private/Super Admin
export const toggleStaffStatus = async (req, res, next) => {
    try {
        const staffUser = await User.findById(req.params.id);
        if (!staffUser) {
            res.status(404);
            throw new Error('Staff user not found');
        }

        // Toggle User active state
        staffUser.isActive = !staffUser.isActive;
        await staffUser.save();

        // If Doctor, also sync Doctor directory active state
        if (staffUser.role === 'Doctor') {
            await Doctor.updateMany(
                { $or: [{ user: staffUser._id }, { email: staffUser.email }] },
                { $set: { isActive: staffUser.isActive } }
            );
        }

        res.status(200).json({
            message: `Staff member has been ${staffUser.isActive ? 'activated' : 'deactivated'} successfully.`,
            isActive: staffUser.isActive,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Staff Password to Temporary Password
// @route   POST /api/admin/staff/:id/reset-password
// @access  Private/Super Admin
export const resetStaffPassword = async (req, res, next) => {
    const { temporaryPassword = 'Welcome@123' } = req.body;
    try {
        const staffUser = await User.findById(req.params.id);
        if (!staffUser) {
            res.status(404);
            throw new Error('Staff user not found');
        }

        // Set temporary password and force password change on next login
        staffUser.password = temporaryPassword;
        staffUser.isFirstLogin = true;
        await staffUser.save();

        res.status(200).json({
            message: `Password reset successfully. Temporary password is: ${temporaryPassword}. User will be forced to change it on their next login.`,
            temporaryPassword,
        });
    } catch (error) {
        next(error);
    }
};
