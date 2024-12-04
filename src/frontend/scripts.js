const BASE_URL = 'http://localhost:5000/api';

// Utility function to fetch data
async function fetchData(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred. Please try again.');
    }
}

// Populate Quotes Table
async function populateQuotes() {
    const quotes = await fetchData('/quotes');
    const quotesTable = document.getElementById('quotes-table');
    if (quotes && quotesTable) {
        quotesTable.innerHTML = quotes
            .map(
                (quote) => `
                <tr>
                    <td>${quote.quote_id}</td>
                    <td>${quote.client_name}</td>
                    <td>${quote.property_address}</td>
                    <td>${quote.square_feet}</td>
                    <td>${quote.proposed_price}</td>
                    <td>${quote.status}</td>
                    <td>
                        ${quote.status === 'pending' ? `
                            <button onclick="rejectQuote(${quote.quote_id})">Reject</button>
                            <button onclick="sendCounterProposal(${quote.quote_id})">Counter</button>
                        ` : ''}
                        ${quote.status === 'counter_proposed' ? `
                            <button onclick="closeQuote(${quote.quote_id})">Close</button>
                        ` : ''}
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

// Populate Orders Table
async function populateOrders() {
    const orders = await fetchData('/orders');
    const ordersTable = document.getElementById('orders-table');
    if (orders && ordersTable) {
        ordersTable.innerHTML = orders
            .map(
                (order) => `
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.client_name}</td>
                    <td>${order.property_address}</td>
                    <td>${order.work_start_date}</td>
                    <td>${order.work_end_date}</td>
                    <td>${order.status}</td>
                    <td>
                        ${order.status === 'scheduled' ? `
                            <button onclick="markOrderCompleted(${order.order_id})">Complete</button>
                            <button onclick="generateBill(${order.order_id})">Generate Bill</button>
                        ` : ''}
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

// Populate Bills Table
async function populateBills() {
    const bills = await fetchData('/bills');
    const billsTable = document.getElementById('bills-table');
    if (bills && billsTable) {
        billsTable.innerHTML = bills
            .map(
                (bill) => `
                <tr>
                    <td>${bill.bill_id}</td>
                    <td>${bill.order_id}</td>
                    <td>${bill.client_name}</td>
                    <td>${bill.amount_due}</td>
                    <td>${bill.status}</td>
                    <td>
                        ${bill.status === 'pending' ? `
                            <button onclick="resolveDispute(${bill.bill_id})">Resolve</button>
                            <button onclick="markBillPaid(${bill.bill_id})">Mark as Paid</button>
                        ` : ''}
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateQuotes();
    populateOrders();
    populateBills();
});
