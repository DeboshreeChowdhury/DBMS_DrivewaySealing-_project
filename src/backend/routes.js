const express = require('express');
const router = express.Router();
const Model = require('./model');

// Middleware for parsing JSON
router.use(express.json());

// Utility function to handle errors
const handleError = (res, message, err, status = 500) => {
    console.error(message, err ? `: ${err.message}` : '');
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
        res.status(200).json({ clients: results });
    });
});

// --- Quote Routes ---
// Submit a new quote
router.post('/quotes', (req, res) => {
    const { client_id, property_address, square_feet, proposed_price, note, images } = req.body;

    if (!client_id || !property_address || !square_feet || !proposed_price || !images || images.length !== 5) {
        return res.status(400).json({ error: 'All fields and exactly 5 images are required.' });
    }

    Model.addQuote({ client_id, property_address, square_feet, proposed_price, note }, (err, results) => {
        if (err) return handleError(res, 'Failed to submit quote', err);

        const quoteId = results.insertId;

        Model.addQuoteImages(quoteId, images, (imageErr) => {
            if (imageErr) return handleError(res, 'Failed to add images to quote', imageErr);

            res.status(201).json({ message: 'Quote submitted successfully.', quoteId });
        });
    });
});


// Fetch quotes for a specific client
router.get('/quotes/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    Model.getQuotesByClientId(clientId, (err, results) => {
        if (err) return handleError(res, `Failed to fetch quotes for client ID ${clientId}`, err);
        res.status(200).json({ quotes: results });
    });
});


// Reject a quote with a note
router.put('/quotes/:quoteId/reject', (req, res) => {
    const { rejection_note } = req.body;
    const { quoteId } = req.params;

    if (!rejection_note) {
        return res.status(400).json({ error: 'Rejection note is required.' });
    }

    Model.rejectQuote(quoteId, rejection_note, (err) => {
        if (err) return handleError(res, 'Failed to reject quote', err);
        res.status(200).json({ message: 'Quote rejected successfully.' });
    });
});

// Respond with a counter proposal
router.put('/quotes/:quoteId/counter', (req, res) => {
    const { counter_price, work_start_date, work_end_date, admin_note } = req.body;
    const { quoteId } = req.params;

    if (!counter_price || !work_start_date || !work_end_date || !admin_note) {
        return res.status(400).json({ error: 'All counter proposal fields are required.' });
    }

    Model.updateQuoteWithCounter(quoteId, { counter_price, work_start_date, work_end_date, admin_note }, (err) => {
        if (err) return handleError(res, 'Failed to send counter proposal', err);
        res.status(200).json({ message: 'Counter proposal sent successfully.' });
    });
});


// Accept the quote
router.post('/quotes/:quoteId/accept', (req, res) => {
    const { work_start_date, work_end_date, agreed_price } = req.body;
    const { quoteId } = req.params;

    if (!work_start_date || !work_end_date || !agreed_price) {
        return res.status(400).json({ error: 'All acceptance fields are required.' });
    }

    Model.acceptQuote(quoteId, { work_start_date, work_end_date, agreed_price }, (err) => {
        if (err) return handleError(res, 'Failed to accept quote', err);
        res.status(201).json({ message: 'Quote accepted and order created successfully.' });
    });
});

// Resubmit the quote
router.put('/quotes/:quoteId/resubmit', (req, res) => {
    const { client_note } = req.body;
    const { quoteId } = req.params;

    if (!client_note) {
        return res.status(400).json({ error: 'Client note is required to resubmit.' });
    }

    Model.resubmitQuote(quoteId, client_note, (err) => {
        if (err) return handleError(res, 'Failed to resubmit quote', err);
        res.status(200).json({ message: 'Quote resubmitted successfully.' });
    });
});
// Cancel a Quote
router.put('/quotes/:quoteId/cancel', (req, res) => {
    const quoteId = req.params.quoteId;
    Model.cancelQuote(quoteId, (err) => {
        if (err) return handleError(res, `Failed to cancel quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Quote canceled successfully.' });
    });
});

// Negotiate a Quote
router.put('/quotes/:quoteId/negotiate', (req, res) => {
    const quoteId = req.params.quoteId;
    const { counter_price, note } = req.body;
    if (!counter_price) {
        return res.status(400).json({ error: 'Counter-proposed price is required.' });
    }
    Model.negotiateQuote(quoteId, { counter_price, note }, (err) => {
        if (err) return handleError(res, `Failed to negotiate quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Negotiation request sent successfully.' });
    });
});

// Accept a Quote
router.put('/quotes/:quoteId/accept', (req, res) => {
    const quoteId = req.params.quoteId;
    Model.acceptQuote(quoteId, (err) => {
        if (err) return handleError(res, `Failed to accept quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Quote accepted successfully.' });
    });
});

router.put('/quotes/:quoteId/resubmit', (req, res) => {
    const quoteId = req.params.quoteId;
    const { proposed_price, client_note } = req.body;
    Model.resubmitQuote(quoteId, { proposed_price, client_note }, (err, results) => {
        if (err) return handleError(res, `Failed to resubmit quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Quote resubmitted successfully.' });
    });
});

router.put('/quotes/:quoteId/counter', (req, res) => {
    const quoteId = req.params.quoteId;
    const { counter_price, work_start_date, work_end_date, admin_note } = req.body;
    Model.updateQuoteWithCounter(quoteId, { counter_price, work_start_date, work_end_date, admin_note }, (err, results) => {
        if (err) return handleError(res, `Failed to send counter-proposal for quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Counter-proposal sent successfully.' });
    });
});
router.put('/quotes/:quoteId/close', (req, res) => {
    const quoteId = req.params.quoteId;
    const { status } = req.body;
    if (!['closed', 'failed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status for closing the quote.' });
    }
    Model.closeQuote(quoteId, status, (err, results) => {
        if (err) return handleError(res, `Failed to close quote ID ${quoteId}`, err);
        res.status(200).json({ message: `Quote marked as ${status}.` });
    });
});
router.put('/quotes/:quoteId/negotiate', (req, res) => {
    const { client_note } = req.body;
    const quoteId = req.params.quoteId;
    if (!client_note) return res.status(400).json({ error: 'Negotiation note is required.' });
    Model.addResponse('quote', quoteId, 'client', client_note, (err, results) => {
        if (err) return handleError(res, `Failed to negotiate quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Negotiation response submitted.' });
    });
});
router.put('/quotes/:quoteId/respond', (req, res) => {
    const { admin_note, counter_price, work_start_date, work_end_date } = req.body;
    const quoteId = req.params.quoteId;
    if (!admin_note || !counter_price || !work_start_date || !work_end_date) {
        return res.status(400).json({ error: 'All fields are required for a counter-proposal.' });
    }
    Model.updateQuoteWithCounter(quoteId, { admin_note, counter_price, work_start_date, work_end_date }, (err, results) => {
        if (err) return handleError(res, `Failed to respond to quote ID ${quoteId}`, err);
        res.status(200).json({ message: 'Counter-proposal submitted.' });
    });
});
router.put('/bills/:billId/dispute', (req, res) => {
    const { client_note } = req.body;
    const billId = req.params.billId;
    if (!client_note) return res.status(400).json({ error: 'Dispute note is required.' });
    Model.addResponse('bill', billId, 'client', client_note, (err, results) => {
        if (err) return handleError(res, `Failed to dispute bill ID ${billId}`, err);
        res.status(200).json({ message: 'Dispute response submitted.' });
    });
});
router.put('/bills/:billId/resolve', (req, res) => {
    const { admin_note, discount } = req.body;
    const billId = req.params.billId;
    if (!admin_note) return res.status(400).json({ error: 'Resolution note is required.' });
    Model.resolveBill(billId, { admin_note, discount }, (err, results) => {
        if (err) return handleError(res, `Failed to resolve bill ID ${billId}`, err);
        res.status(200).json({ message: 'Dispute resolved successfully.' });
    });
});
router.get('/reports/revenue', (req, res) => {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
        return res.status(400).json({ error: 'Start and end dates are required.' });
    }
    Model.generateRevenueReport(start_date, end_date, (err, results) => {
        if (err) return handleError(res, 'Failed to generate revenue report', err);
        res.status(200).json({ message: 'Revenue report generated successfully.', report: results });
    });
});

// --- Order Routes ---
// Fetch all orders
router.get('/orders', (req, res) => {
    Model.getAllOrders((err, results) => {
        if (err) return handleError(res, 'Failed to fetch orders', err);
        res.status(200).json({ orders: results });
    });
});

// --- Bill Routes ---
// Fetch all bills
router.get('/bills', (req, res) => {
    Model.getAllBills((err, results) => {
        if (err) return handleError(res, 'Failed to fetch bills', err);
        res.status(200).json({ bills: results });
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
router.put('/orders/:orderId/complete', (req, res) => {
    const orderId = req.params.orderId;
    Model.completeOrder(orderId, (err, results) => {
        if (err) return handleError(res, `Failed to mark order ID ${orderId} as completed`, err);
        res.status(200).json({ message: 'Order marked as completed successfully.' });
    });
});
router.put('/bills/:billId/dispute', (req, res) => {
    const billId = req.params.billId;
    const { client_note } = req.body;
    Model.disputeBill(billId, client_note, (err, results) => {
        if (err) return handleError(res, `Failed to dispute bill ID ${billId}`, err);
        res.status(200).json({ message: 'Bill disputed successfully.' });
    });
});
router.put('/bills/:billId/resolve', (req, res) => {
    const billId = req.params.billId;
    const { admin_note, discount } = req.body;
    Model.resolveBill(billId, { admin_note, discount }, (err, results) => {
        if (err) return handleError(res, `Failed to resolve bill ID ${billId}`, err);
        res.status(200).json({ message: 'Bill resolved successfully.' });
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
        res.status(200).json({ report: results });
    });
});

module.exports = router;
