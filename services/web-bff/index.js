const express = require('express');
const webRoutes = require('./routes/webRoutes');
const bookWebRoute = require('./routes/bookWebRoute');
const customerWebRoute = require('./routes/customerWebRoute');
const jwtAuth = require('./middleware/jwtAuth');

const app = express();
const PORT = process.env.PORT || 81;  // Using 81 as in your .env file

// Add JSON body parser
app.use(express.json());

// X-Client-Type check
app.use((req, res, next) => {
  if (!req.header('X-Client-Type')) {
    return res.status(400).json({ message: 'Missing X-Client-Type header' });
  }
  next();
});

// JWT auth
app.use(jwtAuth);

// Mount the book routes at /books
app.use('/books', bookWebRoute);

// Mount the customer routes at /customers
app.use('/customers', customerWebRoute);

// Status endpoint
app.get('/status', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('OK');
});

// Catch-all error handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Web BFF running on port ${PORT}`);
  console.log(`Environment: ${process.env.URL_BASE_BACKEND_SERVICES_BOOK}`);
  console.log(`Environment: ${process.env.URL_BASE_BACKEND_SERVICES_CUSTOMER}`);
});