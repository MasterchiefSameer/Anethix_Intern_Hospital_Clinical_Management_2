/**
 * Authentication Controller.
 * Handles patient registration, standard login, staff-only unified login,
 * and first-login password changes.
 */
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Standard Login (Patients & General)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (validUser.isActive === false) {
            res.status(403);
            throw new Error('Your account has been deactivated. Please contact administration.');
        }

        if (await validUser.matchPassword(password)) {
            const token = generateToken(res, validUser._id);
            const { password: pass, ...rest } = validUser._doc;
            res.status(200).json({
                rest, token
            })
            // res.status(200).json({
            //     _id: validUser._id,
            //     name: validUser.name,
            //     email: validUser.email,
            //     role: validUser.role,
            //     phone: validUser.phone,
            //     gender: validUser.gender,
            //     dob: validUser.dob,
            //     bloodGroup: validUser.bloodGroup,
            //     address: validUser.address,
            //     city: validUser.city,
            //     state: validUser.state,
            //     pincode: validUser.pincode,
            //     languages: validUser.languages,
            //     emergencyContact: validUser.emergencyContact,
            //     createdAt: validUser.createdAt,
            //     token: token,
            // });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Staff-Only Unified Login (Super Admins, Receptionists, Doctors)
// @route   POST /api/auth/staff/login
// @access  Public (Restricted to Staff Roles)
const staffLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            res.status(401);
            throw new Error('Invalid staff credentials');
        }

        // 1. Role Verification: Patients cannot use staff portal
        const allowedStaffRoles = ['Super Admin', 'Receptionist', 'Doctor'];
        if (!allowedStaffRoles.includes(validUser.role)) {
            res.status(403);
            throw new Error('Access denied. Patient accounts cannot access the staff portal. Please use patient login.');
        }

        // 2. Account Status Check
        if (validUser.isActive === false) {
            res.status(403);
            throw new Error('Your staff account is currently inactive. Please contact the Super Admin.');
        }

        // 3. Password Verification
        if (await validUser.matchPassword(password)) {
            const token = generateToken(res, validUser._id);
            const { password: pass, ...rest } = validUser._doc;

            res.status(200).json({
                ...rest,
                token,
                mustChangePassword: Boolean(validUser.isFirstLogin),
            });
        } else {
            res.status(401);
            throw new Error('Invalid staff email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Change Password on First Login (Required for new Doctors & Receptionists)
// @route   POST /api/auth/first-login-password
// @access  Private (Staff only)
const changeFirstLoginPassword = async (req, res, next) => {
    const { newPassword } = req.body;
    try {
        if (!newPassword || newPassword.length < 6) {
            res.status(400);
            throw new Error('New password must be at least 6 characters long');
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Update password and clear first login flag
        user.password = newPassword;
        user.isFirstLogin = false;
        await user.save();

        const token = generateToken(res, user._id);
        const { password: pass, ...rest } = user._doc;

        res.status(200).json({
            message: 'Password updated successfully. You can now access your dashboard.',
            ...rest,
            token,
            isFirstLogin: false,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new Patient (Public registration is locked to Patients only)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, gender, dob } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists with this email');
        }

        // Strict security: Public registration is strictly forced to 'Patient' role
        const user = await User.create({
            name,
            email,
            password,
            phone,
            gender,
            dob,
            role: 'Patient',
            isFirstLogin: false,
            isActive: true,
        });

        if (user) {
            const token = generateToken(res, user._id);
            const { password: pass, ...rest } = user._doc;
            res.status(201).json({
                ...rest,
                token,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'User logged out successfully' });
};

const google = async (req, res, next) => {
    // const { name, email, photo } = req.body;
    const { name, email } = req.body;
    try {
        const user = await User.findOne({ email });
        //If the user exist in db
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            // Generate a random password since they logged in via Google
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

            // Generate a unique username by removing spaces, converting to lowercase and appending random chars
            const baseUsername = name.split(" ").join("").toLowerCase();
            const randomSuffix = Math.random().toString(36).slice(-4);
            const username = baseUsername + randomSuffix;

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                // avatar: photo,
                role: req.body.role || 'Tenant',  //
            });
            await newUser.save();
            //creating token for the new user
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export {
    loginUser,
    staffLogin,
    changeFirstLoginPassword,
    registerUser,
    logoutUser,
    google,
};



