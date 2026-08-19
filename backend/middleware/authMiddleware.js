/**
 * Middleware functions for authenticating users and enforcing Role-Based Access Control (RBAC).
 * Supports both HTTP-only Cookies (req.cookies.jwt) and Bearer Token Headers (req.headers.authorization).
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
const protect = async (req, res, next) => {
    let token;

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // 2. Fallback to Authorization Header (Bearer token)
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                res.status(401);
                return next(new Error('User not found'));
            }
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

// Grant access to specific roles
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
