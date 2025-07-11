// app.js
const express = require('express');
const app = express();
const PORT = 3001;

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Welcome to ASSI Car Rental System!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
