// Base URL for API
const BASE_URL = 'http://localhost:5000/api';

// Utility function to fetch data from the API
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

// --- Client Dashboard Functions ---

// Submit a new quote
if (document.getElementById('quote-form')) {
    document.getElementById('quote-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const property_address = document.getElementById('property-address').value;
        const square_feet = document.getElementById('square-feet').value;
        const proposed_price = document.getElementById('proposed-price').value;
        const note = document.getElementById('note').value;

        const body = {
            client_id: 1, // Replace with dynamic client ID
            property_address,
            square_feet,
            proposed_price,
            note,
        };

        const result = await fetchData('/quotes', 'POST', body);
        if (result) alert('Quote submitted successfully!');
    });
}

// Populate client quotes
async function populateClientQuotes() {
    const tableBody = document.getElementById('quotes-table');
    if (!tableBody) return;

    const quotes = await fetchData('/quotes/1'); // Replace 1 with dynamic client ID
    if (quotes) {
        tableBody.innerHTML = quotes
            .map(
                (quote) => `
                <tr>
                    <td>${quote.quote_id}</td>
                    <td>${quote.property_address}</td>
                    <td>${quote.square_feet}</td>
                    <td>${quote.proposed_price}</td>
                    <td>${quote.status}</td>
                    <td>
                        ${
                            quote.status === 'pending'
                                ? `<button onclick="cancelQuote(${quote.quote_id})">Cancel</button>`
                                : ''
                        }
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

// Cancel a quote
async function cancelQuote(quoteId) {
    const result = await fetchData(`/quotes/${quoteId}/status`, 'PUT', { status: 'rejected' });
    if (result) {
        alert('Quote canceled successfully!');
        populateClientQuotes();
    }
}

// Populate client orders
async function populateClientOrders() {
    const tableBody = document.getElementById('orders-table');
    if (!tableBody) return;

    const orders = await fetchData('/orders');
    if (orders) {
        tableBody.innerHTML = orders
            .map(
                (order) => `
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.property_address}</td>
                    <td>${order.work_start_date}</td>
                    <td>${order.work_end_date}</td>
                    <td>${order.status}</td>
                    <td>${order.agreed_price}</td>
                </tr>
            `
            )
            .join('');
    }
}

// Populate client bills
async function populateClientBills() {
    const tableBody = document.getElementById('bills-table');
    if (!tableBody) return;

    const bills = await fetchData('/bills');
    if (bills) {
        tableBody.innerHTML = bills
            .map(
                (bill) => `
                <tr>
                    <td>${bill.bill_id}</td>
                    <td>${bill.order_id}</td>
                    <td>${bill.amount_due}</td>
                    <td>${bill.status}</td>
                    <td>
                        ${
                            bill.status === 'pending'
                                ? `<button onclick="payBill(${bill.bill_id})">Pay</button>
                                   <button onclick="disputeBill(${bill.bill_id})">Dispute</button>`
                                : ''
                        }
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

// Pay a bill
async function payBill(billId) {
    const result = await fetchData(`/bills/${billId}/status`, 'PUT', { status: 'paid' });
    if (result) {
        alert('Bill paid successfully!');
        populateClientBills();
    }
}

// Dispute a bill
async function disputeBill(billId) {
    const note = prompt('Enter the reason for dispute:');
    if (!note) return;
    const result = await fetchData(`/bills/${billId}/status`, 'PUT', { status: 'disputed', note });
    if (result) {
        alert('Bill disputed successfully!');
        populateClientBills();
    }
}

// --- Admin Dashboard Functions ---

// Populate admin quotes
async function populateAdminQuotes() {
    const tableBody = document.getElementById('admin-quotes-table');
    if (!tableBody) return;

    const quotes = await fetchData('/quotes');
    if (quotes) {
        tableBody.innerHTML = quotes
            .map(
                (quote) => `
                <tr>
                    <td>${quote.quote_id}</td>
                    <td>${quote.property_address}</td>
                    <td>${quote.square_feet}</td>
                    <td>${quote.proposed_price}</td>
                    <td>${quote.status}</td>
                    <td>
                        ${
                            quote.status === 'pending'
                                ? `<button onclick="approveQuote(${quote.quote_id})">Approve</button>
                                   <button onclick="rejectQuote(${quote.quote_id})">Reject</button>`
                                : ''
                        }
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

// Approve a quote
async function approveQuote(quoteId) {
    const result = await fetchData(`/quotes/${quoteId}/status`, 'PUT', { status: 'agreed' });
    if (result) {
        alert('Quote approved successfully!');
        populateAdminQuotes();
    }
}

// Reject a quote
async function rejectQuote(quoteId) {
    const result = await fetchData(`/quotes/${quoteId}/status`, 'PUT', { status: 'rejected' });
    if (result) {
        alert('Quote rejected successfully!');
        populateAdminQuotes();
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    populateClientQuotes();
    populateClientOrders();
    populateClientBills();
    populateAdminQuotes();
});
