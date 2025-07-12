const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Route for other pages
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '../frontend/pages', page);
  res.sendFile(filePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
