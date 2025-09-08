const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');
const router = express.Router();

// User Routes

// GET /api/users - Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, UserController.getAllUsers);

// GET /api/users/:id - Get user by ID (Owner or Admin)
router.get('/:id', authenticateToken, requireOwnerOrAdmin, UserController.getUserById);

// POST /api/users/register - Register new user (Public)
router.post('/register', UserController.registerUser);

// POST /api/users/login - User login (Public)
router.post('/login', UserController.loginUser);

// POST /api/users/admin/login - Admin login (Public)
router.post('/admin/login', UserController.adminLogin);

// PUT /api/users/:id - Update user profile (Owner or Admin)
router.put('/:id', authenticateToken, requireOwnerOrAdmin, UserController.updateUser);

// POST /api/users/:id/change-password - Change user password (Owner or Admin)
router.post('/:id/change-password', authenticateToken, requireOwnerOrAdmin, UserController.changePassword);

module.exports = router;
