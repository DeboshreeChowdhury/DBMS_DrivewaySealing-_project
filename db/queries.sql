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
