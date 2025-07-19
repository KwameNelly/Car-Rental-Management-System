const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// User Routes

// GET /api/users - Get all users (Admin only)
router.get('/', UserController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// POST /api/users/register - Register new user
router.post('/register', UserController.registerUser);

// POST /api/users/login - User login
router.post('/login', UserController.loginUser);

// POST /api/users/admin/login - Admin login
router.post('/admin/login', UserController.adminLogin);

// PUT /api/users/:id - Update user profile
router.put('/:id', UserController.updateUser);

// POST /api/users/:id/change-password - Change user password
router.post('/:id/change-password', UserController.changePassword);

module.exports = router;
