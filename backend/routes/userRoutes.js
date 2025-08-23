const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// User Routes

router.get('/', UserController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

router.post('/register', UserController.registerUser);

router.post('/login', UserController.loginUser);

// POST /api/users/admin/login - Admin login
router.post('/admin/login', UserController.adminLogin);

// PUT /api/users/:id - Update user profile
router.put('/:id', UserController.updateUser);

// POST /api/users/:id/change-password - Change user password
router.post('/:id/change-password', UserController.changePassword);

module.exports = router;
