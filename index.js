require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define Routes
app.use('/api/url', require('./routes/url'));
app.use('/', require('./routes/index'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
