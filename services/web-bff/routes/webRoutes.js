// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// // The base URL for your backend services (internal ALB)
// const BACKEND_BASE_URL = process.env.URL_BASE_BACKEND_SERVICES || 'http://localhost:3000';

// //  For /books
// router.all('/books*', async (req, res) => {
//   try {
//     // e.g. if request is GET /books/123 => target /books/123
//     const targetURL = `${BACKEND_BASE_URL}${req.originalUrl}`;
//     const backendRes = await axios({
//       method: req.method,
//       url: targetURL,
//       data: req.body,
//       headers: { 'Content-Type': 'application/json' }
//     });
//     return res.status(backendRes.status).json(backendRes.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     return res.status(500).json({ message: 'Proxy error' });
//   }
// });

// // For /customers
// router.all('/customers*', async (req, res) => {
//   try {
//     const targetURL = `${BACKEND_BASE_URL}${req.originalUrl}`;
//     const backendRes = await axios({
//       method: req.method,
//       url: targetURL,
//       data: req.body,
//       headers: { 'Content-Type': 'application/json' }
//     });
//     return res.status(backendRes.status).json(backendRes.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     return res.status(500).json({ message: 'Proxy error' });
//   }
// });

// module.exports = router;
