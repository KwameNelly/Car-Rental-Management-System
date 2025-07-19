const db = require('./db');

/**
 * Car Model - Handles all car-related database operations
 */
class CarModel {
  /**
   * Create a new car
   * @param {Object} carData - Car information
   * @param {Function} callback - Callback function
   */
  static create(carData, callback) {
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
      fuel_type = 'Petrol',
      transmission = 'Manual',
      seats = 5
    } = carData;

    const query = `
      INSERT INTO cars (
        make, model, year, category, price_per_day, image_url, 
        license_plate, description, features, fuel_type, transmission, seats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [
      make, model, year, category, price_per_day, image_url,
      license_plate, description, features, fuel_type, transmission, seats
    ], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  /**
   * Get all cars
   * @param {Function} callback - Callback function
   */
  static getAll(callback) {
    const query = 'SELECT * FROM cars ORDER BY created_at DESC';
    db.all(query, [], callback);
  }

  /**
   * Get all available cars
   * @param {Function} callback - Callback function
   */
  static getAvailable(callback) {
    const query = 'SELECT * FROM cars WHERE availability = 1 ORDER BY created_at DESC';
    db.all(query, [], callback);
  }

  /**
   * Get car by ID
   * @param {number} id - Car ID
   * @param {Function} callback - Callback function
   */
  static findById(id, callback) {
    const query = 'SELECT * FROM cars WHERE id = ?';
    db.get(query, [id], callback);
  }

  /**
   * Get cars by category
   * @param {string} category - Car category
   * @param {Function} callback - Callback function
   */
  static getByCategory(category, callback) {
    const query = 'SELECT * FROM cars WHERE category = ? AND availability = 1';
    db.all(query, [category], callback);
  }

  /**
   * Update car availability
   * @param {number} id - Car ID
   * @param {boolean} availability - Availability status
   * @param {Function} callback - Callback function
   */
  static updateAvailability(id, availability, callback) {
    const query = 'UPDATE cars SET availability = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(query, [availability, id], callback);
  }

  /**
   * Update car information
   * @param {number} id - Car ID
   * @param {Object} updateData - Data to update
   * @param {Function} callback - Callback function
   */
  static update(id, updateData, callback) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return callback(new Error('No fields to update'));
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE cars SET ${fields.join(', ')} WHERE id = ?`;
    db.run(query, values, callback);
  }

  /**
   * Delete a car
   * @param {number} id - Car ID
   * @param {Function} callback - Callback function
   */
  static delete(id, callback) {
    const query = 'DELETE FROM cars WHERE id = ?';
    db.run(query, [id], callback);
  }

  /**
   * Search cars by make, model, or category
   * @param {string} searchTerm - Search term
   * @param {Function} callback - Callback function
   */
  static search(searchTerm, callback) {
    const query = `
      SELECT * FROM cars 
      WHERE (make LIKE ? OR model LIKE ? OR category LIKE ?) 
      AND availability = 1
    `;
    const term = `%${searchTerm}%`;
    db.all(query, [term, term, term], callback);
  }
}

/**
 * Rental Model - Handles all rental-related database operations
 */
class RentalModel {
  /**
   * Create a new rental
   * @param {Object} rentalData - Rental information
   * @param {Function} callback - Callback function
   */
  static create(rentalData, callback) {
    const {
      user_id,
      car_id,
      pickup_date,
      return_date,
      pickup_location,
      return_location,
      total_amount,
      payment_method,
      notes
    } = rentalData;

    const query = `
      INSERT INTO rentals (
        user_id, car_id, pickup_date, return_date, pickup_location,
        return_location, total_amount, payment_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [
      user_id, car_id, pickup_date, return_date, pickup_location,
      return_location, total_amount, payment_method, notes
    ], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  /**
   * Get all rentals
   * @param {Function} callback - Callback function
   */
  static getAll(callback) {
    const query = `
      SELECT 
        r.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.license_plate
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      ORDER BY r.created_at DESC
    `;
    db.all(query, [], callback);
  }

  /**
   * Get rentals by user ID
   * @param {number} userId - User ID
   * @param {Function} callback - Callback function
   */
  static getByUserId(userId, callback) {
    const query = `
      SELECT 
        r.*,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.image_url as car_image,
        c.license_plate
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    db.all(query, [userId], callback);
  }

  /**
   * Get rental by ID
   * @param {number} id - Rental ID
   * @param {Function} callback - Callback function
   */
  static findById(id, callback) {
    const query = `
      SELECT 
        r.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.image_url as car_image,
        c.license_plate
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      WHERE r.id = ?
    `;
    db.get(query, [id], callback);
  }

  /**
   * Update rental status
   * @param {number} id - Rental ID
   * @param {string} status - New status
   * @param {Function} callback - Callback function
   */
  static updateStatus(id, status, callback) {
    const query = 'UPDATE rentals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(query, [status, id], callback);
  }

  /**
   * Update payment status
   * @param {number} id - Rental ID
   * @param {string} paymentStatus - New payment status
   * @param {Function} callback - Callback function
   */
  static updatePaymentStatus(id, paymentStatus, callback) {
    const query = 'UPDATE rentals SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(query, [paymentStatus, id], callback);
  }

  /**
   * Check car availability for given dates
   * @param {number} carId - Car ID
   * @param {string} pickupDate - Pickup date
   * @param {string} returnDate - Return date
   * @param {number} excludeRentalId - Rental ID to exclude (for updates)
   * @param {Function} callback - Callback function
   */
  static checkAvailability(carId, pickupDate, returnDate, excludeRentalId = null, callback) {
    let query = `
      SELECT COUNT(*) as count FROM rentals 
      WHERE car_id = ? 
      AND status NOT IN ('cancelled', 'completed')
      AND (
        (pickup_date <= ? AND return_date >= ?) OR
        (pickup_date <= ? AND return_date >= ?) OR
        (pickup_date >= ? AND return_date <= ?)
      )
    `;
    
    let params = [carId, pickupDate, pickupDate, returnDate, returnDate, pickupDate, returnDate];

    if (excludeRentalId) {
      query += ' AND id != ?';
      params.push(excludeRentalId);
    }

    db.get(query, params, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result.count === 0);
      }
    });
  }

  /**
   * Get rentals by status
   * @param {string} status - Rental status
   * @param {Function} callback - Callback function
   */
  static getByStatus(status, callback) {
    const query = `
      SELECT 
        r.*,
        u.full_name as customer_name,
        u.email as customer_email,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.license_plate
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      WHERE r.status = ?
      ORDER BY r.created_at DESC
    `;
    db.all(query, [status], callback);
  }

  /**
   * Delete a rental
   * @param {number} id - Rental ID
   * @param {Function} callback - Callback function
   */
  static delete(id, callback) {
    const query = 'DELETE FROM rentals WHERE id = ?';
    db.run(query, [id], callback);
  }

  /**
   * Get rental statistics
   * @param {Function} callback - Callback function
   */
  static getStats(callback) {
    const query = `
      SELECT 
        COUNT(*) as total_rentals,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_rentals,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_rentals,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_rentals,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_revenue
      FROM rentals
    `;
    db.get(query, [], callback);
  }
}

/**
 * User Model - Handles all user-related database operations
 */
class UserModel {
  /**
   * Create a new user
   * @param {Object} userData - User information
   * @param {Function} callback - Callback function
   */
  static create(userData, callback) {
    const {
      username,
      email,
      password,
      full_name,
      phone,
      license_number,
      role = 'customer'
    } = userData;

    const query = `
      INSERT INTO users (username, email, password, full_name, phone, license_number, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [username, email, password, full_name, phone, license_number, role], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @param {Function} callback - Callback function
   */
  static findByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], callback);
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @param {Function} callback - Callback function
   */
  static findById(id, callback) {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [id], callback);
  }

  /**
   * Get all users
   * @param {Function} callback - Callback function
   */
  static getAll(callback) {
    const query = 'SELECT id, username, email, full_name, phone, role, created_at FROM users ORDER BY created_at DESC';
    db.all(query, [], callback);
  }

  /**
   * Update user information
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @param {Function} callback - Callback function
   */
  static update(id, updateData, callback) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return callback(new Error('No fields to update'));
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    db.run(query, values, callback);
  }
}

module.exports = {
  CarModel,
  RentalModel,
  UserModel
};
