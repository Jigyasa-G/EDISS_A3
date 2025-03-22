const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Validating customer input
function validateCustomer(customer) {
  const { userId, name, phone, address, city, state, zipcode } = customer;
  if (!userId || !name || !phone || !address || !city || !state || !zipcode) {
    return false;
  }
  // Validating email for userId + state length (2 letters)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) {
    return false;
  }
  if (!/^[A-Z]{2}$/i.test(state)) {
    return false;
  }
  return true;
}

// Add Customer endpoint: POST /customers
router.post('/', (req, res) => {
  const customer = req.body;
  if (!validateCustomer(customer)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  const sqlCheck = 'SELECT * FROM Customers WHERE userId = ?';
  db.query(sqlCheck, [customer.userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(422).json({ message: 'This user ID already exists in the system.' });
    }
    const sqlInsert = 'INSERT INTO Customers SET ?';
    db.query(sqlInsert, customer, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      const newCustomer = { id: result.insertId, ...customer };
      res.setHeader('Location', `/customers/${result.insertId}`);
      return res.status(201).json(newCustomer);
    });
  });
});

// Retrieve Customer by ID endpoint: GET /customers/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  const sql = 'SELECT * FROM Customers WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    //return res.status(200).json(results[0]);
    const customer = results[0];
    customer.id = parseInt(customer.id);
    return res.status(200).json(customer);
  });
});

// Retrieve Customer by user ID endpoint: GET /customers with query parameter
router.get('/', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  const sql = 'SELECT * FROM Customers WHERE userId = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const customer = results[0];
    customer.id = parseInt(customer.id);
    return res.status(200).json(customer);
  });
});

module.exports = router;
