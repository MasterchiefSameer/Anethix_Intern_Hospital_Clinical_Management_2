/**
 * Middleware functions for authenticating users and enforcing Role-Based Access Control (RBAC).
 * Supports both HTTP-only Cookies (req.cookies.jwt) and Bearer Token Headers (req.headers.authorization).
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes, how req.user is born:
const protect = async (req, res, next) => {
    let token;

    // 1. (if cookies exist) -> Check HTTP-only cookie first or use token from Authorization Header
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // 2. (case of no cookies exist) -> Fallback to Authorization He`ader (Bearer token)
    // NOT retrieve cookies!, Instead, they retrieve the token from an alternative location: the HTTP Request Header (specifically the Authorization header).
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // A. Decode & Verify
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // B. Fetch user & ATTACH TO `req.user`! or  ATTACH THE USER TO THE `req` OBJECT! 
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                res.status(401);
                return next(new Error('User not found'));
            }
            // C. Pass control to controller
            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token invalid or expired'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token provided'));
    }
};

// Grant access to specific roles, Only Super Admin and Receptionist can access this route:
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(
                new Error(
                    `User role ${req.user ? req.user.role : ''} is not authorized to access this route`
                )
            );
        }
        next();
    };
};

export { protect, authorizeRoles };
