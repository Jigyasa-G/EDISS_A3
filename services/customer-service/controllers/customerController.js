const customerModel = require('../models/Customer');
const { producer } = require('../config/kafka');

// Helper: Validate customer input
function validateCustomer(customer) {
  const { userId, name, phone, address, city, state, zipcode } = customer;
  // Check that all required fields exist and are not empty
  const requiredFields = [userId, name, phone, address, city, state, zipcode];
  if (requiredFields.some(field => field === undefined || field === null || field === '')) {
    return false;
  }
  // Validate email format for userId
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userId)) {
    return false;
  }
  // Validate state is exactly 2 letters
  if (!/^[A-Z]{2}$/i.test(state)) {
    return false;
  }
  return true;
}

// Add a new customer
exports.addCustomer = async (req, res) => {
  const newCustomer = req.body;
  
  // Validate input using helper
  if (!validateCustomer(newCustomer)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  
  try {
    const savedCustomer = await customerModel.addCustomer(newCustomer);
    try{
      await producer.connect();
     // Publish event to Kafka
     await producer.send({
      topic: process.env.TOPIC,                         // <andrewID>.customer.evt
      messages: [{ value: JSON.stringify(savedCustomer) }]
    });
    console.log('Customer added and event published to Kafka:', savedCustomer);
    } catch (error) {
      console.error('Error publishing to Kafka:', error);
    }
    // On success, set the Location header with full URL
    res.setHeader(
      'Location',
      `${req.protocol}://${req.get('host')}/customers/${savedCustomer.id}`
    );
    return res.status(201).json(savedCustomer);
  } catch (error) {
    // If duplicate userId error, return 422
    if (error.code === 'DUPLICATE_USERID') {
      return res.status(422).json({ message: error.message });
    }
    console.error('Error in addCustomer controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  // Simplified validation: ensure id is numeric
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  
  try {
    const customer = await customerModel.getCustomerById(parseInt(id, 10));
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Convert ID to number for consistency
    customer.id = parseInt(customer.id, 10);
    return res.status(200).json(customer);
  } catch (error) {
    console.error('Error in getCustomerById controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a customer by userId 
exports.getCustomerByUserId = async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userId)) {
    return res.status(400).json({ message: 'Illegal, missing, or malformed input' });
  }
  
  try {
    const customer = await customerModel.getCustomerByUserId(userId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    customer.id = parseInt(customer.id, 10);
    return res.status(200).json(customer);
  } catch (error) {
    console.error('Error in getCustomerByUserId controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
