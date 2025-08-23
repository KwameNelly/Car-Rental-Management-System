# Car Rental Management System

A comprehensive car rental management system with a modern web interface and RESTful API.

## Features

- **User Management**: Registration, login, profile management
- **Car Management**: Add, edit, delete cars with detailed information
- **Rental System**: Book cars, manage rentals, track payments
- **Admin Dashboard**: Administrative tools for managing the system
- **Responsive Design**: Modern, mobile-friendly interface
- **RESTful API**: Complete backend API for integration

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Car-Rental-Management-System
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
# or for development with auto-reload
npm run dev
```

4. Access the application
- **Frontend**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs
- **API Base URL**: http://localhost:3001/api

## API Documentation

This project includes comprehensive **Swagger/OpenAPI documentation** that provides:

- Interactive API testing interface
- Complete endpoint documentation
- Request/response examples
- Data model schemas
- Authentication information

### Accessing the Documentation

1. Start the server: `npm start`
2. Open your browser and go to: **http://localhost:3001/api-docs**
3. Explore and test all API endpoints directly from the browser

### Key API Endpoints

- **Users**: `/api/users` - User management operations
- **Cars**: `/api/cars` - Car management operations  
- **Rentals**: `/api/rentals` - Rental management operations

## Project Structure

```
├── backend/                 # Backend API server
│   ├── controllers/        # API controllers
│   ├── routes/            # API route definitions
│   ├── model.js           # Database models
│   ├── db.js              # Database connection
│   ├── app.js             # Express server setup
│   └── swagger.js         # Swagger configuration
├── frontend/               # Frontend web application
│   ├── pages/             # HTML pages
│   ├── css/               # Stylesheets
│   ├── img/               # Images
│   └── src/               # JavaScript source files
└── package.json           # Project dependencies
```

## Testing

Run the API test suite to verify everything is working:

```bash
node backend/test-swagger.js
```

This will test:
- Server connectivity
- User registration and login
- Car creation
- Rental creation
- Data retrieval endpoints

## Database

The system uses SQLite for data storage. The database file (`car_rental.db`) is automatically created when you first run the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or issues:
1. Check the API documentation at `/api-docs`
2. Review the console logs for error messages
3. Ensure all dependencies are installed
4. Verify the server is running on the correct port

---

**Happy Coding! 🚗✨**
