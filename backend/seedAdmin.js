require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ userType: 'admin' });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = new User({
    name: 'Super Admin',
    email: 'admin@ridaapp.com',
    password: hashedPassword,
    phone: '0000000000',
    userType: 'admin',
    isVerified: true,
  });

  await admin.save();
  console.log('First admin created successfully');
  process.exit();
};

createAdmin();
