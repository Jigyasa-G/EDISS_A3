const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Validating book input
function validateBook(book) {
  const { ISBN, title, Author, description, genre, price, quantity } = book;
  if (!ISBN || !title || !Author || !description || !genre || price === undefined || quantity === undefined) {
    return false;
  }
  // Validating price - number with 2 decimal places
  if (!/^\d+(\.\d{0,2})?$/.test(price.toString())) {
    return false;
  }
  return true;
}

// Add Book endpoint: POST /books
router.post('/', (req, res) => {
  const book = req.body;

  if (!validateBook(book)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }

  const sqlCheck = 'SELECT * FROM Books WHERE ISBN = ?';
  db.query(sqlCheck, [book.ISBN], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(422).json({ message: 'This ISBN already exists in the system.' });
    }
    const sqlInsert = 'INSERT INTO Books SET ?';
    db.query(sqlInsert, book, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.setHeader('Location', `/books/${book.ISBN}`);
      return res.status(201).json(book);
    });
  });
});

// Update Book endpoint: PUT /books/:ISBN
router.put('/:ISBN', (req, res) => {
  const ISBN = req.params.ISBN;
  const book = req.body;

  if (!validateBook(book) || book.ISBN !== ISBN) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }

  const sqlCheck = 'SELECT * FROM Books WHERE ISBN = ?';
  db.query(sqlCheck, [ISBN], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'ISBN not found' });
    }
    const sqlUpdate = 'UPDATE Books SET ? WHERE ISBN = ?';
    db.query(sqlUpdate, [book, ISBN], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      return res.status(200).json(book);
    });
  });
});

// Retrieve Book endpoint: GET /books/:ISBN and /books/isbn/:ISBN
router.get(['/:ISBN', '/isbn/:ISBN'], (req, res) => {
  const ISBN = req.params.ISBN;
  const sql = 'SELECT * FROM Books WHERE ISBN = ?';
  db.query(sql, [ISBN], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'ISBN not found' });
    }
    // return res.status(200).json(results[0]);
    const book = results[0];
    book.price = parseFloat(book.price);
    book.quantity = parseInt(book.quantity);
    return res.status(200).json(book);
  });
});

module.exports = router;
