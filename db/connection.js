const mysql = require('mysql2');

const connection = mysql.createConnection({
    // local MySQL host; TB replaced with RDS endpoint, username, pw
  
  host: process.env.DB_HOST || '127.0.0.1',      
  user: process.env.DB_USER || 'root',  
  password: process.env.DB_PASSWORD || 'edispass', 
  database: process.env.DB_NAME || 'bookstore'   
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL(Book Service):', err);
    process.exit(1);
  }
  console.log('Connected to MySQL(Book Service)');
});

module.exports = connection;
