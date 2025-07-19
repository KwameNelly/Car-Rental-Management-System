const { CarModel } = require('../model');

/**
 * Car Controller - Handles all car-related operations
 */
class CarController {
  /**
   * Get all cars
   * GET /api/cars
   */
  static getAllCars(req, res) {
    CarModel.getAll((err, cars) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching cars',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Cars fetched successfully',
        data: cars,
        count: cars.length
      });
    });
  }

  /**
   * Get all available cars
   * GET /api/cars/available
   */
  static getAvailableCars(req, res) {
    CarModel.getAvailable((err, cars) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching available cars',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Available cars fetched successfully',
        data: cars,
        count: cars.length
      });
    });
  }

  /**
   * Get car by ID
   * GET /api/cars/:id
   */
  static getCarById(req, res) {
    const carId = req.params.id;

    if (!carId || isNaN(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid car ID is required'
      });
    }

    CarModel.findById(carId, (err, car) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching car',
          error: err.message
        });
      }

      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Car not found'
        });
      }

      res.json({
        success: true,
        message: 'Car fetched successfully',
        data: car
      });
    });
  }

  /**
   * Get cars by category
   * GET /api/cars/category/:category
   */
  static getCarsByCategory(req, res) {
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    CarModel.getByCategory(category, (err, cars) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching cars by category',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: `Cars in category '${category}' fetched successfully`,
        data: cars,
        count: cars.length
      });
    });
  }

  /**
   * Search cars
   * GET /api/cars/search?q=searchTerm
   */
  static searchCars(req, res) {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    CarModel.search(searchTerm, (err, cars) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error searching cars',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: `Search results for '${searchTerm}'`,
        data: cars,
        count: cars.length
      });
    });
  }

  /**
   * Create a new car (Admin only)
   * POST /api/cars
   */
  static createCar(req, res) {
    const {
      make,
      model,
      year,
      category,
      price_per_day,
      image_url,
      license_plate,
      description,
      features,
      fuel_type,
      transmission,
      seats
    } = req.body;

    // Validation
    if (!make || !model || !year || !category || !price_per_day || !license_plate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: make, model, year, category, price_per_day, license_plate'
      });
    }

    const carData = {
      make,
      model,
      year: parseInt(year),
      category,
      price_per_day: parseFloat(price_per_day),
      image_url,
      license_plate,
      description,
      features,
      fuel_type,
      transmission,
      seats: parseInt(seats) || 5
    };

    CarModel.create(carData, (err, carId) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({
            success: false,
            message: 'License plate already exists'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Error creating car',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Car created successfully',
        data: { id: carId, ...carData }
      });
    });
  }

  /**
   * Update car (Admin only)
   * PUT /api/cars/:id
   */
  static updateCar(req, res) {
    const carId = req.params.id;
    const updateData = req.body;

    if (!carId || isNaN(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid car ID is required'
      });
    }

    // Remove undefined values and convert numeric fields
    const cleanData = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== '') {
        if (key === 'year' || key === 'seats') {
          cleanData[key] = parseInt(updateData[key]);
        } else if (key === 'price_per_day') {
          cleanData[key] = parseFloat(updateData[key]);
        } else {
          cleanData[key] = updateData[key];
        }
      }
    });

    CarModel.update(carId, cleanData, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({
            success: false,
            message: 'License plate already exists'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Error updating car',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Car updated successfully'
      });
    });
  }

  /**
   * Update car availability
   * PATCH /api/cars/:id/availability
   */
  static updateCarAvailability(req, res) {
    const carId = req.params.id;
    const { availability } = req.body;

    if (!carId || isNaN(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid car ID is required'
      });
    }

    if (typeof availability !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Availability must be a boolean value'
      });
    }

    CarModel.updateAvailability(carId, availability ? 1 : 0, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error updating car availability',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: `Car ${availability ? 'enabled' : 'disabled'} successfully`
      });
    });
  }

  /**
   * Delete car (Admin only)
   * DELETE /api/cars/:id
   */
  static deleteCar(req, res) {
    const carId = req.params.id;

    if (!carId || isNaN(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid car ID is required'
      });
    }

    CarModel.delete(carId, (err) => {
      if (err) {
        if (err.message.includes('FOREIGN KEY constraint failed')) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete car with existing rentals'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'Error deleting car',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Car deleted successfully'
      });
    });
  }
}

module.exports = CarController;
