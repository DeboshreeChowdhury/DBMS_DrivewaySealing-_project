-- Insert sample clients
INSERT INTO Clients (first_name, last_name, address, credit_card_info, phone_number, email)
VALUES
('John', 'Doe', '123 Main St, Cityville', '1234567812345678', '123-456-7890', 'john.doe@example.com'),
('Jane', 'Smith', '456 Elm St, Townsville', '2345678923456789', '234-567-8901', 'jane.smith@example.com'),
('Alice', 'Brown', '789 Oak St, Villageville', '3456789034567890', '345-678-9012', 'alice.brown@example.com'),
('Bob', 'Johnson', '321 Pine St, Hamletville', '4567890145678901', '456-789-0123', 'bob.johnson@example.com');

-- Insert sample quotes
INSERT INTO Quotes (client_id, property_address, square_feet, proposed_price, status, note)
VALUES
(1, '123 Main St, Cityville', 500, 450.00, 'agreed', 'Looking for a quick job.'),
(2, '456 Elm St, Townsville', 750, 600.00, 'pending', 'Can you do it next week?'),
(2, '456 Elm St, Townsville', 750, 650.00, 'rejected', 'Price too high.'),
(3, '789 Oak St, Villageville', 1000, 900.00, 'agreed', 'Please provide the earliest time slot.'),
(4, '321 Pine St, Hamletville', 1200, 1000.00, 'pending', 'Can we lower the price a bit?');

-- Insert sample quote images
INSERT INTO QuoteImages (quote_id, image_url)
VALUES
(1, 'image1_url'),
(1, 'image2_url'),
(2, 'image3_url'),
(2, 'image4_url'),
(3, 'image5_url');

-- Insert sample orders
INSERT INTO Orders (quote_id, work_start_date, work_end_date, agreed_price, status)
VALUES
(1, '2024-11-20', '2024-11-21', 450.00, 'completed'),
(3, '2024-11-22', '2024-11-23', 900.00, 'scheduled');

-- Insert sample bills
INSERT INTO Bills (order_id, amount_due, status, note)
VALUES
(1, 450.00, 'paid', NULL),
(2, 900.00, 'pending', 'Awaiting payment.');

-- Insert sample responses (for negotiation history)
INSERT INTO Responses (quote_id, response_note, response_type)
VALUES
(2, 'Can you lower the price to $550?', 'client'),
(2, 'How about $600?', 'admin'),
(4, 'Can we agree on $950?', 'client'),
(4, 'We can do $1000. Let us know.', 'admin'),
(4, 'Okay, let’s finalize at $1000.', 'client');

INSERT INTO Responses (bill_id, response_note, response_type)
VALUES
(2, 'Please apply a discount for delay.', 'client'),
(2, 'We can offer a $50 discount.', 'admin');
