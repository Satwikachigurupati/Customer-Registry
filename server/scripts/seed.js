const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Message = require('../models/Message');
const CustomField = require('../models/CustomField');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/customer-care');
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await Message.deleteMany();
    await CustomField.deleteMany();
    console.log('Database cleared.');

    // 1. Create Custom Fields
    console.log('Seeding custom fields...');
    const field1 = await CustomField.create({
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      target: 'customer',
      required: false,
    });

    const field2 = await CustomField.create({
      name: 'preferredLanguage',
      label: 'Preferred Language',
      type: 'text',
      target: 'customer',
      required: false,
    });

    const field3 = await CustomField.create({
      name: 'orderId',
      label: 'Order ID (if retail)',
      type: 'text',
      target: 'complaint',
      required: false,
    });

    const field4 = await CustomField.create({
      name: 'urgencyLevel',
      label: 'Urgency Level (Low/Med/High)',
      type: 'text',
      target: 'complaint',
      required: false,
    });

    // 2. Create Users (passwords will be hashed by pre-save hooks)
    console.log('Seeding users...');
    const admin = await User.create({
      name: 'Abdul Ajeem Mohammad',
      email: 'admin@customercare.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin',
    });

    const agent1 = await User.create({
      name: 'Harshitha Dasi',
      email: 'agent1@customercare.com',
      phone: '9876543211',
      password: 'agent123',
      role: 'agent',
    });

    const agent2 = await User.create({
      name: 'Chodisetty Pavani Naga Divya',
      email: 'agent2@customercare.com',
      phone: '9876543212',
      password: 'agent123',
      role: 'agent',
    });

    const customer = await User.create({
      name: 'Vamsi Krishna Marre',
      email: 'customer@customercare.com',
      phone: '9876543213',
      password: 'customer123',
      role: 'customer',
      customProfileFields: {
        companyName: 'BTech Projects Ltd',
        preferredLanguage: 'English',
      },
    });

    console.log('Users seeded successfully:');
    console.log(`- Admin: admin@customercare.com (pw: admin123)`);
    console.log(`- Agent 1: agent1@customercare.com (pw: agent123)`);
    console.log(`- Agent 2: agent2@customercare.com (pw: agent123)`);
    console.log(`- Customer: customer@customercare.com (pw: customer123)`);

    // 3. Create Sample Complaints
    console.log('Seeding complaints...');
    const complaint1 = await Complaint.create({
      title: 'Payment checkout failed repeatedly',
      description: 'Whenever I try to checkout using my credit card, it redirects to a 404 page and debit is not shown. Please help.',
      type: 'complaint',
      status: 'open',
      customer: customer._id,
      customFields: {
        orderId: 'ORD-8821A',
        urgencyLevel: 'High',
      },
    });

    const complaint2 = await Complaint.create({
      title: 'Request for custom integration details',
      description: 'I would like to inquire if your system supports custom webhooks or APIs for retrieving registry summaries daily.',
      type: 'inquiry',
      status: 'assigned',
      customer: customer._id,
      agent: agent1._id,
      customFields: {
        urgencyLevel: 'Med',
      },
    });

    const complaint3 = await Complaint.create({
      title: 'Excellent response speed on ticket COMP-1002',
      description: 'The support staff resolved my previous ticket in under an hour. Keep it up!',
      type: 'feedback',
      status: 'resolved',
      customer: customer._id,
      agent: agent2._id,
      customFields: {
        urgencyLevel: 'Low',
      },
    });

    // 4. Create Messages
    console.log('Seeding conversation logs...');
    await Message.create({
      complaint: complaint2._id,
      sender: customer._id,
      content: 'Here is the inquiry about APIs. Let me know what data fields are exported.',
    });

    await Message.create({
      complaint: complaint2._id,
      sender: agent1._id,
      content: 'Hello Vamsi, yes! We support REST APIs that export JSON payloads for ticket statistics and list records. I can provide the documentation links shortly.',
    });

    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();
