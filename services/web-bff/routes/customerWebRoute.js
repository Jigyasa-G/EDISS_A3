const express = require('express');
const router = express.Router();
const axios = require('axios');

const CUSTOMERS_SERVICE_URL = process.env.URL_BASE_BACKEND_SERVICES_CUSTOMER;

// Add a new customer
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${CUSTOMERS_SERVICE_URL}${req.originalUrl}`, req.body, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to customers service' });
  }
});

// Get a customer by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${CUSTOMERS_SERVICE_URL}${req.originalUrl}`, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to customers service' });
  }
});

// Get a customer by user ID
router.get('/', async (req, res) => {
  if (!req.query.userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const response = await axios.get(`${CUSTOMERS_SERVICE_URL}${req.originalUrl}`, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    res.status(500).json({ message: 'Error connecting to customers service' });
  }
});

module.exports = router;
