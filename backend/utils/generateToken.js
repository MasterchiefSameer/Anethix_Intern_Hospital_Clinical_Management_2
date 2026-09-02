/**
 * Utility to generate a JWT and set it as an HTTP-only cookie in the response.
 * Also returns the token string so it can be optionally used in Authorization headers.
 */
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must be 'none' for cross-domain on Vercel
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};

export default generateToken;
