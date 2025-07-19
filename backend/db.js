const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file path
const dbPath = path.join(__dirname, 'car_rental.db');

// Create connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Cars table
    db.run(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        category VARCHAR(30) NOT NULL,
        price_per_day DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        availability BOOLEAN DEFAULT 1,
        license_plate VARCHAR(20) UNIQUE,
        description TEXT,
        features TEXT,
        fuel_type VARCHAR(20) DEFAULT 'Petrol',
        transmission VARCHAR(20) DEFAULT 'Manual',
        seats INTEGER DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating cars table:', err);
        reject(err);
        return;
      }

      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          full_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          license_number VARCHAR(50),
          role VARCHAR(20) DEFAULT 'customer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }

        // Rentals table
        db.run(`
          CREATE TABLE IF NOT EXISTS rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            car_id INTEGER NOT NULL,
            pickup_date DATE NOT NULL,
            return_date DATE NOT NULL,
            pickup_location VARCHAR(255) NOT NULL,
            return_location VARCHAR(255),
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            payment_status VARCHAR(20) DEFAULT 'unpaid',
            payment_method VARCHAR(50),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE RESTRICT
          )
        `, (err) => {
          if (err) {
            console.error('Error creating rentals table:', err);
            reject(err);
            return;
          }

          // Create indexes for better performance
          const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_cars_availability ON cars(availability)',
            'CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category)',
            'CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_rentals_car_id ON rentals(car_id)',
            'CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status)',
            'CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(pickup_date, return_date)'
          ];

          let indexCount = 0;
          indexes.forEach(indexQuery => {
            db.run(indexQuery, (err) => {
              if (err) {
                console.error('Error creating index:', err);
              }
              indexCount++;
              if (indexCount === indexes.length) {
                console.log('Database tables and indexes initialized successfully');
                resolve();
              }
            });
          });
        });
      });
    });
  });
};

// Call initialization
initializeDatabase();

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = db;
