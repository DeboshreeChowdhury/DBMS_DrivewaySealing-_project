-- Query 1: Big Clients
-- List the clients that David Smith completed the most number of orders.
SELECT c.client_id, c.first_name, c.last_name, COUNT(o.order_id) AS total_orders
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
JOIN Orders o ON q.quote_id = o.quote_id
WHERE o.status = 'completed'
GROUP BY c.client_id, c.first_name, c.last_name
HAVING total_orders = (
    SELECT MAX(order_count)
    FROM (
        SELECT COUNT(o2.order_id) AS order_count
        FROM Orders o2
        JOIN Quotes q2 ON o2.quote_id = q2.quote_id
        WHERE o2.status = 'completed'
        GROUP BY q2.client_id
    ) AS subquery
);

-- Query 2: Difficult Clients
-- List the clients who sent three different requests but never followed up with an order.
SELECT c.client_id, c.first_name, c.last_name
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
WHERE c.client_id NOT IN (
    SELECT DISTINCT q2.client_id
    FROM Orders o
    JOIN Quotes q2 ON o.quote_id = q2.quote_id
)
GROUP BY c.client_id, c.first_name, c.last_name
HAVING COUNT(q.quote_id) = 3;

-- Query 3: This Month's Quotes
-- List all the agreed quotes in the current month.
SELECT q.quote_id, c.first_name, c.last_name, q.property_address, q.proposed_price, q.last_updated
FROM Quotes q
JOIN Clients c ON q.client_id = c.client_id
WHERE q.status = 'agreed'
AND MONTH(q.last_updated) = MONTH(CURRENT_DATE())
AND YEAR(q.last_updated) = YEAR(CURRENT_DATE());

-- Query 4: Prospective Clients
-- List all the clients who have registered but never submitted any request for quotes.
SELECT c.client_id, c.first_name, c.last_name, c.email
FROM Clients c
LEFT JOIN Quotes q ON c.client_id = q.client_id
WHERE q.quote_id IS NULL;

-- Query 5: Largest Driveway
-- List the locations of the largest driveways David Smith has worked on.
SELECT q.property_address, q.square_feet
FROM Quotes q
WHERE q.square_feet = (
    SELECT MAX(square_feet)
    FROM Quotes
    WHERE status = 'agreed'
);

-- Query 6: Overdue Bills
-- List all the bills that have not been paid after one week since their creation.
SELECT b.bill_id, c.first_name, c.last_name, b.amount_due, b.status, b.created_at
FROM Bills b
JOIN Orders o ON b.order_id = o.order_id
JOIN Quotes q ON o.quote_id = q.quote_id
JOIN Clients c ON q.client_id = c.client_id
WHERE b.status = 'pending'
AND DATEDIFF(CURRENT_DATE(), b.created_at) > 7;

-- Query 7: Bad Clients
-- List all the clients that have never paid any overdue bill.
SELECT DISTINCT c.client_id, c.first_name, c.last_name
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
JOIN Orders o ON q.quote_id = o.quote_id
JOIN Bills b ON o.order_id = b.order_id
WHERE c.client_id NOT IN (
    SELECT DISTINCT c2.client_id
    FROM Bills b2
    JOIN Orders o2 ON b2.order_id = o2.order_id
    JOIN Quotes q2 ON o2.quote_id = q2.quote_id
    JOIN Clients c2 ON q2.client_id = c2.client_id
    WHERE b2.status = 'paid'
)
AND b.status = 'pending'
AND DATEDIFF(CURRENT_DATE(), b.created_at) > 7;

-- Query 8: Good Clients
-- List all the clients that paid their bills within 24 hours of bill generation.
SELECT DISTINCT c.client_id, c.first_name, c.last_name
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
JOIN Orders o ON q.quote_id = o.quote_id
JOIN Bills b ON o.order_id = b.order_id
WHERE b.status = 'paid'
AND TIMESTAMPDIFF(HOUR, b.created_at, b.updated_at) <= 24;
