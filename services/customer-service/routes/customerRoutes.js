// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// POST /customers
router.post('/', customerController.addCustomer);

// GET /customers/:id
router.get('/:id', customerController.getCustomerById);

// GET /customers?userId=...
router.get('/', customerController.getCustomerByUserId);

module.exports = router;
