const db = require('./db_config');

// Model for interacting with the database
const Model = {
    // Fetch all clients
    getAllClients: (callback) => {
        const query = 'SELECT * FROM Clients';
        db.query(query, (err, results) => {
            callback(err, results);
        });
    },

    // Add a new client
    addClient: (clientData, callback) => {
        const query = `
            INSERT INTO Clients (first_name, last_name, address, credit_card_info, phone_number, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const { first_name, last_name, address, credit_card_info, phone_number, email } = clientData;
        db.query(
            query,
            [first_name, last_name, address, credit_card_info, phone_number, email],
            (err, results) => {
                callback(err, results);
            }
        );
    },

    // Fetch quotes by client ID
    getQuotesByClientId: (clientId, callback) => {
        const query = 'SELECT * FROM Quotes WHERE client_id = ?';
        db.query(query, [clientId], (err, results) => {
            callback(err, results);
        });
    },

    // Add a new quote
    addQuote: (quoteData, callback) => {
        const query = `
            INSERT INTO Quotes (client_id, property_address, square_feet, proposed_price, note)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { client_id, property_address, square_feet, proposed_price, note } = quoteData;
        db.query(
            query,
            [client_id, property_address, square_feet, proposed_price, note],
            (err, results) => {
                callback(err, results);
            }
        );
    },
    
    addQuoteImage: (quoteId, imageUrl, callback) => {
        const query = `
            INSERT INTO QuoteImages (quote_id, image_url)
            VALUES (?, ?)
        `;
        db.query(query, [quoteId, imageUrl], (err, results) => {
            callback(err, results);
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
            callback(err, results);
        });
    },

    // Fetch all orders
    getAllOrders: (callback) => {
        const query = `
            SELECT o.*, q.property_address, q.square_feet, c.first_name, c.last_name
            FROM Orders o
            JOIN Quotes q ON o.quote_id = q.quote_id
            JOIN Clients c ON q.client_id = c.client_id
        `;
        db.query(query, (err, results) => {
            callback(err, results);
        });
    },


    updateQuoteWithCounter: (quoteId, counterData, callback) => {
        const query = `
            UPDATE Quotes
            SET counter_price = ?, work_start_date = ?, work_end_date = ?, status = 'counter_proposed'
            WHERE quote_id = ?
        `;
        const { counter_price, work_start_date, work_end_date } = counterData;
        db.query(
            query,
            [counter_price, work_start_date, work_end_date, quoteId],
            (err, results) => {
                callback(err, results);
            }
        );
    },
    rejectQuote: (quoteId, rejectionNote, callback) => {
        const query = `
            UPDATE Quotes
            SET status = 'rejected', rejection_note = ?
            WHERE quote_id = ?
        `;
        db.query(query, [rejectionNote, quoteId], (err, results) => {
            callback(err, results);
        });
    },
    
    // Add a new order
    addOrder: (orderData, callback) => {
        const query = `
            INSERT INTO Orders (quote_id, work_start_date, work_end_date, agreed_price)
            VALUES (?, ?, ?, ?)
        `;
        const { quote_id, work_start_date, work_end_date, agreed_price } = orderData;
        db.query(
            query,
            [quote_id, work_start_date, work_end_date, agreed_price],
            (err, results) => {
                callback(err, results);
            }
        );
    },
    acceptQuote: (quoteId, orderData, callback) => {
        const query = `
            INSERT INTO Orders (quote_id, work_start_date, work_end_date, agreed_price)
            VALUES (?, ?, ?, ?)
        `;
        const { work_start_date, work_end_date, agreed_price } = orderData;
        db.query(
            query,
            [quoteId, work_start_date, work_end_date, agreed_price],
            (err, results) => {
                if (err) return callback(err);
                // Update the quote status to "accepted"
                const updateQuoteQuery = `UPDATE Quotes SET status = 'accepted' WHERE quote_id = ?`;
                db.query(updateQuoteQuery, [quoteId], (err) => callback(err, results));
            }
        );
    },

    updateQuoteByAdmin: (quoteId, adminData, callback) => {
        const query = `
            UPDATE Quotes
            SET proposed_price = ?, work_start_date = ?, work_end_date = ?, admin_note = ?, status = 'pending'
            WHERE quote_id = ?
        `;
        const { proposed_price, work_start_date, work_end_date, admin_note } = adminData;
        db.query(
            query,
            [proposed_price, work_start_date, work_end_date, admin_note, quoteId],
            (err, results) => callback(err, results)
        );
    },
    updateQuoteByAdmin: (quoteId, adminData, callback) => {
        const query = `
            UPDATE Quotes
            SET proposed_price = ?, work_start_date = ?, work_end_date = ?, admin_note = ?, status = 'pending'
            WHERE quote_id = ?
        `;
        const { proposed_price, work_start_date, work_end_date, admin_note } = adminData;
        db.query(
            query,
            [proposed_price, work_start_date, work_end_date, admin_note, quoteId],
            (err, results) => callback(err, results)
        );
    },
    
    resubmitQuote: (quoteId, clientNote, callback) => {
        const query = `
            UPDATE Quotes
            SET client_note = ?, status = 'pending'
            WHERE quote_id = ?
        `;
        db.query(query, [clientNote, quoteId], (err, results) => {
            callback(err, results);
        });
    },
    
    generateBill: (billData, callback) => {
        const query = `
            INSERT INTO Bills (order_id, amount_due, note, status)
            VALUES (?, ?, ?, 'pending')
        `;
        const { order_id, amount_due, note } = billData;
        db.query(query, [order_id, amount_due, note], callback);
    },
    updateBillStatus: (billId, status, adminNote, callback) => {
        const query = `
            UPDATE Bills
            SET status = ?, admin_note = ?
            WHERE bill_id = ?
        `;
        db.query(query, [status, adminNote, billId], callback);
    },
    respondToBill: (billId, adminNote, callback) => {
        const query = `
            UPDATE Bills
            SET admin_note = ?, status = 'pending'
            WHERE bill_id = ?
        `;
        db.query(query, [adminNote, billId], callback);
    },
    payBill: (billId, callback) => {
        const query = `
            UPDATE Bills
            SET status = 'paid', last_updated = NOW()
            WHERE bill_id = ?
        `;
        db.query(query, [billId], callback);
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
            callback(err, results);
        });
    },

    // Add a new bill
    addBill: (billData, callback) => {
        const query = `
            INSERT INTO Bills (order_id, amount_due, note)
            VALUES (?, ?, ?)
        `;
        const { order_id, amount_due, note } = billData;
        db.query(query, [order_id, amount_due, note], (err, results) => {
            callback(err, results);
        });
    },

    // Update bill status
    updateBillStatus: (billId, status, callback) => {
        const query = `
            UPDATE Bills
            SET status = ?
            WHERE bill_id = ?
        `;
        db.query(query, [status, billId], (err, results) => {
            callback(err, results);
        });
    },

    // Run SQL queries for reporting (e.g., top clients, overdue bills)
    runCustomQuery: (query, params, callback) => {
        db.query(query, params, (err, results) => {
            callback(err, results);
        });
    },
};

module.exports = Model;
