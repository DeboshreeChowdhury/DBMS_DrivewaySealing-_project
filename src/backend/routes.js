const express = require('express');
const router = express.Router();
const Model = require('./model');

// Middleware for parsing JSON
router.use(express.json());

// --- Client Routes ---

// Register a new client
router.post('/clients', (req, res) => {
    const clientData = req.body;
    if (!clientData.first_name || !clientData.last_name || !clientData.email) {
        return res.status(400).json({ error: 'Missing required client details.' });
    }
    Model.addClient(clientData, (err, results) => {
        if (err) {
            console.error('Error registering client:', err.message);
            return res.status(500).json({ error: 'Failed to register client.' });
        }
        res.status(201).json({ message: 'Client registered successfully.', clientId: results.insertId });
    });
});

// Fetch all clients
router.get('/clients', (req, res) => {
    Model.getAllClients((err, results) => {
        if (err) {
            console.error('Error fetching clients:', err.message);
            return res.status(500).json({ error: 'Failed to fetch clients.' });
        }
        res.status(200).json({ message: 'Clients fetched successfully.', clients: results });
    });
});

// --- Quote Routes ---

// Submit a new quote
router.post('/quotes', (req, res) => {
    const { client_id, property_address, square_feet, proposed_price, note, images } = req.body;
    Model.addQuote({ client_id, property_address, square_feet, proposed_price, note }, (err, results) => {
        if (err) {
            console.error('Error adding quote:', err.message);
            return res.status(500).json({ error: 'Failed to submit quote.' });
        }
        const quoteId = results.insertId;

        // Handle quote images if provided
        if (images && images.length > 0) {
            images.forEach((image) => {
                Model.addQuoteImage(quoteId, image, (err) => {
                    if (err) {
                        console.error('Error adding quote image:', err.message);
                    }
                });
            });
        }

        res.status(201).json({ message: 'Quote submitted successfully.', quoteId });
    });
});

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

// Reject a quote with a note
router.put('/quotes/:quoteId/reject', (req, res) => {
    const quoteId = req.params.quoteId;
    const { rejection_note } = req.body;
    Model.rejectQuote(quoteId, rejection_note, (err) => {
        if (err) {
            console.error(`Error rejecting quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to reject quote.' });
        }
        res.status(200).json({ message: 'Quote rejected successfully.' });
    });
});

// Counter a quote with new terms
router.put('/quotes/:quoteId/counter', (req, res) => {
    const quoteId = req.params.quoteId;
    const { counter_price, work_start_date, work_end_date } = req.body;
    Model.updateQuoteWithCounter(quoteId, { counter_price, work_start_date, work_end_date }, (err) => {
        if (err) {
            console.error(`Error countering quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to send counter-proposal.' });
        }
        res.status(200).json({ message: 'Counter-proposal sent successfully.' });
    });
});

// Accept a quote and create an order
router.post('/quotes/:quoteId/accept', (req, res) => {
    const quoteId = req.params.quoteId;
    const { work_start_date, work_end_date, agreed_price } = req.body;
    Model.acceptQuote(quoteId, { work_start_date, work_end_date, agreed_price }, (err) => {
        if (err) {
            console.error(`Error accepting quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to accept quote.' });
        }
        res.status(201).json({ message: 'Quote accepted and order created successfully.' });
    });
});

// Resubmit a quote with a client note
router.put('/quotes/:quoteId/resubmit', (req, res) => {
    const quoteId = req.params.quoteId;
    const { client_note } = req.body;
    Model.resubmitQuote(quoteId, client_note, (err) => {
        if (err) {
            console.error(`Error resubmitting quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to resubmit quote.' });
        }
        res.status(200).json({ message: 'Quote resubmitted successfully.' });
    });
});

// Close a quote
router.put('/quotes/:quoteId/close', (req, res) => {
    const quoteId = req.params.quoteId;
    Model.closeQuote(quoteId, (err) => {
        if (err) {
            console.error(`Error closing quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to close quote.' });
        }
        res.status(200).json({ message: 'Quote closed successfully.' });
    });
});

// --- Order Routes ---

// Fetch all orders
router.get('/orders', (req, res) => {
    Model.getAllOrders((err, results) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).json({ error: 'Failed to fetch orders.' });
        }
        res.status(200).json({ message: 'Orders fetched successfully.', orders: results });
    });
});

// --- Bill Routes ---

// Fetch all bills
router.get('/bills', (req, res) => {
    Model.getAllBills((err, results) => {
        if (err) {
            console.error('Error fetching bills:', err.message);
            return res.status(500).json({ error: 'Failed to fetch bills.' });
        }
        res.status(200).json({ message: 'Bills fetched successfully.', bills: results });
    });
});

// Pay a bill
router.put('/bills/:billId/pay', (req, res) => {
    const billId = req.params.billId;
    Model.payBill(billId, (err) => {
        if (err) {
            console.error(`Error paying bill ID ${billId}:`, err.message);
            return res.status(500).json({ error: 'Failed to pay bill.' });
        }
        res.status(200).json({ message: 'Bill paid successfully.' });
    });
});

// Dispute a bill
router.put('/bills/:billId/dispute', (req, res) => {
    const billId = req.params.billId;
    const { clientNote } = req.body;
    Model.disputeBill(billId, clientNote, (err) => {
        if (err) {
            console.error(`Error disputing bill ID ${billId}:`, err.message);
            return res.status(500).json({ error: 'Failed to dispute bill.' });
        }
        res.status(200).json({ message: 'Bill disputed successfully.' });
    });
});

// --- Report Routes ---

// Generate a custom report
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
