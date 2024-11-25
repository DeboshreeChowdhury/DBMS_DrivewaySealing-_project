require('dotenv').config();
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP username
    password: '', // Default XAMPP password is empty
    database: 'driveway_sealing', 
    port: 3306, // MySQL port
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if there’s an error
    }
    console.log('Connected to the database.');
});

// Export the database connection
module.exports = connection;

