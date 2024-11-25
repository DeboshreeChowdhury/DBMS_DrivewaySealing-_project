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
        res.status(200).json({ message: 'Clients fetched successfully.', clients: results });
    });
});

// Add a new client
router.post('/clients', (req, res) => {
    const clientData = req.body;
    if (!clientData.first_name || !clientData.last_name || !clientData.email) {
        return res.status(400).json({ error: 'Missing required client details.' });
    }
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
        res.status(200).json({ message: 'Quotes fetched successfully.', quotes: results });
    });
});

// Add a new quote
router.post('/quotes', (req, res) => {
    const quoteData = req.body;
    if (!quoteData.client_id || !quoteData.property_address || !quoteData.square_feet) {
        return res.status(400).json({ error: 'Missing required quote details.' });
    }
    Model.addQuote(quoteData, (err, results) => {
        if (err) {
            console.error('Error adding quote:', err.message);
            return res.status(500).json({ error: 'Failed to add quote.' });
        }
        res.status(201).json({ message: 'Quote added successfully.', quoteId: results.insertId });
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
        res.status(200).json({ message: 'Orders fetched successfully.', orders: results });
    });
});

// Add a new order
router.post('/orders', (req, res) => {
    const orderData = req.body;
    if (!orderData.quote_id || !orderData.work_start_date || !orderData.work_end_date) {
        return res.status(400).json({ error: 'Missing required order details.' });
    }
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
        res.status(200).json({ message: 'Bills fetched successfully.', bills: results });
    });
});

// Add a new bill
router.post('/bills', (req, res) => {
    const billData = req.body;
    if (!billData.order_id || !billData.amount_due) {
        return res.status(400).json({ error: 'Missing required bill details.' });
    }
    Model.addBill(billData, (err, results) => {
        if (err) {
            console.error('Error adding bill:', err.message);
            return res.status(500).json({ error: 'Failed to add bill.' });
        }
        res.status(201).json({ message: 'Bill added successfully.', billId: results.insertId });
    });
});

// --- Report Routes ---

// Run a custom report query
router.post('/reports', (req, res) => {
    const { query, params } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }
    Model.runCustomQuery(query, params || [], (err, results) => {
        if (err) {
            console.error('Error executing custom report query:', err.message);
            return res.status(500).json({ error: 'Failed to execute custom report query.' });
        }
        res.status(200).json({ message: 'Report generated successfully.', report: results });
    });
});

module.exports = router;
