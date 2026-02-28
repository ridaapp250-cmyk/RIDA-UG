// models/Admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');  // Assuming the User model is in the same directory

// Admin Schema (you can modify it to your specific needs)
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: 'admin', // Ensure this is always 'admin' for this model
    },
    isVerified: {
        type: Boolean,
        default: true, // Admins should be automatically verified
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



// Hash the password before saving the admin
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password for login
AdminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Create Admin model from the schema
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
