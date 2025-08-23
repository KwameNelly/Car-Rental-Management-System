const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Car Rental Management System API",
      version: "1.0.0",
      description: "API documentation for Car Rental Management System - Comprehensive car rental platform",
      contact: {
        name: "Car Rental Team",
        email: "support@carrental.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.carrental.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "john_doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            full_name: { type: "string", example: "John Doe" },
            phone: { type: "string", example: "+1234567890" },
            license_number: { type: "string", example: "DL123456789" },
            role: { type: "string", enum: ["customer", "admin"], example: "customer" },
            created_at: { type: "string", format: "date-time" }
          },
          required: ["username", "email", "full_name"]
        },
        Car: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            make: { type: "string", example: "Toyota" },
            model: { type: "string", example: "Camry" },
            year: { type: "integer", example: 2023 },
            category: { type: "string", example: "Sedan" },
            price_per_day: { type: "number", format: "float", example: 50.00 },
            image_url: { type: "string", example: "https://example.com/car.jpg" },
            license_plate: { type: "string", example: "ABC123" },
            description: { type: "string", example: "Comfortable family sedan" },
            features: { type: "array", items: { type: "string" }, example: ["GPS", "Bluetooth"] },
            fuel_type: { type: "string", example: "Gasoline" },
            transmission: { type: "string", example: "Automatic" },
            seats: { type: "integer", example: 5 },
            availability: { type: "boolean", example: true }
          },
          required: ["make", "model", "year", "category", "price_per_day", "license_plate"]
        },
        Rental: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 1 },
            car_id: { type: "integer", example: 1 },
            pickup_date: { type: "string", format: "date", example: "2024-01-15" },
            return_date: { type: "string", format: "date", example: "2024-01-20" },
            pickup_location: { type: "string", example: "Airport Terminal 1" },
            return_location: { type: "string", example: "Airport Terminal 1" },
            total_amount: { type: "number", format: "float", example: 250.00 },
            payment_method: { type: "string", example: "Credit Card" },
            status: { type: "string", enum: ["pending", "confirmed", "active", "completed", "cancelled"], example: "pending" },
            payment_status: { type: "string", enum: ["unpaid", "pending", "paid", "refunded"], example: "unpaid" },
            notes: { type: "string", example: "Early pickup requested" },
            created_at: { type: "string", format: "date-time" }
          },
          required: ["user_id", "car_id", "pickup_date", "return_date", "pickup_location"]
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
            error: { type: "string", example: "Detailed error information" }
          }
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
            count: { type: "integer", example: 10 }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Users", description: "User management operations" },
      { name: "Cars", description: "Car management operations" },
      { name: "Rentals", description: "Rental management operations" }
    ]
  },
  apis: [
    "./backend/routes/*.js",
    "./backend/model.js",
    "./backend/controllers/*.js"
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
