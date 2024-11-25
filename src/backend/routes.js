const express = require('express');
const router = express.Router();
const Model = require('./model');

// Middleware for parsing JSON
router.use(express.json());

// --- Client Routes ---

// Get all clients
router.get('/clients', (req, res) => {
    Model.getAllClients((err, results) => {
        if (err) {
            console.error('Error fetching clients:', err.message);
            return res.status(500).json({ error: 'Failed to fetch clients.' });
        }
        res.status(200).json(results);
    });
});

// Add a new client
router.post('/clients', (req, res) => {
    const clientData = req.body;
    Model.addClient(clientData, (err, results) => {
        if (err) {
            console.error('Error adding client:', err.message);
            return res.status(500).json({ error: 'Failed to add client.' });
        }
        res.status(201).json({ message: 'Client added successfully.', clientId: results.insertId });
    });
});

// --- Quote Routes ---

// Get quotes for a specific client
router.get('/quotes/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    Model.getQuotesByClientId(clientId, (err, results) => {
        if (err) {
            console.error(`Error fetching quotes for client ID ${clientId}:`, err.message);
            return res.status(500).json({ error: 'Failed to fetch quotes.' });
        }
        res.status(200).json(results);
    });
});

// Add a new quote
router.post('/quotes', (req, res) => {
    const quoteData = req.body;
    Model.addQuote(quoteData, (err, results) => {
        if (err) {
            console.error('Error adding quote:', err.message);
            return res.status(500).json({ error: 'Failed to add quote.' });
        }
        res.status(201).json({ message: 'Quote added successfully.', quoteId: results.insertId });
    });
});

// Update quote status
router.put('/quotes/:quoteId/status', (req, res) => {
    const quoteId = req.params.quoteId;
    const { status } = req.body;
    Model.updateQuoteStatus(quoteId, status, (err, results) => {
        if (err) {
            console.error(`Error updating status for quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to update quote status.' });
        }
        res.status(200).json({ message: 'Quote status updated successfully.' });
    });
});

// --- Order Routes ---

// Get all orders
router.get('/orders', (req, res) => {
    Model.getAllOrders((err, results) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).json({ error: 'Failed to fetch orders.' });
        }
        res.status(200).json(results);
    });
});

// Add a new order
router.post('/orders', (req, res) => {
    const orderData = req.body;
    Model.addOrder(orderData, (err, results) => {
        if (err) {
            console.error('Error adding order:', err.message);
            return res.status(500).json({ error: 'Failed to add order.' });
        }
        res.status(201).json({ message: 'Order added successfully.', orderId: results.insertId });
    });
});

// --- Bill Routes ---

// Get all bills
router.get('/bills', (req, res) => {
    Model.getAllBills((err, results) => {
        if (err) {
            console.error('Error fetching bills:', err.message);
            return res.status(500).json({ error: 'Failed to fetch bills.' });
        }
        res.status(200).json(results);
    });
});

// Add a new bill
router.post('/bills', (req, res) => {
    const billData = req.body;
    Model.addBill(billData, (err, results) => {
        if (err) {
            console.error('Error adding bill:', err.message);
            return res.status(500).json({ error: 'Failed to add bill.' });
        }
        res.status(201).json({ message: 'Bill added successfully.', billId: results.insertId });
    });
});

// Update bill status
router.put('/bills/:billId/status', (req, res) => {
    const billId = req.params.billId;
    const { status } = req.body;
    Model.updateBillStatus(billId, status, (err, results) => {
        if (err) {
            console.error(`Error updating status for bill ID ${billId}:`, err.message);
            return res.status(500).json({ error: 'Failed to update bill status.' });
        }
        res.status(200).json({ message: 'Bill status updated successfully.' });
    });
});

// --- Report Routes ---

// Run a custom report query
router.post('/reports', (req, res) => {
    const { query, params } = req.body;
    Model.runCustomQuery(query, params, (err, results) => {
        if (err) {
            console.error('Error executing custom report query:', err.message);
            return res.status(500).json({ error: 'Failed to execute custom report query.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
