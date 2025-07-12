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

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (Node Package Manager) - Comes with Node.js
- **Git** - For cloning the repository

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/KwameNelly/Car-Rental-Management-System.git
   cd Car-Rental-Management-System
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will install:
   - Express.js v5.1.0 (for the backend server)
   - Nodemon v3.1.10 (for development auto-restart)

### 🔥 Running the Project

#### Option 1: Development Mode (Recommended)

```bash
npm run dev
```

This command:

- Starts the Express server with nodemon
- Automatically restarts the server when you make changes
- Serves the frontend at `http://localhost:3001`

#### Option 2: Production Mode

```bash
npm start
```

This command:

- Starts the Express server in production mode
- Serves the frontend at `http://localhost:3001`

#### Option 3: Manual Server Start

```bash
node backend/app.js
```

### 🌐 Accessing the Application

Once the server is running, open your web browser and navigate to:

```url
http://localhost:3001
```

You should see the Car Rental homepage with:

- ✅ Proper CSS styling
- ✅ Working navigation
- ✅ Images loading correctly
- ✅ Interactive elements

### 🛠️ Development Workflow

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Make your changes** to any file in the project

3. **The server will automatically restart** (thanks to nodemon)

4. **Refresh your browser** to see the changes

### 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server in production mode |
| `npm run dev` | Start the server in development mode with auto-restart |
| `npm test` | Run tests (not configured yet) |

### 🔧 Troubleshooting

#### Server won't start?

- Check if port 3001 is already in use
- Make sure you've run `npm install`
- Verify Node.js is installed: `node --version`

#### CSS not loading?

- Ensure the server is running
- Check that all file paths use `../` for relative navigation
- Verify the server is serving from `http://localhost:3001`

#### Images not showing?

- Confirm images are in the `frontend/img/` directory
- Check that image paths in HTML use `../img/` prefix

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
