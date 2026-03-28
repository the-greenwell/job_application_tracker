const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { issueTokens } = require('../utils/authUtility');
const argon2 = require('argon2');

const register = async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ error: 'User exists'})
            
        const hashedPassword = await argon2.hash(password);
        const user = await User.create({first_name, last_name, email, password: hashedPassword});
        
        const accessToken = await issueTokens(res, user);
        
        res.status(200).json({ message: 'Registration Successful', accessToken, user });
    } catch (error) {
        res.status(500).json({ error: 'Register User', message: error.message });
    }
};
    
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email });
        if (!user) return res.status(401).json({ error: 'Invalid Credentials'});
        
        const passwordsMatch = await argon2.verify(user.password, password);
        if(!passwordsMatch) return res.status(401).json({ error: 'Invalid Credentials' });
        
        const accessToken = await issueTokens(res, user);
        res.status(200).json({ message: 'Login Successful', accessToken, user });
    } catch (error) {
        res.status(500).json({ error: 'Login', message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(204).send();
        
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Logout', message: error.message });
    };
};

// const changePassword = async (req, res) => {
    
    // };
    
const newRefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: 'No Refresh Token'});

    try {
        const decodedUserData = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

        const user = await User.findOne({ _id: decodedUserData.id, refreshToken: refreshToken });
        if (!user) return res.status(403).json({ error: 'Refresh Token'});
        
        const accessToken = await issueTokens(res, user);
        res.status(200).json({ message: 'Token refreshed successfully', accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Refresh Token', message: 'Token has expired' });

        res.status(403).json({ error: 'Refresh Token', message: error.message })
    }
};

module.exports = {
    register,
    login,
    logout,
    newRefreshToken
}