-- Insert sample clients
INSERT INTO Clients (first_name, last_name, address, credit_card_info, phone_number, email)
VALUES
('John', 'Doe', '123 Main St, Cityville', '1234567812345678', '123-456-7890', 'john.doe@example.com'),
('Jane', 'Smith', '456 Elm St, Townsville', '2345678923456789', '234-567-8901', 'jane.smith@example.com'),
('Alice', 'Brown', '789 Oak St, Villageville', '3456789034567890', '345-678-9012', 'alice.brown@example.com'),
('Bob', 'Johnson', '321 Pine St, Hamletville', '4567890145678901', '456-789-0123', 'bob.johnson@example.com'),
('Chris', 'Evans', '500 Maple St, Lakewood', '5678901256789012', '567-890-1234', 'chris.evans@example.com');

-- Insert sample quotes
INSERT INTO Quotes (client_id, property_address, square_feet, proposed_price, status, note, negotiation_status, client_note)
VALUES
(1, '123 Main St, Cityville', 500, 450.00, 'agreed', 'Looking for a quick job.', 'agreed', NULL),
(2, '456 Elm St, Townsville', 750, 600.00, 'pending', 'Can you do it next week?', 'pending', NULL),
(2, '456 Elm St, Townsville', 750, 650.00, 'rejected', 'Price too high.', 'failed', NULL),
(3, '789 Oak St, Villageville', 1000, 900.00, 'agreed', 'Please provide the earliest time slot.', 'agreed', NULL),
(4, '321 Pine St, Hamletville', 1200, 1000.00, 'pending', 'Can we lower the price a bit?', 'pending', NULL),
(5, '500 Maple St, Lakewood', 800, 700.00, 'agreed', 'Looking for a weekend slot.', 'agreed', NULL);

-- Insert sample quote images
INSERT INTO QuoteImages (quote_id, image_url)
VALUES
(1, 'image1_url'),
(1, 'image2_url'),
(1, 'image3_url'),
(1, 'image4_url'),
(1, 'image5_url'),
(2, 'image6_url'),
(2, 'image7_url'),
(3, 'image8_url'),
(3, 'image9_url'),
(4, 'image10_url'),
(5, 'image11_url');

-- Insert sample orders
INSERT INTO Orders (quote_id, work_start_date, work_end_date, agreed_price, status)
VALUES
(1, '2024-11-20', '2024-11-21', 450.00, 'completed'),
(3, '2024-11-22', '2024-11-23', 900.00, 'scheduled'),
(5, '2024-12-01', '2024-12-02', 700.00, 'scheduled');

-- Insert sample bills
INSERT INTO Bills (order_id, amount_due, status, client_note, admin_note)
VALUES
(1, 450.00, 'paid', NULL, NULL),
(2, 900.00, 'pending', 'Awaiting payment.', NULL),
(3, 700.00, 'pending', NULL, 'Reminder: payment is due.');

-- Insert sample responses (for negotiation history on quotes)
INSERT INTO Responses (related_id, response_type, responder, response_note)
VALUES
(2, 'quote', 'client', 'Can you lower the price to $550?'),
(2, 'quote', 'admin', 'How about $600?'),
(4, 'quote', 'client', 'Can we agree on $950?'),
(4, 'quote', 'admin', 'We can do $1000. Let us know.'),
(4, 'quote', 'client', 'Okay, let’s finalize at $1000.'),
(5, 'quote', 'client', 'Can you offer $650?'),
(5, 'quote', 'admin', 'We cannot go below $700.');

-- Insert sample responses (for negotiation history on bills)
INSERT INTO Responses (related_id, response_type, responder, response_note)
VALUES
(2, 'bill', 'client', 'Please apply a discount for delay.'),
(2, 'bill', 'admin', 'We can offer a $50 discount.'),
(3, 'bill', 'admin', 'Payment reminder: kindly pay within 24 hours.'),
(3, 'bill', 'client', 'I will make the payment soon.');
