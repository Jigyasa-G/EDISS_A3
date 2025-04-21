// config/kafka.js
require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'customer-service',
  brokers: process.env.KAFKA_BOOTSTRAP.split(',')   // comma‑sep list
});

const producer = kafka.producer();

async function connect() {
  try{
    if (!producer.isConnected()) {
        await producer.connect();
        console.log('Kafka producer connected');
    }
} catch (error) {
    console.error('Failed to connect Kafka producer:', error);
    console.log('Continuing despite Kafka connection issue'); // Rethrow the error to be handled by the caller
  }
}
process.on('SIGTERM', async () => {
  try {
    await producer.disconnect();
    console.log('Kafka producer disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error disconnecting Kafka producer:', error);
    process.exit(1);
  }
});

// module.exports = { producer, connect };

module.exports = {
    producer,
    connect, 
    sendCustomerEvent: async (customer) => {
        try {
          const topic = process.env.TOPIC || `jigyasag.customer.evt`;
          await producer.send({
            topic,
            messages: [
              { value: JSON.stringify(customer) }
            ]
          });
          console.log(`Message sent to topic`);
          return true;
        } catch (error) {
          console.error('Error sending message to Kafka:');
          return false;
        }
      }
 };