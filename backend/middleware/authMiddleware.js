const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // Short expiry for security
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Longer expiry for refresh token
    );
};

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Refresh token route (using HTTP-only cookies)
const refreshToken = (req, res) => {
    const token = req.cookies?.refreshToken; // Get refresh token from cookies
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
};

module.exports = { authenticate, generateAccessToken, generateRefreshToken, refreshToken};
