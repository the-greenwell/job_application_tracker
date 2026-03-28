const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateAccessToken = (user) => {
    const { _id } = user;
    return jwt.sign(
        { id: _id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES || '15m' }
    );
};

const generateRefreshToken = (user) => {
    const { _id } = user;
    return jwt.sign(
        { id: _id },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES || '7d' }
    );
}

const issueTokens = async (res, user) => {
    const userObject = user.toObject ? user.toObject() : user;
    
    const accessToken = generateAccessToken(userObject);
    const newRefreshToken = generateRefreshToken(userObject);

    await User.findByIdAndUpdate(userObject._id, { refreshToken: newRefreshToken });
    
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return accessToken;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    issueTokens,
}