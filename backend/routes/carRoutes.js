const express = require('express');
const CarController = require('../controllers/carController');
const router = express.Router();

// Car Routes

router.get('/', CarController.getAllCars);

// GET /api/cars/available - Get all available cars
router.get('/available', CarController.getAvailableCars);

// GET /api/cars/search?q=searchTerm - Search cars
router.get('/search', CarController.searchCars);

// GET /api/cars/category/:category - Get cars by category
router.get('/category/:category', CarController.getCarsByCategory);

// GET /api/cars/:id - Get car by ID
router.get('/:id', CarController.getCarById);

router.post('/', CarController.createCar);

// PUT /api/cars/:id - Update car (Admin only)
router.put('/:id', CarController.updateCar);

// PATCH /api/cars/:id/availability - Update car availability
router.patch('/:id/availability', CarController.updateCarAvailability);

// DELETE /api/cars/:id - Delete car (Admin only)
router.delete('/:id', CarController.deleteCar);

module.exports = router;
