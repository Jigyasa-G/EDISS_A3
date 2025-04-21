// index.js
require('dotenv').config();
const express = require('express');
const jwtAuth = require('./middleware/jwtAuth');
const bookRoutes = require('./routes/bookRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 80;

// 1) Check X-Client-Type header
app.use((req, res, next) => {
  if (!req.header('X-Client-Type')) {
    return res.status(400).json({ message: 'Missing X-Client-Type header' });
  }
  // Could also check if it's iOS/Android specifically
  next();
});

// 2) JWT auth middleware
app.use(jwtAuth);

// 3) JSON parser
app.use(express.json());

// 4) Routes
app.use('/books', bookRoutes);
app.use('/customers', customerRoutes);

// Status endpoint
app.get('/status', (req, res) => {
  res.status(200).send('OK');
});

// Catch-all for unrecognized routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Mobile BFF running on port ${PORT}`);
});
