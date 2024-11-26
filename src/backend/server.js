const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Base route for health check
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// API routes
app.use('/api', routes);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not specified
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
