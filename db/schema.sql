CREATE TABLE Clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address TEXT,
    credit_card_info VARCHAR(16),
    phone_number VARCHAR(15),
    email VARCHAR(100),
    UNIQUE(email)
);

CREATE TABLE Quotes (
    quote_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    property_address TEXT,
    square_feet INT,
    proposed_price DECIMAL(10, 2),
    status ENUM('pending', 'agreed', 'rejected'),
    note TEXT,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id)
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT,
    work_start_date DATE,
    work_end_date DATE,
    agreed_price DECIMAL(10, 2),
    FOREIGN KEY (quote_id) REFERENCES Quotes(quote_id)
);

CREATE TABLE Bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    amount_due DECIMAL(10, 2),
    status ENUM('pending', 'paid', 'disputed'),
    note TEXT,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
