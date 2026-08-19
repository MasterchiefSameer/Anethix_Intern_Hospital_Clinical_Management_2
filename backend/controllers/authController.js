/**
 * Authentication Controller.
 * Handles user registration, login, and logout.
 */
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user/set token & return user info
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (validUser && (await validUser.matchPassword(password))) {
            const token = generateToken(res, validUser._id);
            res.status(200).json({
                _id: validUser._id,
                name: validUser.name,
                email: validUser.email,
                role: validUser.role,
                phone: validUser.phone,
                gender: validUser.gender,
                dob: validUser.dob,
                bloodGroup: validUser.bloodGroup,
                address: validUser.address,
                city: validUser.city,
                state: validUser.state,
                pincode: validUser.pincode,
                languages: validUser.languages,
                emergencyContact: validUser.emergencyContact,
                createdAt: validUser.createdAt,
                token: token,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user (Patient by default)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, gender, dob } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            gender,
            dob,
        });

        if (user) {
            const token = generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                gender: user.gender,
                dob: user.dob,
                bloodGroup: user.bloodGroup,
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                languages: user.languages,
                emergencyContact: user.emergencyContact,
                createdAt: user.createdAt,
                token: token,
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
        expires: new Date(0),
    });
    res.status(200).json({ message: 'User logged out' });
};

export {
    loginUser,
    registerUser,
    logoutUser,
};
