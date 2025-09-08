const { CarModel } = require('../model');

/**
 * Car Controller - Handles all car-related operations
 */
class CarController {
  /**
   * @swagger
   * /api/cars:
   *   get:
   *     summary: Get all cars
   *     tags: [Cars]
   *     responses:
   *       200:
   *         description: List of all cars
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Cars fetched successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Car'
   *                 count:
   *                   type: integer
   *                   example: 10
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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

      // Enhance cars with full image URLs
      const enhancedCars = cars.map(car => ({
        ...car,
        image_url: car.image_url ? `${req.protocol}://${req.get('host')}${car.image_url}` : null
      }));

      res.json({
        success: true,
        message: 'Cars fetched successfully',
        data: enhancedCars,
        count: enhancedCars.length
      });
    });
  }

  /**
   * @swagger
   * /api/cars/available:
   *   get:
   *     summary: Get all available cars
   *     tags: [Cars]
   *     responses:
   *       200:
   *         description: List of available cars
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Available cars fetched successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Car'
   *                 count:
   *                   type: integer
   *                   example: 5
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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

      // Enhance cars with full image URLs
      const enhancedCars = cars.map(car => ({
        ...car,
        image_url: car.image_url ? `${req.protocol}://${req.get('host')}${car.image_url}` : null
      }));

      res.json({
        success: true,
        message: 'Available cars fetched successfully',
        data: enhancedCars,
        count: enhancedCars.length
      });
    });
  }

  /**
   * @swagger
   * /api/cars/{id}:
   *   get:
   *     summary: Get car by ID
   *     tags: [Cars]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Car ID
   *     responses:
   *       200:
   *         description: Car fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Car fetched successfully
   *                 data:
   *                   $ref: '#/components/schemas/Car'
   *       400:
   *         description: Bad request - invalid car ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Car not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
        data: {
          ...car,
          image_url: car.image_url ? `${req.protocol}://${req.get('host')}${car.image_url}` : null
        }
      });
    });
  }

  /**
   * @swagger
   * /api/cars/category/{category}:
   *   get:
   *     summary: Get cars by category
   *     tags: [Cars]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *         description: Car category (e.g., Sedan, SUV, etc.)
   *     responses:
   *       200:
   *         description: Cars in category fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Cars in category 'Sedan' fetched successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Car'
   *                 count:
   *                   type: integer
   *                   example: 3
   *       400:
   *         description: Bad request - category is required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
        data: cars.map(car => ({
          ...car,
          image_url: car.image_url ? `${req.protocol}://${req.get('host')}${car.image_url}` : null
        })),
        count: cars.length
      });
    });
  }

  /**
   * @swagger
   * /api/cars/search:
   *   get:
   *     summary: Search cars
   *     tags: [Cars]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search term for car make, model, or description
   *     responses:
   *       200:
   *         description: Search results fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Search results for 'Toyota' fetched successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Car'
   *                 count:
   *                   type: integer
   *                   example: 2
   *       400:
   *         description: Bad request - search term is required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
        data: cars.map(car => ({
          ...car,
          image_url: car.image_url ? `${req.protocol}://${req.get('host')}${car.image_url}` : null
        })),
        count: cars.length
      });
    });
  }

  /**
   * @swagger
   * /api/cars:
   *   post:
   *     summary: Create a new car (Admin only)
   *     tags: [Cars]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - make
   *               - model
   *               - year
   *               - category
   *               - price_per_day
   *               - license_plate
   *             properties:
   *               make:
   *                 type: string
   *                 example: Toyota
   *                 description: Car manufacturer
   *               model:
   *                 type: string
   *                 example: Camry
   *                 description: Car model
   *               year:
   *                 type: integer
   *                 example: 2023
   *                 description: Manufacturing year
   *               category:
   *                 type: string
   *                 example: Sedan
   *                 description: Car category (Sedan, SUV, etc.)
   *               price_per_day:
   *                 type: number
   *                 format: float
   *                 example: 50.00
   *                 description: Daily rental price
   *               license_plate:
   *                 type: string
   *                 example: ABC123
   *                 description: Car license plate number
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Car image file (jpeg, jpg, png, gif, webp - max 5MB)
   *               description:
   *                 type: string
   *                 example: Comfortable family sedan
   *                 description: Car description
   *               features:
   *                 type: string
   *                 example: '["GPS", "Bluetooth"]'
   *                 description: JSON string of car features array
   *               fuel_type:
   *                 type: string
   *                 example: Gasoline
   *                 description: Type of fuel
   *               transmission:
   *                 type: string
   *                 example: Automatic
   *                 description: Transmission type
   *               seats:
   *                 type: integer
   *                 example: 5
   *                 description: Number of seats
   *     responses:
   *       201:
   *         description: Car created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Car created successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     make:
   *                       type: string
   *                       example: Toyota
   *                     model:
   *                       type: string
   *                       example: Camry
   *                     image_url:
   *                       type: string
   *                       example: http://localhost:3001/uploads/cars/car-1234567890.jpg
   *                       description: Full URL to uploaded car image
   *       400:
   *         description: Bad request - missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - license plate already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static createCar(req, res) {
    const {
      make,
      model,
      year,
      category,
      price_per_day,
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

    // Handle uploaded file
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/cars/${req.file.filename}`;
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
      features: features ? JSON.parse(features) : null,
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
        data: { 
          id: carId, 
          ...carData,
          image_url: image_url ? `${req.protocol}://${req.get('host')}${image_url}` : null
        }
      });
    });
  }

  /**
   * @swagger
   * /api/cars/{id}:
   *   put:
   *     summary: Update car (Admin only)
   *     tags: [Cars]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Car ID
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               make:
   *                 type: string
   *                 example: Toyota
   *                 description: Car manufacturer
   *               model:
   *                 type: string
   *                 example: Camry
   *                 description: Car model
   *               year:
   *                 type: integer
   *                 example: 2023
   *                 description: Manufacturing year
   *               category:
   *                 type: string
   *                 example: Sedan
   *                 description: Car category
   *               price_per_day:
   *                 type: number
   *                 format: float
   *                 example: 55.00
   *                 description: Daily rental price
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: New car image file (jpeg, jpg, png, gif, webp - max 5MB)
   *               description:
   *                 type: string
   *                 example: Updated car description
   *                 description: Car description
   *               features:
   *                 type: string
   *                 example: '["GPS", "Bluetooth", "Backup Camera"]'
   *                 description: JSON string of car features array
   *               fuel_type:
   *                 type: string
   *                 example: Gasoline
   *                 description: Type of fuel
   *               transmission:
   *                 type: string
   *                 example: Automatic
   *                 description: Transmission type
   *               seats:
   *                 type: integer
   *                 example: 5
   *                 description: Number of seats
   *     responses:
   *       200:
   *         description: Car updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Car updated successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     image_url:
   *                       type: string
   *                       example: http://localhost:3001/uploads/cars/car-1234567890.jpg
   *                       description: Full URL to updated car image
   *       400:
   *         description: Bad request - invalid car ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - license plate already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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

    // Handle uploaded file
    if (req.file) {
      updateData.image_url = `/uploads/cars/${req.file.filename}`;
    }

    // Remove undefined values and convert numeric fields
    const cleanData = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== '') {
        if (key === 'year' || key === 'seats') {
          cleanData[key] = parseInt(updateData[key]);
        } else if (key === 'price_per_day') {
          cleanData[key] = parseFloat(updateData[key]);
        } else if (key === 'features') {
          cleanData[key] = typeof updateData[key] === 'string' ? JSON.parse(updateData[key]) : updateData[key];
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
        message: 'Car updated successfully',
        data: {
          ...cleanData,
          image_url: cleanData.image_url ? `${req.protocol}://${req.get('host')}${cleanData.image_url}` : null
        }
      });
    });
  }

  /**
   * @swagger
   * /api/cars/{id}/availability:
   *   patch:
   *     summary: Update car availability
   *     tags: [Cars]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Car ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - availability
   *             properties:
   *               availability:
   *                 type: boolean
   *                 example: true
   *                 description: Car availability status
   *     responses:
   *       200:
   *         description: Car availability updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Car enabled successfully
   *       400:
   *         description: Bad request - invalid car ID or availability value
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   * @swagger
   * /api/cars/{id}:
   *   delete:
   *     summary: Delete car (Admin only)
   *     tags: [Cars]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Car ID
   *     responses:
   *       200:
   *         description: Car deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Car deleted successfully
   *       400:
   *         description: Bad request - invalid car ID or car has existing rentals
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
