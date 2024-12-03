const express = require('express');
const router = express.Router();
const Model = require('./model');

// Middleware for parsing JSON
router.use(express.json());

// --- Client Routes ---
router.post('/clients', (req, res) => {
    const clientData = req.body;
    Model.addClient(clientData, (err, results) => {
        if (err) {
            console.error('Error adding client:', err.message);
            return res.status(500).json({ error: 'Failed to register client.' });
        }
        res.status(201).json({
            message: 'Client registered successfully.',
            clientId: results.insertId,
        });
    });
});

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
router.post('/quotes', async (req, res) => {
    const { client_id, property_address, square_feet, proposed_price, note, images } = req.body;

    Model.addQuote({ client_id, property_address, square_feet, proposed_price, note }, (err, results) => {
        if (err) {
            console.error('Error adding quote:', err.message);
            return res.status(500).json({ error: 'Failed to add quote.' });
        }
        const quoteId = results.insertId;

        // Add images associated with the quote
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

router.put('/quotes/:quoteId/reject', (req, res) => {
    const quoteId = req.params.quoteId;
    const { rejection_note } = req.body;

    Model.rejectQuote(quoteId, rejection_note, (err, results) => {
        if (err) {
            console.error(`Error rejecting quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to reject quote.' });
        }
        res.status(200).json({ message: 'Quote rejected successfully.' });
    });
});


router.put('/quotes/:quoteId/counter', (req, res) => {
    const quoteId = req.params.quoteId;
    const { counter_price, work_start_date, work_end_date } = req.body;

    Model.updateQuoteWithCounter(quoteId, { counter_price, work_start_date, work_end_date }, (err, results) => {
        if (err) {
            console.error(`Error sending counter-proposal for quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to send counter-proposal.' });
        }
        res.status(200).json({ message: 'Counter-proposal sent successfully.' });
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
router.post('/quotes/:quoteId/accept', (req, res) => {
    const quoteId = req.params.quoteId;
    const { work_start_date, work_end_date, agreed_price } = req.body;

    Model.acceptQuote(quoteId, { work_start_date, work_end_date, agreed_price }, (err, results) => {
        if (err) {
            console.error(`Error accepting quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to accept quote.' });
        }
        res.status(201).json({ message: 'Quote accepted, order created successfully.' });
    });
});
router.put('/quotes/:quoteId/resubmit', (req, res) => {
    const quoteId = req.params.quoteId;
    const { client_note } = req.body;

    Model.resubmitQuote(quoteId, client_note, (err, results) => {
        if (err) {
            console.error(`Error resubmitting quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to resubmit quote.' });
        }
        res.status(200).json({ message: 'Quote resubmitted successfully.' });
    });
});
closeQuote: (quoteId, callback) => {
    const query = `
        UPDATE Quotes
        SET status = 'closed'
        WHERE quote_id = ?
    `;
    db.query(query, [quoteId], (err, results) => callback(err, results));
},
router.put('/quotes/:quoteId/close', (req, res) => {
    const quoteId = req.params.quoteId;

    Model.closeQuote(quoteId, (err, results) => {
        if (err) {
            console.error(`Error closing quote ID ${quoteId}:`, err.message);
            return res.status(500).json({ error: 'Failed to close quote.' });
        }
        res.status(200).json({ message: 'Quote closed successfully.' });
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
router.post('/bills', (req, res) => {
    const billData = req.body;

    Model.generateBill(billData, (err, results) => {
        if (err) {
            console.error('Error generating bill:', err.message);
            return res.status(500).json({ error: 'Failed to generate bill.' });
        }
        res.status(201).json({ message: 'Bill generated successfully.', billId: results.insertId });
    });
});
router.put('/bills/:billId/pay', (req, res) => {
    const billId = req.params.billId;

    Model.payBill(billId, (err, results) => {
        if (err) {
            console.error('Error paying bill:', err.message);
            return res.status(500).json({ error: 'Failed to pay bill.' });
        }
        res.status(200).json({ message: 'Bill paid successfully.' });
    });
});
router.put('/bills/:billId/dispute', (req, res) => {
    const billId = req.params.billId;
    const { clientNote } = req.body;

    Model.respondToBill(billId, clientNote, (err, results) => {
        if (err) {
            console.error('Error disputing bill:', err.message);
            return res.status(500).json({ error: 'Failed to dispute bill.' });
        }
        res.status(200).json({ message: 'Bill disputed successfully.' });
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
