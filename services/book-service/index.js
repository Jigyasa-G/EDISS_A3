// This is the entry point for the Book Service.
// It sets up the Express server, connects to the database, and mounts the routes.
require('dotenv').config();
const express = require('express');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Mount the book routes
app.use('/books', bookRoutes);

// Status endpoint
app.get('/status', (req, res) => {
  res.status(200).send('OK');
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Book Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.BACk}`);
});
