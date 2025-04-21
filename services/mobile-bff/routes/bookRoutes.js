// mobile-bff/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// The base URL for your Book Service (internal ALB).
// Use an environment variable, or default to localhost for local dev.
const BOOKS_SERVICE_URL = process.env.URL_BASE_BACKEND_SERVICES_BOOK;

/**
 * 1) Add a new book
 *    POST /books
 */
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${BOOKS_SERVICE_URL}/books`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to books service' });
  }
});

/**
 * 2) Update a book
 *    PUT /books/:ISBN
 */
router.put('/:ISBN', async (req, res) => {
  try {
    const response = await axios.put(`${BOOKS_SERVICE_URL}/books/${req.params.ISBN}`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to books service' });
  }
});

/**
+ *    Related books
+ *  GET /books/:ISBN/related-books
+ */
router.get('/:ISBN/related-books', async (req, res) => {
  try {
    const url = `${BOOKS_SERVICE_URL}/books/${req.params.ISBN}/related-books`;
    const response = await axios.get(url, {
      headers: { Authorization: req.headers.authorization }
    });

    // If the book objects themselves contain “non‑fiction”, transform there
    const list = response.data || [];
    list.forEach(b => {
      if (typeof b.genre === 'string' && b.genre.toLowerCase() === 'non-fiction') {
        b.genre = 3;
      }
    });

    return res.status(response.status).json(list);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({ message: err.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to books service' });
  }
});

/**
 * 3) Get a book by ISBN (generic route: /books/:ISBN)
 *    - For Mobile BFF, transform "non-fiction" => "3" in the response.
 */
router.get('/:ISBN', async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_SERVICE_URL}/books/${req.params.ISBN}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    // The reference code modifies "genre" or "description" for "non-fiction."
    // For example, if the Book Service returns { genre: "non-fiction" }, we transform it to 3.
    // Or if you prefer to modify the "description," do so here.
    const book = response.data;
    if (typeof book.genre === 'string' && book.genre.toLowerCase() === 'non-fiction') {
      book.genre = 3;
    }
    // Or if you store "non-fiction" in description, do:
    // if (book.description && typeof book.description === 'string') {
    //   book.description = book.description.replace(/non-fiction/gi, '3');
    // }
    return res.status(response.status).json(book);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to books service' });
  }
});

/**
 * 4) Additional route for ISBN
 *    GET /books/isbn/:ISBN
 *    - Similar to above, just a different path.
 */
router.get('/isbn/:ISBN', async (req, res) => {
  try {
    // Notice we call the same backend endpoint, just a different route on the BFF side.
    const response = await axios.get(`${BOOKS_SERVICE_URL}/books/${req.params.ISBN}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    const book = response.data;
    // Transform "non-fiction" => 3
    if (typeof book.genre === 'string' && book.genre.toLowerCase() === 'non-fiction') {
      book.genre = 3;
    }
    return res.status(response.status).json(book);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    return res.status(500).json({ message: 'Error connecting to books service' });
  }
});

module.exports = router;
