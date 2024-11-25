-- Create the Clients table
CREATE TABLE Clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    credit_card_info VARCHAR(16) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Create the Quotes table
CREATE TABLE Quotes (
    quote_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    property_address TEXT NOT NULL,
    square_feet INT NOT NULL,
    proposed_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'agreed', 'rejected', 'negotiating') DEFAULT 'pending',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id) ON DELETE CASCADE
);

-- Create the Orders table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    work_start_date DATE NOT NULL,
    work_end_date DATE NOT NULL,
    agreed_price DECIMAL(10, 2) NOT NULL,
    status ENUM('scheduled', 'completed') DEFAULT 'scheduled',
    FOREIGN KEY (quote_id) REFERENCES Quotes(quote_id) ON DELETE CASCADE
);

-- Create the Bills table
CREATE TABLE Bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'disputed') DEFAULT 'pending',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- Create the Responses table (for negotiation history)
CREATE TABLE Responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT DEFAULT NULL,
    bill_id INT DEFAULT NULL,
    response_note TEXT NOT NULL,
    response_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    response_type ENUM('client', 'admin') NOT NULL,
    FOREIGN KEY (quote_id) REFERENCES Quotes(quote_id) ON DELETE CASCADE,
    FOREIGN KEY (bill_id) REFERENCES Bills(bill_id) ON DELETE CASCADE
);
