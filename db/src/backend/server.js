const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP username
    password: '', // Default XAMPP password (blank by default)
    database: 'driveway_sealing'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes
// 1. Client Registration
app.post('/register', (req, res) => {
    const { first_name, last_name, address, credit_card_info, phone_number, email } = req.body;
    const sql = `INSERT INTO Clients (first_name, last_name, address, credit_card_info, phone_number, email)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [first_name, last_name, address, credit_card_info, phone_number, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error registering client.');
        }
        res.status(201).send({ message: 'Client registered successfully!', clientId: result.insertId });
    });
});

// 2. Submit Quote
app.post('/submit-quote', (req, res) => {
    const { client_id, property_address, square_feet, proposed_price, note } = req.body;
    const sql = `INSERT INTO Quotes (client_id, property_address, square_feet, proposed_price, status, note)
                 VALUES (?, ?, ?, ?, 'pending', ?)`;
    db.query(sql, [client_id, property_address, square_feet, proposed_price, note], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error submitting quote.');
        }
        res.status(201).send({ message: 'Quote submitted successfully!', quoteId: result.insertId });
    });
});

// 3. Get All Quotes
app.get('/quotes', (req, res) => {
    const sql = `SELECT * FROM Quotes`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching quotes.');
        }
        res.status(200).send(results);
    });
});

// 4. Get All Clients
app.get('/clients', (req, res) => {
    const sql = `SELECT * FROM Clients`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching clients.');
        }
        res.status(200).send(results);
    });
});

// 5. Update Quote Status (e.g., Approve/Reject)
app.put('/update-quote/:id', (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const sql = `UPDATE Quotes SET status = ?, note = ? WHERE quote_id = ?`;
    db.query(sql, [status, note, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating quote.');
        }
        res.status(200).send({ message: 'Quote updated successfully!' });
    });
});

// Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
