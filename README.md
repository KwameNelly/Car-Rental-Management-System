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
# 🔒 Protected Endpoints Guide

## How Authentication Works

### 1. **JWT Token Flow**
```
1. User registers/logs in → Gets JWT token
2. Client stores token → Sends with each request
3. Server validates token → Allows/denies access
4. Token expires → User must login again
```
admin email: admin@carrental.com
admin password: admin@carrental.com
### 2. **Request Format**
```javascript
// Include token in Authorization header
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
};

// Example request
fetch('/api/users/123', { headers })
```

### 3. **Middleware Chain**
```
Request → authenticateToken → requireAdmin/requireOwnerOrAdmin → Controller
```

## 🔐 Route Protection Levels

### **Public Routes** (No authentication required)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login  
- `POST /api/users/admin/login` - Admin login
- `GET /api/cars` - List all cars
- `GET /api/cars/available` - List available cars
- `GET /api/cars/search` - Search cars
- `GET /api/cars/category/:category` - Cars by category
- `GET /api/cars/:id` - Get car details
- `GET /api/rentals/check-availability/:carId` - Check availability

### **Authenticated Routes** (Valid JWT token required)
- `GET /api/users/:id` - Get user profile (owner or admin)
- `PUT /api/users/:id` - Update user profile (owner or admin)
- `POST /api/users/:id/change-password` - Change password (owner or admin)
- `POST /api/rentals` - Create rental

### **Admin-Only Routes** (Admin role required)
- `GET /api/users` - List all users
- `POST /api/cars` - Create car
- `PUT /api/cars/:id` - Update car
- `PATCH /api/cars/:id/availability` - Update car availability
- `DELETE /api/cars/:id` - Delete car
- `GET /api/rentals` - List all rentals
- `GET /api/rentals/stats` - Rental statistics
- `GET /api/rentals/status/:status` - Rentals by status
- `PATCH /api/rentals/:id/status` - Update rental status
- `PATCH /api/rentals/:id/payment` - Update payment status
- `DELETE /api/rentals/:id` - Delete rental

### **Owner or Admin Routes** (User owns resource OR admin)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/change-password` - Change password
- `GET /api/rentals/user/:userId` - Get user's rentals
- `GET /api/rentals/:id` - Get rental details

## 🚫 Error Responses

### **401 Unauthorized** (No token)
```json
{
  "success": false,
  "message": "Access token required",
  "error": "No token provided"
}
```

### **403 Forbidden** (Invalid token or insufficient permissions)
```json
{
  "success": false,
  "message": "Invalid token",
  "error": "Token verification failed"
}
```

```json
{
  "success": false,
  "message": "Admin access required",
  "error": "Insufficient permissions"
}
```

### **Token Expired**
```json
{
  "success": false,
  "message": "Token expired",
  "error": "Please login again"
}
```

## 🧪 Testing Protected Endpoints

### **Test Script**
Run the test script to verify all protection levels:
```bash
node backend/test-protected-endpoints.js
```

### **Manual Testing with curl**
```bash
# Test without token (should fail)
curl http://localhost:3001/api/users

# Test with token (should work)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3001/api/users/123

# Test admin endpoint with regular user token (should fail)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3001/api/users
```

### **Testing with Swagger UI**
1. Go to `http://localhost:3001/api-docs`
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Test protected endpoints

## 🔧 Frontend Integration

### **Store Token**
```javascript
// After login
localStorage.setItem('authToken', response.data.token);
```

### **Use Token in Requests**
```javascript
const token = localStorage.getItem('authToken');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

fetch('/api/users/123', { headers })
```

### **Handle Token Expiry**
```javascript
fetch('/api/users/123', { headers })
  .then(response => {
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return response.json();
  });
```

## 🛡️ Security Features

- **JWT Tokens**: Secure, stateless authentication
- **Token Expiry**: 24-hour expiration
- **Role-Based Access**: Admin vs regular user permissions
- **Resource Ownership**: Users can only access their own data
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: All endpoints validate required fields

## 📝 Next Steps

1. **Install JWT package**: `npm install jsonwebtoken`
2. **Set JWT secret**: Use environment variable `JWT_SECRET`
3. **Test endpoints**: Run the test script
4. **Frontend integration**: Update frontend to use tokens
5. **Admin panel**: Create admin interface for protected operations

**Happy Coding! 🚗✨**
