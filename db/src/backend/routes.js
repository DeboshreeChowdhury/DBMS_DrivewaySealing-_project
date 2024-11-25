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
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch clients.' });
        }
        res.json(results);
    });
});

// Add a new client
router.post('/clients', (req, res) => {
    const clientData = req.body;
    Model.addClient(clientData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add client.' });
        }
        res.json({ message: 'Client added successfully.', clientId: results.insertId });
    });
});

// --- Quote Routes ---

// Get quotes for a specific client
router.get('/quotes/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    Model.getQuotesByClientId(clientId, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch quotes.' });
        }
        res.json(results);
    });
});

// Add a new quote
router.post('/quotes', (req, res) => {
    const quoteData = req.body;
    Model.addQuote(quoteData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add quote.' });
        }
        res.json({ message: 'Quote added successfully.', quoteId: results.insertId });
    });
});

// Update quote status
router.put('/quotes/:quoteId/status', (req, res) => {
    const quoteId = req.params.quoteId;
    const { status } = req.body;
    Model.updateQuoteStatus(quoteId, status, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update quote status.' });
        }
        res.json({ message: 'Quote status updated successfully.' });
    });
});

// --- Order Routes ---

// Get all orders
router.get('/orders', (req, res) => {
    Model.getAllOrders((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch orders.' });
        }
        res.json(results);
    });
});

// Add a new order
router.post('/orders', (req, res) => {
    const orderData = req.body;
    Model.addOrder(orderData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add order.' });
        }
        res.json({ message: 'Order added successfully.', orderId: results.insertId });
    });
});

// --- Bill Routes ---

// Get all bills
router.get('/bills', (req, res) => {
    Model.getAllBills((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch bills.' });
        }
        res.json(results);
    });
});

// Add a new bill
router.post('/bills', (req, res) => {
    const billData = req.body;
    Model.addBill(billData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add bill.' });
        }
        res.json({ message: 'Bill added successfully.', billId: results.insertId });
    });
});

// Update bill status
router.put('/bills/:billId/status', (req, res) => {
    const billId = req.params.billId;
    const { status } = req.body;
    Model.updateBillStatus(billId, status, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update bill status.' });
        }
        res.json({ message: 'Bill status updated successfully.' });
    });
});

// --- Report Routes ---

// Run a custom report query
router.post('/reports', (req, res) => {
    const { query, params } = req.body;
    Model.runCustomQuery(query, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to execute custom report query.' });
        }
        res.json(results);
    });
});

module.exports = router;
