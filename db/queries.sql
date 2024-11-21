SELECT c.client_id, c.first_name, c.last_name, COUNT(o.order_id) AS total_orders
FROM Clients c
JOIN Orders o ON c.client_id = o.order_id
GROUP BY c.client_id
HAVING total_orders = (
    SELECT MAX(order_count) 
    FROM (
        SELECT COUNT(o2.order_id) AS order_count
        FROM Orders o2
        GROUP BY o2.client_id
    ) subquery
);

SELECT c.client_id, c.first_name, c.last_name
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
WHERE q.status = 'pending'
GROUP BY c.client_id
HAVING COUNT(q.quote_id) = 3;



SELECT q.quote_id, q.property_address, q.square_feet, q.proposed_price, q.note
FROM Quotes q
WHERE q.status = 'agreed'
AND MONTH(CURRENT_DATE) = MONTH(q.updated_at)
AND YEAR(CURRENT_DATE) = YEAR(q.updated_at);


SELECT c.client_id, c.first_name, c.last_name
FROM Clients c
LEFT JOIN Quotes q ON c.client_id = q.client_id
WHERE q.client_id IS NULL;


SELECT q.property_address, q.square_feet
FROM Quotes q
JOIN Orders o ON q.quote_id = o.quote_id
ORDER BY q.square_feet DESC
LIMIT 1;

SELECT b.bill_id, c.first_name, c.last_name, b.amount_due, b.status, o.order_id
FROM Bills b
JOIN Orders o ON b.order_id = o.order_id
JOIN Quotes q ON o.quote_id = q.quote_id
JOIN Clients c ON q.client_id = c.client_id
WHERE b.status = 'pending' AND DATEDIFF(CURRENT_DATE(), b.created_at) > 7;

SELECT DISTINCT c.client_id, c.first_name, c.last_name
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
JOIN Orders o ON q.quote_id = o.quote_id
JOIN Bills b ON o.order_id = b.order_id
WHERE b.status = 'pending' AND DATEDIFF(CURRENT_DATE(), b.created_at) > 7;

SELECT DISTINCT c.client_id, c.first_name, c.last_name
FROM Clients c
JOIN Quotes q ON c.client_id = q.client_id
JOIN Orders o ON q.quote_id = o.quote_id
JOIN Bills b ON o.order_id = b.order_id
WHERE b.status = 'paid' AND TIMESTAMPDIFF(HOUR, b.created_at, b.updated_at) <= 24;



