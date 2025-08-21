const express = require('express');
const RentalController = require('../controllers/rentalController');
const router = express.Router();

// Rental Routes

// GET /api/rentals - Get all rentals (Admin only)
router.get('/', RentalController.getAllRentals);

// GET /api/rentals/stats - Get rental statistics (Admin only)
router.get('/stats', RentalController.getRentalStats);

// GET /api/rentals/check-availability/:carId - Check car availability
router.get('/check-availability/:carId', RentalController.checkAvailability);

// GET /api/rentals/status/:status - Get rentals by status
router.get('/status/:status', RentalController.getRentalsByStatus);

// GET /api/rentals/user/:userId - Get rentals by user ID
router.get('/user/:userId', RentalController.getRentalsByUserId);

// GET /api/rentals/:id - Get rental by ID
router.get('/:id', RentalController.getRentalById);

router.post('/', RentalController.createRental);

// PATCH /api/rentals/:id/status - Update rental status
router.patch('/:id/status', RentalController.updateRentalStatus);

// PATCH /api/rentals/:id/payment - Update payment status
router.patch('/:id/payment', RentalController.updatePaymentStatus);

// DELETE /api/rentals/:id - Delete rental (Admin only)
router.delete('/:id', RentalController.deleteRental);

module.exports = router;
