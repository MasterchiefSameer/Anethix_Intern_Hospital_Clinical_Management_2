import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/user/profile/:id (or /api/user/profile)
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const targetId = req.params.id || req.user._id;

        const user = await User.findById(targetId).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile/:id (or /api/user/profile)
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    console.log(req.params.id);
    console.log(req.user._id);
    try {
        const targetId = req.params.id || req.user._id;

        // Security check: User can only update their own profile unless Super Admin
        if (req.params.id && req.user._id.toString() !== req.params.id && req.user.role !== 'Super Admin') {
            res.status(401);
            throw new Error('You can only update your own profile');
        }

        const updateData = {};

        // Only update fields that were provided in request body
        const allowedFields = [
            'name',
            'email',
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
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Hash password if user is changing their password
        if (req.body.password) {
            updateData.password = bcrypt.hashSync(req.body.password, 10);
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

        // Destructure to omit password from response
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};