const express = require('express');
const {Kafka} = require('kafkajs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const TOPIC = process.env.TOPIC;
const ANDREW_ID = process.env.ANDREW_ID;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;

// app.use(express.json());

// // Status endpoint for health checks
// app.get('/status', (req, res) => {
//   res.status(200).send('OK');
// });

// // Asynchronous endpoint to process customer data
// app.post('/process', (req, res) => {
//   // Acknowledge receipt immediately
//   res.status(202).json({ message: 'Customer data received for processing' });
  
//   // Process asynchronously
//   setTimeout(() => {
//     console.log('Processed customer data:', req.body);
//     // In a real implementation, you might:
//     // 1. Send an email
//     // 2. Update a database
//     // 3. Trigger other workflows
//   }, 5000);
// });

// app.listen(PORT, () => {
//   console.log(`CRM Service running on port ${PORT}`);
// });

const kafka = new Kafka({ 
    clientId: 'crm-service',
    brokers: process.env.KAFKA_BOOTSTRAP.split(",") 
});
const consumer = kafka.consumer({ groupId: `${ANDREW_ID}-crm-group` });

const mailer = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  secure: false, 
  tls: { rejectUnauthorized: false }
});

//Send Email
(async () => {
    console.log("Connecting to Kafka brokers...");
  await consumer.connect();
  
  console.log("Connected to Kafka brokers");

  const topic = TOPIC;

  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });
  console.log(`Subscribed to topic "${topic}"`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      const cust = JSON.parse(message.value.toString());
      try{
        await mailer.sendMail({
            from: SMTP_USER,
            to: cust.userId,
            subject: 'Activate your book store account',
            text: `Dear ${cust.name},\nWelcome to the Book store created by ${ANDREW_ID}.\nExceptionally this time we won’t ask you to click a link to activate your account.`
        });
        console.log(`Email sent to ${cust.userId}`);
        } catch (error) {
            console.error(`Failed to send email to ${cust.userId}:`, error);
        }
    }
  });
})();

// Add graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    try {
      await consumer.disconnect();
      console.log('Kafka consumer disconnected');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  });


// // Start Express server
// app.listen(PORT, () => {
//     console.log(`CRM Service running on port ${PORT}`);
//   });