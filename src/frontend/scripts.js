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

// Function to create table rows dynamically
function createTableRows(data, formatter) {
    return data.map(formatter).join('');
}

// Populate Quotes Table
async function populateQuotes() {
    const quotes = await fetchData('/quotes');
    const quotesTable = document.getElementById('quotes-table');
    if (quotes && quotesTable) {
        quotesTable.innerHTML = createTableRows(quotes, (quote) => `
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
        `);
    } else {
        quotesTable.innerHTML = `<tr><td colspan="7">No quotes available</td></tr>`;
    }
}

// Populate Orders Table
async function populateOrders() {
    const orders = await fetchData('/orders');
    const ordersTable = document.getElementById('orders-table');
    if (orders && ordersTable) {
        ordersTable.innerHTML = createTableRows(orders, (order) => `
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
        `);
    } else {
        ordersTable.innerHTML = `<tr><td colspan="7">No orders available</td></tr>`;
    }
}

// Populate Bills Table
async function populateBills() {
    const bills = await fetchData('/bills');
    const billsTable = document.getElementById('bills-table');
    if (bills && billsTable) {
        billsTable.innerHTML = createTableRows(bills, (bill) => `
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
        `);
    } else {
        billsTable.innerHTML = `<tr><td colspan="6">No bills available</td></tr>`;
    }
}

// Quote Actions
async function rejectQuote(quoteId) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
        await fetchData(`/quotes/${quoteId}/reject`, 'PUT', { rejection_note: reason });
        populateQuotes();
    }
}

async function sendCounterProposal(quoteId) {
    const counterPrice = prompt('Enter counter price:');
    const startDate = prompt('Enter work start date (YYYY-MM-DD):');
    const endDate = prompt('Enter work end date (YYYY-MM-DD):');
    if (counterPrice && startDate && endDate) {
        await fetchData(`/quotes/${quoteId}/counter`, 'PUT', {
            counter_price: counterPrice,
            work_start_date: startDate,
            work_end_date: endDate,
        });
        populateQuotes();
    }
}

async function closeQuote(quoteId) {
    if (confirm('Are you sure you want to close this quote?')) {
        await fetchData(`/quotes/${quoteId}/close`, 'PUT');
        populateQuotes();
    }
}

// Order Actions
async function markOrderCompleted(orderId) {
    if (confirm('Mark this order as completed?')) {
        await fetchData(`/orders/${orderId}/complete`, 'PUT');
        populateOrders();
    }
}

async function generateBill(orderId) {
    const amountDue = prompt('Enter amount due:');
    if (amountDue) {
        await fetchData(`/bills`, 'POST', { order_id: orderId, amount_due: amountDue });
        populateBills();
    }
}

// Bill Actions
async function resolveDispute(billId) {
    const resolutionNote = prompt('Enter resolution note:');
    if (resolutionNote) {
        await fetchData(`/bills/${billId}/resolve`, 'PUT', { admin_note: resolutionNote });
        populateBills();
    }
}

async function markBillPaid(billId) {
    if (confirm('Mark this bill as paid?')) {
        await fetchData(`/bills/${billId}/pay`, 'PUT');
        populateBills();
    }
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateQuotes();
    populateOrders();
    populateBills();
});
