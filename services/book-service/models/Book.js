const db = require('../config/connection');

// Validate book data
exports.validateBook = (book) => {
  // Check that all required fields exist and are not empty
  const requiredFields = ['ISBN', 'title', 'Author', 'description', 'genre', 'price', 'quantity'];
  for (const field of requiredFields) {
    if (book[field] === undefined || book[field] === null || book[field] === '') {
      return false;
    }
  }
  
  // Validate that price is a number and has exactly 2 decimal places
  if (isNaN(parseFloat(book.price))) {
    return false;
  }
  const priceStr = book.price.toString();
  const parts = priceStr.split('.');
  if (parts.length !== 2 || parts[1].length !== 2) {
    return false;
  }
  
  // Validate that quantity is a number
  if (isNaN(parseInt(book.quantity))) {
    return false;
  }
  
  return true;
};

// Add a book
exports.addBook = (book) => {
  return new Promise((resolve, reject) => {
    // Validate input using our helper function
    if (!exports.validateBook(book)) {
      return reject({
        code: 'INVALID_INPUT',
        message: 'Illegal, missing, or malformed input. Price must be a valid number with exactly 2 decimal places and all fields are mandatory.'
      });
    }
    
    const sqlCheck = 'SELECT * FROM Books WHERE ISBN = ?';
    db.query(sqlCheck, [book.ISBN], (err, results) => {
      if (err) return reject(err);
      
      // If the ISBN already exists, reject with a special error code
      if (results.length > 0) {
        return reject({
          code: 'DUPLICATE_ISBN',
          message: 'This ISBN already exists in the system.'
        });
      }
      
      // Insert new book using explicit column names for clarity
      const sqlInsert = 'INSERT INTO Books (ISBN, title, Author, description, genre, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(sqlInsert, [book.ISBN, book.title, book.Author, book.description, book.genre, book.price, book.quantity], (err2) => {
        if (err2) return reject(err2);
        
        // Convert price and quantity to correct types
        book.price = parseFloat(book.price);
        book.quantity = parseInt(book.quantity);
        
        return resolve(book);
      });
    });
  });
};

// Update a book
exports.updateBook = (ISBN, book) => {
  return new Promise((resolve, reject) => {
    // Validate input; also ensure that the ISBN in the payload matches the URL parameter
    if (!exports.validateBook(book) || book.ISBN !== ISBN) {
      return reject({
        code: 'INVALID_INPUT',
        message: 'Invalid book data'
      });
    }
    
    const sqlCheck = 'SELECT * FROM Books WHERE ISBN = ?';
    db.query(sqlCheck, [ISBN], (err, results) => {
      if (err) return reject(err);
      
      if (results.length === 0) {
        // Book not found, return null to let the controller respond with 404
        return resolve(null);
      }
      
      // Update the book using explicit columns
      const sqlUpdate = 'UPDATE Books SET title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?';
      db.query(sqlUpdate, [book.title, book.Author, book.description, book.genre, book.price, book.quantity, ISBN], (err2) => {
        if (err2) return reject(err2);
        return resolve(book);
      });
    });
  });
};

//Get book by ISBN
exports.getBook = (ISBN) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Books WHERE ISBN = ?';
    db.query(sql, [ISBN], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        return resolve(null);
      }
      
      const book = results[0];
      book.price = parseFloat(book.price);
      book.quantity = parseInt(book.quantity);
      return resolve(book);
    });
  });
};
