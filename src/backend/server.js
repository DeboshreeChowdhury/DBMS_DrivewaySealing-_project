const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Base route for health check
app.get('/', (req, res) => {
    res.status(200).send('Server is running...');
});

// API routes
app.use('/api', routes);

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
