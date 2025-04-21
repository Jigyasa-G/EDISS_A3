// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const relatedController  = require('../controllers/relatedController');

// POST /books
router.post('/', bookController.addBook);

// PUT /books/:ISBN
router.put('/:ISBN', bookController.updateBook);

// GET /books/:ISBN/related-books   
+router.get('/:ISBN/related-books', relatedController.related);

// GET /books/:ISBN and /books/isbn/:ISBN
router.get(['/:ISBN', '/isbn/:ISBN'], bookController.getBook);

module.exports = router;
