INSERT INTO Clients (first_name, last_name, address, credit_card_info, phone_number, email)
VALUES
('John', 'Doe', '123 Elm St, Cityville', '1234567812345678', '123-456-7890', 'john.doe@example.com'),
('Jane', 'Smith', '456 Oak Ave, Townsville', '8765432187654321', '987-654-3210', 'jane.smith@example.com');

INSERT INTO Quotes (client_id, property_address, square_feet, proposed_price, status, note)
VALUES
(1, '123 Elm St, Cityville', 1000, 500.00, 'pending', 'Please consider a lower price.'),
(2, '456 Oak Ave, Townsville', 800, 400.00, 'pending', 'Would like it done next week.');
