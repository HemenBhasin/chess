const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const setupSocket = require('./socketHandler');
const auth = require('./controllers/auth');

// Environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || 30;

// Set up database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Set up static files with logging
app.use(express.static('public', {
  setHeaders: (res, path) => {
    console.log('Serving static file:', path);
  }
}));

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Auth routes
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login);

// Initialize socket.io handler
setupSocket(io);

// Start server
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
