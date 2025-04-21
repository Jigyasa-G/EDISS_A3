const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOOKS_SERVICE_URL = process.env.URL_BASE_BACKEND_SERVICES_BOOK;

// Add a new book
router.post('/', async (req, res) => {
    console.log(BOOKS_SERVICE_URL);
  try {
    const response = await axios.post(`${BOOKS_SERVICE_URL}${req.originalUrl}`, req.body, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to books service' });
  }
});

// Update a book
router.put('/:ISBN', async (req, res) => {
  try {
    const response = await axios.put(`${BOOKS_SERVICE_URL}${req.originalUrl}`, req.body, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to books service' });
  }
});

// NEW ➜ Related books
router.get('/:ISBN/related-books', async (req, res) => {
    try {
      const response = await axios.get(`${BOOKS_SERVICE_URL}${req.originalUrl}`, {
        headers: { Authorization: req.headers.authorization }
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).json({ message: err.response.data.message });
      }
      res.status(500).json({ message: 'Error connecting to books service' });
    }
  });

// Get a book by ISBN
router.get('/:ISBN', async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_SERVICE_URL}${req.originalUrl}`, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to books service' });
  }
});

// Additional route for ISBN
router.get('/isbn/:ISBN', async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_SERVICE_URL}${req.originalUrl}`, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to books service' });
  }
});

module.exports = router;
