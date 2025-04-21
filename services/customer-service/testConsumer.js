// testConsumer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');

const brokers = process.env.KAFKA_BOOTSTRAP.split(',');
const topic   = process.env.TOPIC;
const groupId = 'test-consumer-group-' + Math.floor(Math.random()*1000);

// Create the client
const kafka = new Kafka({
  clientId: 'kafka-smoke-test',
  brokers
});

const consumer = kafka.consumer({ groupId });

async function run() {
  console.log(`Connecting to Kafka brokers [${brokers}]…`);
  await consumer.connect();

  console.log(`Subscribing to topic "${topic}" (from beginning)…`);
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log(`Listening for messages on "${topic}"…\n`);
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `Topic=${topic} | Partition=${partition}`;
      const key    = message.key   ? message.key.toString()   : '<no key>';
      const value  = message.value ? message.value.toString() : '<no value>';
      console.log(`${prefix} | Key=${key} | Value=${value}`);
    },
  });
}

run().catch(e => {
  console.error('⚠️  Consumer failed:', e);
  process.exit(1);
});
