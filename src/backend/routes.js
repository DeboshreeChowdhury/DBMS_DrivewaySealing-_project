const express = require('express');
const router = express.Router();
const Model = require('./model');

// Middleware for parsing JSON
router.use(express.json());

// Utility function to send consistent error responses
const handleError = (res, message, error, status = 500) => {
    console.error(message, error ? `: ${error.message}` : '');
    return res.status(status).json({ error: message });
};

// --- Client Routes ---

// Register a new client
router.post('/clients', (req, res) => {
    const clientData = req.body;
    if (!clientData.first_name || !clientData.last_name || !clientData.email) {
        return res.status(400).json({ error: 'Missing required client details.' });
    }
    Model.addClient(clientData, (err, results) => {
        if (err) return handleError(res, 'Failed to register client', err);
        res.status(201).json({ message: 'Client registered successfully.', clientId: results.insertId });
    });
});

// Fetch all clients
router.get('/clients', (req, res) => {
    Model.getAllClients((err, results) => {
        if (err) return handleError(res, 'Failed to fetch clients', err);
        res.status(200).json({ message: 'Clients fetched successfully.', clients: results });
    });
});

// --- Quote Routes ---

// Submit a new quote
router.post('/quotes', (req, res) => {
    const { client_id, property_address, square_feet, proposed_price, note, images } = req.body;
    if (!client_id || !property_address || !square_feet || !proposed_price) {
        return res.status(400).json({ error: 'Missing required quote details.' });
    }
    Model.addQuote({ client_id, property_address, square_feet, proposed_price, note }, (err, results) => {
        if (err) return handleError(res, 'Failed to submit quote', err);

        const quoteId = results.insertId;

        // Handle quote images if provided
        if (images && images.length > 0) {
            Model.addQuoteImages(quoteId, images, (imageErr) => {
                if (imageErr) console.error('Error adding quote images:', imageErr.message);
            });
        }

        res.status(201).json({ message: 'Quote submitted successfully.', quoteId });
    });
});

// Get quotes for a specific client
router.get('/quotes/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    Model.getQuotesByClientId(clientId, (err, results) => {
        if (err) return handleError(res, `Failed to fetch quotes for client ID ${clientId}`, err);
        res.status(200).json({ message: 'Quotes fetched successfully.', quotes: results });
    });
});

// Reject a quote with a note
router.put('/quotes/:quoteId/reject', (req, res) => {
    const quoteId = req.params.quoteId;
    const { rejection_note } = req.body;
    if (!rejection_note) {
        return res.status(400).json({ error: 'Rejection note is required.' });
    }
    Model.rejectQuote(quoteId, rejection_note, (err) => {
        if (err) return handleError(res, `Failed to reject quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Quote rejected successfully.' });
    });
});

// Counter a quote with new terms
router.put('/quotes/:quoteId/counter', (req, res) => {
    const quoteId = req.params.quoteId;
    const { counter_price, work_start_date, work_end_date } = req.body;
    if (!counter_price || !work_start_date || !work_end_date) {
        return res.status(400).json({ error: 'All counter terms are required.' });
    }
    Model.updateQuoteWithCounter(quoteId, { counter_price, work_start_date, work_end_date }, (err) => {
        if (err) return handleError(res, `Failed to send counter-proposal for quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Counter-proposal sent successfully.' });
    });
});

// Accept a quote and create an order
router.post('/quotes/:quoteId/accept', (req, res) => {
    const quoteId = req.params.quoteId;
    const { work_start_date, work_end_date, agreed_price } = req.body;
    if (!work_start_date || !work_end_date || !agreed_price) {
        return res.status(400).json({ error: 'All order details are required.' });
    }
    Model.acceptQuote(quoteId, { work_start_date, work_end_date, agreed_price }, (err) => {
        if (err) return handleError(res, `Failed to accept quote ID ${quoteId}`, err);
        res.status(201).json({ message: 'Quote accepted and order created successfully.' });
    });
});

// --- Order Routes ---

// Fetch all orders
router.get('/orders', (req, res) => {
    Model.getAllOrders((err, results) => {
        if (err) return handleError(res, 'Failed to fetch orders', err);
        res.status(200).json({ message: 'Orders fetched successfully.', orders: results });
    });
});

// --- Bill Routes ---

// Fetch all bills
router.get('/bills', (req, res) => {
    Model.getAllBills((err, results) => {
        if (err) return handleError(res, 'Failed to fetch bills', err);
        res.status(200).json({ message: 'Bills fetched successfully.', bills: results });
    });
});

// Pay a bill
router.put('/bills/:billId/pay', (req, res) => {
    const billId = req.params.billId;
    Model.payBill(billId, (err) => {
        if (err) return handleError(res, `Failed to pay bill ID ${billId}`, err);
        res.status(200).json({ message: 'Bill paid successfully.' });
    });
});

// Dispute a bill
router.put('/bills/:billId/dispute', (req, res) => {
    const billId = req.params.billId;
    const { clientNote } = req.body;
    if (!clientNote) {
        return res.status(400).json({ error: 'Dispute note is required.' });
    }
    Model.disputeBill(billId, clientNote, (err) => {
        if (err) return handleError(res, `Failed to dispute bill ID ${billId}`, err);
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
        if (err) return handleError(res, 'Failed to execute custom report query', err);
        res.status(200).json({ message: 'Report generated successfully.', report: results });
    });
});

module.exports = router;
