const jwt = require('jsonwebtoken');

const authorizeAccessToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access Token' });

    try {
        const decodedUserData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        req.user = decodedUserData;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Access Token', message: 'Token has expired' });

        return res.status(403).json({ error: 'Access Token', message: 'Token is not valid' });
    };
};

module.exports = {
    authorizeAccessToken,
}