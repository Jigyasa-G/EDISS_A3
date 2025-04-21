// mobile-bff/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const CUSTOMERS_SERVICE_URL = process.env.URL_BASE_BACKEND_SERVICES_CUSTOMER;

/**
 * 1) Add a new customer
 *    POST /customers
 */
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${CUSTOMERS_SERVICE_URL}/customers`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    // Return the backend's response
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to customers service' });
  }
});

/**
 * 2) Get a customer by ID
 *    GET /customers/:id
 *    - For Mobile BFF, remove address fields from the response.
 */
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${CUSTOMERS_SERVICE_URL}/customers/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    // Remove address fields for mobile clients
    const customer = removeAddressFields(response.data);
    return res.status(response.status).json(customer);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to customers service' });
  }
});

/**
 * 3) Get a customer by userId
 *    GET /customers?userId=...
 *    - Also remove address fields.
 */
router.get('/', async (req, res) => {
  if (!req.query.userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const response = await axios.get(`${CUSTOMERS_SERVICE_URL}/customers?userId=${req.query.userId}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    // Remove address fields for mobile
    const customer = removeAddressFields(response.data);
    return res.status(response.status).json(customer);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to customers service' });
  }
});

/**
 * Helper: remove address fields for mobile clients
 */
function removeAddressFields(original) {
  if (!original || typeof original !== 'object') {
    return original;
  }
  const { address, address2, city, state, zipcode, ...rest } = original;
  return rest;
}

module.exports = router;
