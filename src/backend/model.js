const db = require('./db_config');

// Model for interacting with the database
const Model = {
    // Fetch all clients
    getAllClients: (callback) => {
        const query = 'SELECT * FROM Clients';
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Add a new client
    addClient: (clientData, callback) => {
        const query = `
            INSERT INTO Clients (first_name, last_name, address, credit_card_info, phone_number, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const { first_name, last_name, address, credit_card_info, phone_number, email } = clientData;
        db.query(query, [first_name, last_name, address, credit_card_info, phone_number, email], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Fetch all quotes
    getAllQuotes: (callback) => {
        const query = `
            SELECT q.*, c.first_name AS client_name, c.last_name AS client_last_name
            FROM Quotes q
            JOIN Clients c ON q.client_id = c.client_id
        `;
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Fetch quotes by client ID
    getQuotesByClientId: (clientId, callback) => {
        const query = 'SELECT * FROM Quotes WHERE client_id = ?';
        db.query(query, [clientId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Add a new quote
    addQuote: (quoteData, callback) => {
        const query = `
            INSERT INTO Quotes (client_id, property_address, square_feet, proposed_price, note)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { client_id, property_address, square_feet, proposed_price, note } = quoteData;
        db.query(query, [client_id, property_address, square_feet, proposed_price, note], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    addQuoteImages: (quoteId, imageUrls, callback) => {
        const query = `
            INSERT INTO QuoteImages (quote_id, image_url)
            VALUES ?
        `;
        const values = imageUrls.map((url) => [quoteId, url]); // Create an array of values for bulk insert
        db.query(query, [values], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    
    // Update a quote's status
    updateQuoteStatus: (quoteId, status, callback) => {
        const query = `
            UPDATE Quotes
            SET status = ?
            WHERE quote_id = ?
        `;
        db.query(query, [status, quoteId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Reject a quote with a note
    rejectQuote: (quoteId, rejectionNote, callback) => {
        const query = `
            UPDATE Quotes
            SET status = 'rejected', rejection_note = ?
            WHERE quote_id = ?
        `;
        db.query(query, [rejectionNote, quoteId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
// Cancel a Quote
cancelQuote: (quoteId, callback) => {
    const query = `UPDATE Quotes SET status = 'canceled' WHERE quote_id = ?`;
    db.query(query, [quoteId], callback);
},

// Negotiate a Quote
negotiateQuote: (quoteId, negotiationData, callback) => {
    const query = `
        UPDATE Quotes
        SET status = 'counter_proposed', counter_price = ?, client_note = ?
        WHERE quote_id = ?
    `;
    const { counter_price, note } = negotiationData;
    db.query(query, [counter_price, note, quoteId], callback);
},

// Accept a Quote
acceptQuote: (quoteId, callback) => {
    const query = `UPDATE Quotes SET status = 'agreed' WHERE quote_id = ?`;
    db.query(query, [quoteId], callback);
},

    // Counter a quote with admin adjustments
    updateQuoteWithCounter: (quoteId, counterData, callback) => {
        const query = `
            UPDATE Quotes
            SET counter_price = ?, work_start_date = ?, work_end_date = ?, admin_note = ?, status = 'counter_proposed'
            WHERE quote_id = ?
        `;
        const { counter_price, work_start_date, work_end_date, admin_note } = counterData;
        db.query(query, [counter_price, work_start_date, work_end_date, admin_note, quoteId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Accept a quote and create an order
    acceptQuote: (quoteId, orderData, callback) => {
        const { work_start_date, work_end_date, agreed_price } = orderData;
        const insertOrderQuery = `
            INSERT INTO Orders (quote_id, work_start_date, work_end_date, agreed_price)
            VALUES (?, ?, ?, ?)
        `;
        db.query(insertOrderQuery, [quoteId, work_start_date, work_end_date, agreed_price], (err, results) => {
            if (err) return callback(err);
            const updateQuoteQuery = `UPDATE Quotes SET status = 'agreed' WHERE quote_id = ?`;
            db.query(updateQuoteQuery, [quoteId], (err, updateResults) => {
                if (err) return callback(err);
                callback(null, updateResults);
            });
        });
    },

    // Fetch all orders
    getAllOrders: (callback) => {
        const query = `
            SELECT o.*, q.property_address, c.first_name, c.last_name
            FROM Orders o
            JOIN Quotes q ON o.quote_id = q.quote_id
            JOIN Clients c ON q.client_id = c.client_id
        `;
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Generate a new bill
    generateBill: (billData, callback) => {
        const query = `
            INSERT INTO Bills (order_id, amount_due, note)
            VALUES (?, ?, ?)
        `;
        const { order_id, amount_due, note } = billData;
        db.query(query, [order_id, amount_due, note], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Fetch all bills
    getAllBills: (callback) => {
        const query = `
            SELECT b.*, c.first_name, c.last_name, o.work_start_date, o.work_end_date
            FROM Bills b
            JOIN Orders o ON b.order_id = o.order_id
            JOIN Quotes q ON o.quote_id = q.quote_id
            JOIN Clients c ON q.client_id = c.client_id
        `;
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Pay a bill
    payBill: (billId, callback) => {
        const query = `
            UPDATE Bills
            SET status = 'paid', updated_at = NOW()
            WHERE bill_id = ?
        `;
        db.query(query, [billId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Dispute a bill
    disputeBill: (billId, clientNote, callback) => {
        const query = `
            UPDATE Bills
            SET status = 'disputed', client_note = ?
            WHERE bill_id = ?
        `;
        db.query(query, [clientNote, billId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Run a custom report
    runCustomQuery: (query, params, callback) => {
        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
};

module.exports = Model;
