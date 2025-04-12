const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const setupSocket = require('./socketHandler');

// Set up database connection
mongoose.connect('mongodb://localhost:27017/chess', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

// Initialize socket.io handler
setupSocket(io);

// Start server
const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
