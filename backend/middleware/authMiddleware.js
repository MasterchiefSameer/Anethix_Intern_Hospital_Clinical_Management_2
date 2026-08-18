/**
 * This file contains middleware functions for authenticating users and enforcing Role-Based Access Control (RBAC).
 * `protect`: Ensures the user is logged in (valid JWT).
 * `authorizeRoles`: Ensures the logged-in user has one of the required roles (e.g., 'Super Admin', 'Receptionist').
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Grant access to specific roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`User role ${req.user ? req.user.role : ''} is not authorized to access this route`));
        }
        next();
    };
};

export { protect, authorizeRoles };
