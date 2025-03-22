require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/books');
const customersRouter = require('./routes/customers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use('/books', booksRouter);
app.use('/customers', customersRouter);

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
  console.log(`Server running on port ${PORT}`);
});
