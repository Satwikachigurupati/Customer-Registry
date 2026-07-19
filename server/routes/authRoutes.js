const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateDetails, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/details', protect, updateDetails);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
