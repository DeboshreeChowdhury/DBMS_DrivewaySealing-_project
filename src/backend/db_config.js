require('dotenv').config();
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', // Default XAMPP username
    password: process.env.DB_PASSWORD || '', // Default XAMPP password is empty
    database: process.env.DB_DATABASE || 'driveway_sealing',
    port: process.env.DB_PORT || 3306, // MySQL default port
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit the process on connection error
    }
    console.log('Connected to the database.');
});

// Export the database connection
module.exports = connection;
