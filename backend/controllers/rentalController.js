const { RentalModel, CarModel } = require('../model');

/**
 * Rental Controller - Handles all rental-related operations
 */
class RentalController {
  /**
   * Get all rentals (Admin only)
   * GET /api/rentals
   */
  static getAllRentals(req, res) {
    RentalModel.getAll((err, rentals) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching rentals',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Rentals fetched successfully',
        data: rentals,
        count: rentals.length
      });
    });
  }

  /**
   * Get rentals by user ID
   * GET /api/rentals/user/:userId
   */
  static getRentalsByUserId(req, res) {
    const userId = req.params.userId;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    RentalModel.getByUserId(userId, (err, rentals) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching user rentals',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'User rentals fetched successfully',
        data: rentals,
        count: rentals.length
      });
    });
  }

  /**
   * Get rental by ID
   * GET /api/rentals/:id
   */
  static getRentalById(req, res) {
    const rentalId = req.params.id;

    if (!rentalId || isNaN(rentalId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid rental ID is required'
      });
    }

    RentalModel.findById(rentalId, (err, rental) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching rental',
          error: err.message
        });
      }

      if (!rental) {
        return res.status(404).json({
          success: false,
          message: 'Rental not found'
        });
      }

      res.json({
        success: true,
        message: 'Rental fetched successfully',
        data: rental
      });
    });
  }

  /**
   * Get rentals by status
   * GET /api/rentals/status/:status
   */
  static getRentalsByStatus(req, res) {
    const status = req.params.status;
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    RentalModel.getByStatus(status, (err, rentals) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching rentals by status',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: `Rentals with status '${status}' fetched successfully`,
        data: rentals,
        count: rentals.length
      });
    });
  }

  /**
   * Create a new rental
   * POST /api/rentals
   */
  static createRental(req, res) {
    const {
      user_id,
      car_id,
      pickup_date,
      return_date,
      pickup_location,
      return_location,
      payment_method,
      notes
    } = req.body;

    // Validation
    if (!user_id || !car_id || !pickup_date || !return_date || !pickup_location) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: user_id, car_id, pickup_date, return_date, pickup_location'
      });
    }

    // Validate dates
    const pickupDate = new Date(pickup_date);
    const returnDate = new Date(return_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date cannot be in the past'
      });
    }

    if (returnDate <= pickupDate) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be after pickup date'
      });
    }

    // Check car availability first
    RentalController.checkCarAvailability(car_id, pickup_date, return_date, (availabilityErr, isAvailable) => {
      if (availabilityErr) {
        return res.status(500).json({
          success: false,
          message: 'Error checking car availability',
          error: availabilityErr.message
        });
      }

      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: 'Car is not available for the selected dates'
        });
      }

      // Get car details to calculate total amount
      CarModel.findById(car_id, (carErr, car) => {
        if (carErr) {
          return res.status(500).json({
            success: false,
            message: 'Error fetching car details',
            error: carErr.message
          });
        }

        if (!car) {
          return res.status(404).json({
            success: false,
            message: 'Car not found'
          });
        }

        if (!car.availability) {
          return res.status(400).json({
            success: false,
            message: 'Car is not available for rental'
          });
        }

        // Calculate total amount
        const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
        const total_amount = days * car.price_per_day;

        const rentalData = {
          user_id: parseInt(user_id),
          car_id: parseInt(car_id),
          pickup_date,
          return_date,
          pickup_location,
          return_location: return_location || pickup_location,
          total_amount,
          payment_method,
          notes
        };

        RentalModel.create(rentalData, (err, rentalId) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error creating rental',
              error: err.message
            });
          }

          // Update car availability
          CarModel.updateAvailability(car_id, 0, (updateErr) => {
            if (updateErr) {
              console.error('Warning: Could not update car availability:', updateErr.message);
            }
          });

          res.status(201).json({
            success: true,
            message: 'Rental created successfully',
            data: {
              id: rentalId,
              ...rentalData,
              days,
              car_info: {
                make: car.make,
                model: car.model,
                year: car.year
              }
            }
          });
        });
      });
    });
  }

  /**
   * Update rental status
   * PATCH /api/rentals/:id/status
   */
  static updateRentalStatus(req, res) {
    const rentalId = req.params.id;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

    if (!rentalId || isNaN(rentalId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid rental ID is required'
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    // Get rental details first
    RentalModel.findById(rentalId, (err, rental) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching rental',
          error: err.message
        });
      }

      if (!rental) {
        return res.status(404).json({
          success: false,
          message: 'Rental not found'
        });
      }

      RentalModel.updateStatus(rentalId, status, (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            success: false,
            message: 'Error updating rental status',
            error: updateErr.message
          });
        }

        // If rental is completed or cancelled, make car available again
        if (status === 'completed' || status === 'cancelled') {
          CarModel.updateAvailability(rental.car_id, 1, (carUpdateErr) => {
            if (carUpdateErr) {
              console.error('Warning: Could not update car availability:', carUpdateErr.message);
            }
          });
        }

        res.json({
          success: true,
          message: `Rental status updated to '${status}' successfully`
        });
      });
    });
  }

  /**
   * Update payment status
   * PATCH /api/rentals/:id/payment
   */
  static updatePaymentStatus(req, res) {
    const rentalId = req.params.id;
    const { payment_status } = req.body;
    const validPaymentStatuses = ['unpaid', 'pending', 'paid', 'refunded'];

    if (!rentalId || isNaN(rentalId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid rental ID is required'
      });
    }

    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Valid statuses: ${validPaymentStatuses.join(', ')}`
      });
    }

    RentalModel.updatePaymentStatus(rentalId, payment_status, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error updating payment status',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: `Payment status updated to '${payment_status}' successfully`
      });
    });
  }

  /**
   * Check car availability
   * GET /api/rentals/check-availability/:carId?pickup_date=YYYY-MM-DD&return_date=YYYY-MM-DD
   */
  static checkAvailability(req, res) {
    const carId = req.params.carId;
    const { pickup_date, return_date } = req.query;

    if (!carId || isNaN(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid car ID is required'
      });
    }

    if (!pickup_date || !return_date) {
      return res.status(400).json({
        success: false,
        message: 'Both pickup_date and return_date are required'
      });
    }

    RentalController.checkCarAvailability(carId, pickup_date, return_date, (err, isAvailable) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error checking availability',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Availability checked successfully',
        data: {
          car_id: parseInt(carId),
          pickup_date,
          return_date,
          available: isAvailable
        }
      });
    });
  }

  /**
   * Get rental statistics (Admin only)
   * GET /api/rentals/stats
   */
  static getRentalStats(req, res) {
    RentalModel.getStats((err, stats) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching rental statistics',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Rental statistics fetched successfully',
        data: stats
      });
    });
  }

  /**
   * Delete rental (Admin only)
   * DELETE /api/rentals/:id
   */
  static deleteRental(req, res) {
    const rentalId = req.params.id;

    if (!rentalId || isNaN(rentalId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid rental ID is required'
      });
    }

    // Get rental details first to free up the car
    RentalModel.findById(rentalId, (err, rental) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching rental',
          error: err.message
        });
      }

      if (!rental) {
        return res.status(404).json({
          success: false,
          message: 'Rental not found'
        });
      }

      RentalModel.delete(rentalId, (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({
            success: false,
            message: 'Error deleting rental',
            error: deleteErr.message
          });
        }

        // Make car available again
        CarModel.updateAvailability(rental.car_id, 1, (carUpdateErr) => {
          if (carUpdateErr) {
            console.error('Warning: Could not update car availability:', carUpdateErr.message);
          }
        });

        res.json({
          success: true,
          message: 'Rental deleted successfully'
        });
      });
    });
  }

  /**
   * Helper method to check car availability
   */
  static checkCarAvailability(carId, pickupDate, returnDate, callback) {
    RentalModel.checkAvailability(carId, pickupDate, returnDate, null, callback);
  }
}

module.exports = RentalController;
