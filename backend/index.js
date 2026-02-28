require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const auth = require('./middleware/auth'); 

console.log('🔍 Starting backend service...');

// Import routes
const authRoutes = require('./routes/auth.js');
const bookingRoutes = require('./routes/bookings.js');
const driverRoutes = require('./routes/drivers.js');
const reviewsRoutes = require('./routes/reviews.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

// Connect to Database
connectDB();

// CORS - Allow your frontend to connect
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [ 'https://rida1.up.railway.app',
        
        'https://www.ridaapp.com',
        'https://ridaapp.com',
       
      ]
    : [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Created uploads directory');
}

if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
  console.log('Created profiles directory');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Driver Booking Platform API running' });
});
app.get('/admin/register', (req, res) => {
  res.send(
    '<!DOCTYPE html>' +
    '<html lang="en"><head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>Admin Registration</title>' +
    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">' +
    '<style>' +
    'body { background: #f8f9fa; }' +
    '.card { max-width: 480px; margin: 60px auto; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }' +
    '.card-header { background: #4f46e5; color: white; border-radius: 10px 10px 0 0 !important; }' +
    '#message { display: none; }' +
    '</style></head><body>' +
    '<div class="container">' +
    '<div class="card">' +
    '<div class="card-header text-center py-3"><h4 class="mb-0">Admin Registration</h4></div>' +
    '<div class="card-body p-4">' +
    '<div id="message" class="alert" role="alert"></div>' +
    '<form id="admin-register-form">' +
    '<div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="name" placeholder="Enter full name" required></div>' +
    '<div class="form-group"><label>Email</label><input type="email" class="form-control" id="email" placeholder="Enter email" required></div>' +
    '<div class="form-group"><label>Password</label><input type="password" class="form-control" id="password" placeholder="Enter password" required></div>' +
    '<div class="form-group"><label>Phone</label><input type="text" class="form-control" id="phone" placeholder="Enter phone number" required></div>' +
    '<div class="form-group"><label>Admin Secret Key</label><input type="password" class="form-control" id="adminKey" placeholder="Enter admin secret key" required></div>' +
    '<button type="submit" class="btn btn-primary btn-block" id="submitBtn">Register</button>' +
    '</form></div></div></div>' +
    '<script>' +
    'document.getElementById("admin-register-form").addEventListener("submit", async function(event) {' +
    'event.preventDefault();' +
    'const name = document.getElementById("name").value;' +
    'const email = document.getElementById("email").value;' +
    'const password = document.getElementById("password").value;' +
    'const phone = document.getElementById("phone").value;' +
    'const adminKey = document.getElementById("adminKey").value;' +
    'const msg = document.getElementById("message");' +
    'const btn = document.getElementById("submitBtn");' +
    'btn.disabled = true;' +
    'btn.textContent = "Registering...";' +
    'msg.style.display = "none";' +
    'const token = localStorage.getItem("token");' +
    'try {' +
    'const res = await fetch("/api/admin/create-admin", {' +
    'method: "POST",' +
    'headers: Object.assign({ "Content-Type": "application/json" }, token ? { "Authorization": "Bearer " + token } : {}),' +
    'body: JSON.stringify({ name, email, password, phone, adminKey })' +
    '});' +
    'const data = await res.json();' +
    'if (res.ok) {' +
    'msg.className = "alert alert-success";' +
    'msg.textContent = data.msg || "Admin registered successfully!";' +
    'this.reset();' +
    '} else if (data.errors) {' +
    'msg.className = "alert alert-danger";' +
    'msg.textContent = "Error: " + data.errors.map(function(e) { return e.msg; }).join(", ");' +
    '} else {' +
    'msg.className = "alert alert-danger";' +
    'msg.textContent = data.msg || data.message || "Registration failed.";' +
    '}' +
    'msg.style.display = "block";' +
    '} catch(err) {' +
    'msg.className = "alert alert-danger";' +
    'msg.textContent = "Network error: " + err.message;' +
    'msg.style.display = "block";' +
    '} finally {' +
    'btn.disabled = false;' +
    'btn.textContent = "Register";' +
    '}' +
    '});' +
    '<\/script>' +
    '</body></html>'
  );
});
app.use('/api/auth', authRoutes || ((req, res) => res.status(500).json({ error: 'Auth routes failed to load' })));
app.use('/api/bookings', bookingRoutes || ((req, res) => res.status(500).json({ error: 'Booking routes failed to load' })));
app.use('/api/drivers', driverRoutes || ((req, res) => res.status(500).json({ error: 'Driver routes failed to load' })));
app.use('/api/reviews', reviewsRoutes || ((req, res) => res.status(500).json({ error: 'Reviews routes failed to load' })));
app.use('/api/admin', adminRoutes || ((req, res) => res.status(500).json({ error: 'Admin routes failed to load' })));


app.use('/api', (req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});


// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error.message);

  if (req.url.startsWith('/api/')) {
    res.status(error.status || 500).json({
      error: {
        message: error.message,
        status: error.status || 500
      }
    });
  } else {
    res.status(500).send('Something went wrong!');
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
