const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in query results
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true
    },
    userType: {
        type: String,
        enum: ['customer', 'driver', 'admin'],
        default: 'customer' // Default user type is 'customer'
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});

// Password hashing pre-save hook (for new users or password changes)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // Only hash if the password is modified or new

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();  // Proceed with saving the user
});

// Method to compare hashed password during login
UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);  // Compare hashed password
};

// Export the model
module.exports = mongoose.model('User', UserSchema);
