# Car Rental Management System

A modern, responsive car rental website with a full-stack architecture featuring a sleek frontend interface and Express.js backend server.

## 🚗 Project Overview

This Car Rental Management System provides a complete solution for car rental businesses, offering an intuitive user interface for customers to browse, book, and manage car rentals. The system includes user authentication, service information, booking forms, and customer reviews.

## ✨ Features

### Frontend Features

- **Responsive Design**: Mobile-first responsive layout that works on all devices
- **Interactive UI**: Smooth animations and transitions using ScrollReveal
- **User Authentication**: Sign-in and sign-up forms with password visibility toggle
- **Car Browse & Search**: Browse available vehicles with detailed information
- **Booking System**: Comprehensive booking form for car reservations
- **Service Pages**: Detailed information about rental services
- **About Section**: Company information and team details
- **Customer Reviews**: Display of customer testimonials
- **Modern Styling**: Clean, professional design with CSS3

### Backend Features

- **Express.js Server**: Lightweight and fast Node.js server
- **RESTful API**: Clean API structure for frontend communication
- **Modular Architecture**: Well-organized codebase for easy maintenance

## 🛠️ Tech Stack

### Frontend

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Interactive functionality and DOM manipulation
- **BoxIcons**: Icon library for UI elements
- **ScrollReveal**: Animation library for smooth scroll effects

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **JavaScript**: Server-side logic

## 📁 Project Structure

```text
Car-Rental-Management-System/
├── backend/
│   └── app.js                 # Express server configuration
├── frontend/
│   ├── css/
│   │   ├── login.css          # Authentication page styles
│   │   ├── stylesheet.css     # Main application styles
│   │   └── test.css           # Additional styles
│   ├── img/                   # Image assets (cars, logos, backgrounds)
│   ├── pages/
│   │   ├── index.html         # Homepage
│   │   ├── about.html         # About page
│   │   ├── services.html      # Services page
│   │   ├── booking-form.html  # Car booking form
│   │   ├── sign-in.html       # User login page
│   │   └── sign-up.html       # User registration page
│   └── src/
│       └── main.js            # Frontend JavaScript logic
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Car-Rental-Management-System/assi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the backend server**

   ```bash
   node backend/app.js
   ```

   Server will run on `http://localhost:3001`

4. **Open the frontend**
   Open `frontend/pages/index.html` in your web browser or serve it using a local development server.

### Development Mode

For development with auto-restart capability:

```bash
npx nodemon backend/app.js
```

## 📋 Available Pages

1. **Homepage** (`index.html`) - Main landing page with hero section and car showcase
2. **Services** (`services.html`) - Detailed rental services and pricing
3. **About** (`about.html`) - Company information and team
4. **Booking Form** (`booking-form.html`) - Car reservation interface
5. **Sign In** (`sign-in.html`) - User authentication
6. **Sign Up** (`sign-up.html`) - New user registration

## 🎯 Key Features Breakdown

### User Interface

- **Navigation**: Responsive navigation bar with mobile menu
- **Hero Section**: Eye-catching landing area with call-to-action
- **Car Gallery**: Showcase of available rental vehicles
- **Interactive Forms**: User-friendly booking and authentication forms
- **Reviews Section**: Customer testimonials and ratings

### Backend API

- **Welcome Endpoint**: GET `/` - Server status and welcome message
- **Port Configuration**: Runs on port 3001
- **Express Integration**: RESTful API structure ready for expansion

## 🔧 Configuration

### Server Configuration

- **Port**: 3001 (configurable in `backend/app.js`)
- **Environment**: Development/Production ready

### Frontend Configuration

- **Responsive Breakpoints**: Mobile-first design approach
- **Animation Settings**: ScrollReveal with customizable parameters
- **Asset Paths**: Relative paths for easy deployment

## 🚀 Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Backend Deployment

The Express server can be deployed to:

- Heroku
- AWS EC2
- DigitalOcean
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Contact

For questions, suggestions, or support, please contact the development team.

---

Built with ❤️ using Express.js and modern web technologies.
