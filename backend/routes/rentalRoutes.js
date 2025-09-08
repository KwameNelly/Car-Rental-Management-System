const express = require('express');
const RentalController = require('../controllers/rentalController');
const { authenticateToken, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');
const router = express.Router();

// Rental Routes

// GET /api/rentals - Get all rentals (Admin only)
router.get('/', authenticateToken, requireAdmin, RentalController.getAllRentals);

// GET /api/rentals/stats - Get rental statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, RentalController.getRentalStats);

// GET /api/rentals/check-availability/:carId - Check car availability (Public)
router.get('/check-availability/:carId', RentalController.checkAvailability);

// GET /api/rentals/status/:status - Get rentals by status (Admin only)
router.get('/status/:status', authenticateToken, requireAdmin, RentalController.getRentalsByStatus);

// GET /api/rentals/user/:userId - Get rentals by user ID (Owner or Admin)
router.get('/user/:userId', authenticateToken, requireOwnerOrAdmin, RentalController.getRentalsByUserId);

// GET /api/rentals/:id - Get rental by ID (Owner or Admin)
router.get('/:id', authenticateToken, requireOwnerOrAdmin, RentalController.getRentalById);

// POST /api/rentals - Create new rental (Authenticated users)
router.post('/', authenticateToken, RentalController.createRental);

// PATCH /api/rentals/:id/status - Update rental status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, RentalController.updateRentalStatus);

// PATCH /api/rentals/:id/payment - Update payment status (Admin only)
router.patch('/:id/payment', authenticateToken, requireAdmin, RentalController.updatePaymentStatus);

// DELETE /api/rentals/:id - Delete rental (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, RentalController.deleteRental);

module.exports = router;
