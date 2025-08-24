const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./configs/swagger');
const app = express();
const cors = require('cors');

// Import routes
const carRoutes = require('./routes/carRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the frontend directory
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.static(path.join(__dirname, '../frontend')));

// Swagger Documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
//   customCss: '.swagger-ui .topbar { display: none }',
//   customSiteTitle: 'Car Rental API Documentation',
//   swaggerOptions: {
//     docExpansion: 'list',
//     filter: true,
//     showRequestHeaders: true,
//     defaultModelsExpandDepth: 3,
//     defaultModelExpandDepth: 3
//   }
// }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API Routes
app.use('/api/cars', carRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/users', userRoutes);

// Web Routes (HTML pages)
// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Route for other pages
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  // Ensure the page has .html extension
  const fileName = page.endsWith('.html') ? page : `${page}.html`;
  const filePath = path.join(__dirname, '../frontend/pages', fileName);
  
  // Check if file exists and send it, otherwise send 404
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(__dirname, '../frontend/pages/404.html'));
    }
  });
});

// Route for booking form
app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/booking-form.html'));
});

// Route for admin login
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin-login.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes (exclude Swagger docs)
app.use('/api/*name', (req, res, next) => {
  // Skip if it's a Swagger documentation request
  if (req.path.startsWith('/api-docs')) {
    return next();
  }
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// 404 handler for web routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/pages/404.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log('🎯 Available API endpoints:');
  console.log('   Cars: /api/cars');
  console.log('   Rentals: /api/rentals');
  console.log('   Users: /api/users');
});
