import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/user/profile/:id (or /api/user/profile)
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const targetId =
            req.params.id && req.params.id !== 'undefined' && req.params.id !== 'null'
                ? req.params.id
                : req.user._id;

        // Security check: User can only view their own profile unless Super Admin
        if (
            req.params.id &&
            req.params.id !== 'undefined' &&
            req.params.id !== 'null' &&
            req.user._id.toString() !== req.params.id &&
            req.user.role !== 'Super Admin'
        ) {
            res.status(401);
            throw new Error('You can only access your own profile');
        }

        const user = await User.findById(targetId).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        let responseData = { ...user._doc };

        // If user is a Doctor, enrich with doctor collection profile
        if (user.role === 'Doctor') {
            const docProfile = await Doctor.findOne({
                $or: [{ user: user._id }, { email: user.email.toLowerCase() }],
            });
            if (docProfile) {
                responseData.doctorProfile = docProfile;
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile/:id (or /api/user/profile)
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    try {
        const targetId =
            req.params.id && req.params.id !== 'undefined' && req.params.id !== 'null'
                ? req.params.id
                : req.user._id;

        // Security check: User can only update their own profile unless Super Admin
        if (
            req.params.id &&
            req.params.id !== 'undefined' &&
            req.params.id !== 'null' &&
            req.user._id.toString() !== req.params.id &&
            req.user.role !== 'Super Admin'
        ) {
            res.status(401);
            throw new Error('You can only update your own profile');
        }

        const updateData = {};

        // Base allowed editable fields for regular users (Patients, Receptionists, Doctors)
        const regularAllowedFields = [
            'name',
            'phone',
            'gender',
            'dob',
            'bloodGroup',
            'address',
            'city',
            'state',
            'pincode',
            'languages',
            'emergencyContact',
            'personalEmail',
        ];

        // Super Admin exclusive administrative fields
        const adminOnlyFields = [
            'email',
            'hospitalEmail',
            'employeeId',
            'deskNumber',
            'shiftTimings',
            'dateOfJoining',
            'role',
            'isActive',
        ];

        // Determine permitted fields based on requester role
        const allowedFields = req.user.role === 'Super Admin'
            ? [...regularAllowedFields, ...adminOnlyFields]
            : regularAllowedFields;

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Hash password if user is changing their password
        if (req.body.password) {
            updateData.password = bcrypt.hashSync(req.body.password, 10);
            updateData.isFirstLogin = false;
        }

        const updatedUser = await User.findByIdAndUpdate(
            targetId,
            {
                $set: updateData,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }

        // If Doctor, update linked Doctor collection document
        let docProfile = null;
        if (updatedUser.role === 'Doctor') {
            docProfile = await Doctor.findOne({
                $or: [{ user: updatedUser._id }, { email: updatedUser.email.toLowerCase() }],
            });

            if (docProfile) {
                if (req.body.name) docProfile.name = req.body.name.startsWith('Dr.') ? req.body.name : `Dr. ${req.body.name}`;
                if (req.body.phone) docProfile.phone = req.body.phone;
                if (req.body.specialty) docProfile.specialty = req.body.specialty;
                if (req.body.licenseNumber !== undefined) docProfile.licenseNumber = req.body.licenseNumber;
                if (req.body.qualifications !== undefined) docProfile.qualifications = req.body.qualifications;
                if (req.body.experience !== undefined) docProfile.experience = Number(req.body.experience);
                if (req.body.fees !== undefined) docProfile.fees = Number(req.body.fees);
                if (req.body.timeSlots !== undefined) docProfile.timeSlots = req.body.timeSlots;
                if (req.body.about !== undefined) docProfile.about = req.body.about;
                if (req.body.availableDays) docProfile.availableDays = req.body.availableDays;
                if (req.body.image) docProfile.image = req.body.image;
                await docProfile.save();
            }
        }

        // Destructure to omit password from response
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            ...rest,
            doctorProfile: docProfile || undefined,
        });
    } catch (error) {
        next(error);
    }
};