const express = require('express');
const CarController = require('../controllers/carController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const router = express.Router();

// Car Routes

// GET /api/cars - Get all cars (Public)
router.get('/', CarController.getAllCars);

// GET /api/cars/available - Get all available cars (Public)
router.get('/available', CarController.getAvailableCars);

// GET /api/cars/search?q=searchTerm - Search cars (Public)
router.get('/search', CarController.searchCars);

// GET /api/cars/category/:category - Get cars by category (Public)
router.get('/category/:category', CarController.getCarsByCategory);

// GET /api/cars/:id - Get car by ID (Public)
router.get('/:id', CarController.getCarById);

// POST /api/cars - Create new car (Admin only)
router.post('/', authenticateToken, requireAdmin, uploadSingle, CarController.createCar);

// PUT /api/cars/:id - Update car (Admin only)
router.put('/:id', authenticateToken, requireAdmin, uploadSingle, CarController.updateCar);

// PATCH /api/cars/:id/availability - Update car availability (Admin only)
router.patch('/:id/availability', authenticateToken, requireAdmin, CarController.updateCarAvailability);

// DELETE /api/cars/:id - Delete car (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, CarController.deleteCar);

module.exports = router;