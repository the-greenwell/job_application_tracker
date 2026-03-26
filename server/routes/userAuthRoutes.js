const { Router } = require('express');
const { login, logout, register, newRefreshToken, } = require('../controllers/authController');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/refresh', newRefreshToken);

module.exports = router;