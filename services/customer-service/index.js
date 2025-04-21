require('dotenv').config();
const express = require('express');
const { connect } = require('./config/kafka');
// { connect: connectKafka }
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount /customers routes
app.use('/customers', customerRoutes);

// Health check
app.get('/status', (req, res) => {
  res.status(200).send('OK');
});

// Catch-all for unrecognized routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// app.listen(PORT, () => {
//   console.log(`Customer Service running on port ${PORT}`);
// });

// ───────────────────────────────────────────────────────────────────────────
// Start the service only after the Kafka producer is connected
// ───────────────────────────────────────────────────────────────────────────
(async () => {
  try {
    // Connect to Kafka
    await connect();  
    app.listen(PORT, () =>
      console.log(`Customer Service running on port ${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start Customer Service:', err);
    process.exit(1);
  }
})();
