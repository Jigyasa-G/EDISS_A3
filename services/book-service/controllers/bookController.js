const bookModel = require('../models/Book');

// Validate book input
function validateBook(book) {
  const { ISBN, title, Author, description, genre, price, quantity } = book;
  // Check for required fields
  if (!ISBN || !title || !Author || !description || !genre || price === undefined || quantity === undefined) {
    return false;
  }
  // Validate price: must be a number with exactly 2 decimal places
  if (isNaN(parseFloat(price))) {
    return false;
  }
  const priceStr = price.toString();
  const parts = priceStr.split('.');
  if (parts.length !== 2 || parts[1].length !== 2) {
    return false;
  }
  // Quantity must be a number
  if (isNaN(parseInt(quantity))) {
    return false;
  }
  return true;
}

// Add a new book
exports.addBook = async (req, res) => {
  const book = req.body;
  
  // Validate input
  if (!validateBook(book)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  
  try {
    const result = await bookModel.addBook(book);
    // On success, set the Location header with full URL
    res.setHeader(
      'Location',
      `${req.protocol}://${req.get('host')}/books/${book.ISBN}`
    );
    return res.status(201).json(result);
  } catch (error) {
    // If duplicate ISBN, respond with 422
    if (error.code === 'DUPLICATE_ISBN') {
      return res.status(422).json({ message: error.message });
    }
    console.error('Error in addBook controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing book
exports.updateBook = async (req, res) => {
  const ISBN = req.params.ISBN;
  const book = req.body;
  
  // Validate input and ensure the ISBN in the body matches the URL parameter
  if (!validateBook(book) || book.ISBN !== ISBN) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  
  try {
    const updatedBook = await bookModel.updateBook(ISBN, book);
    if (!updatedBook) {
      return res.status(404).json({ message: 'ISBN not found' });
    }
    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error in updateBook controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a book by ISBN
exports.getBook = async (req, res) => {
  const ISBN = req.params.ISBN;
  
  try {
    const book = await bookModel.getBook(ISBN);
    if (!book) {
      return res.status(404).json({ message: 'ISBN not found' });
    }
    // Convert price and quantity to proper number types
    book.price = parseFloat(book.price);
    book.quantity = parseInt(book.quantity);
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error in getBook controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
