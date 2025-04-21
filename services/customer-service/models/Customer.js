// models/Customer.js
const db = require('../config/connection');

exports.addCustomer = (customerData) => {
  return new Promise((resolve, reject) => {
    const sqlCheck = 'SELECT * FROM Customers WHERE userId = ?';
    db.query(sqlCheck, [customerData.userId], (err, results) => {
      if (err) return reject(err);

      if (results.length > 0) {
        // Duplicate userId
        return reject({
          code: 'DUPLICATE_USERID',
          message: 'This user ID already exists in the system.'
        });
      }

      const sqlInsert = 'INSERT INTO Customers SET ?';
      db.query(sqlInsert, customerData, (err2, result) => {
        if (err2) return reject(err2);

        // Return the newly created record, including the auto-generated ID
        const newCustomer = { id: result.insertId, ...customerData };
        return resolve(newCustomer);
      });
    });
  });
};

exports.getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Customers WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        return resolve(null);
      }
      return resolve(results[0]);
    });
  });
};

exports.getCustomerByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Customers WHERE userId = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        return resolve(null);
      }
      return resolve(results[0]);
    });
  });
};
