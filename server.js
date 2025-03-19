require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { startPingService } = require('./services/pingService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ip', require('./routes/ip')); // Ensure this line is present
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notification'));

// Start ping service
startPingService();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));