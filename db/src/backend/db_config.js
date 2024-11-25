const mysql = require('mysql');

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',        // Replace with your database host (e.g., 'localhost')
    user: 'root',             // Replace with your database username
    password: '',             // Replace with your database password
    database: 'driveway_sealing', // Replace with your database name
    port: 3306                // Replace with your MySQL port if different
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if there’s an error
    }
    console.log('Connected to the database.');
});

// Export the database connection
module.exports = db;
