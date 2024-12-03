// Base URL for API
const BASE_URL = 'http://localhost:5000/api';


document.getElementById('registration-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const clientData = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        credit_card: document.getElementById('credit-card').value,
        phone_number: document.getElementById('phone').value,
        email: document.getElementById('email').value,
    };

    const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
    });

    if (response.ok) {
        alert('Registration successful!');
    } else {
        alert('Error: Registration failed.');
    }
});

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
document.getElementById('quote-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const property_address = document.getElementById('property-address').value;
    const square_feet = document.getElementById('square-feet').value;
    const proposed_price = document.getElementById('proposed-price').value;
    const note = document.getElementById('note').value;

    const images = Array.from(document.getElementById('images').files).map((file) => file.name); // Adjust as per your backend logic for image handling

    const body = {
        client_id: 1, // Replace with dynamic client ID
        property_address,
        square_feet,
        proposed_price,
        note,
        images,
    };

    const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        alert('Quote submitted successfully!');
    } else {
        alert('Error submitting quote. Please try again.');
    }
});

document.getElementById('counter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const counter_price = document.getElementById('counter-price').value;
    const work_start_date = document.getElementById('work-start-date').value;
    const work_end_date = document.getElementById('work-end-date').value;

    const response = await fetch(`http://localhost:5000/api/quotes/${quoteId}/counter`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counter_price, work_start_date, work_end_date }),
    });

    if (response.ok) {
        alert('Counter-proposal sent successfully!');
        populateAdminQuotes(); // Refresh the quotes list
    } else {
        alert('Error sending counter-proposal.');
    }
});
async function rejectQuote(quoteId) {
    const rejection_note = prompt('Enter the reason for rejection:');
    if (!rejection_note) return;

    const response = await fetch(`http://localhost:5000/api/quotes/${quoteId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_note }),
    });

    if (response.ok) {
        alert('Quote rejected successfully!');
        populateAdminQuotes(); // Refresh the quotes list
    } else {
        alert('Error rejecting quote.');
    }
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
async function acceptQuote(quoteId) {
    const work_start_date = prompt('Enter the start date for the work (YYYY-MM-DD):');
    const work_end_date = prompt('Enter the end date for the work (YYYY-MM-DD):');
    const agreed_price = prompt('Enter the agreed price:');

    const response = await fetch(`/api/quotes/${quoteId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_start_date, work_end_date, agreed_price }),
    });

    if (response.ok) {
        alert('Quote accepted, order created successfully!');
        populateClientQuotes(); // Refresh quotes table
    } else {
        alert('Error accepting quote.');
    }
}
async function resubmitQuote(quoteId) {
    const client_note = prompt('Enter your new terms or comments:');
    if (!client_note) return;

    const response = await fetch(`/api/quotes/${quoteId}/resubmit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_note }),
    });

    if (response.ok) {
        alert('Quote resubmitted successfully!');
        populateClientQuotes(); // Refresh quotes table
    } else {
        alert('Error resubmitting quote.');
    }
}
async function reviseQuote(quoteId) {
    const proposed_price = prompt('Enter the revised price:');
    const work_start_date = prompt('Enter the revised work start date (YYYY-MM-DD):');
    const work_end_date = prompt('Enter the revised work end date (YYYY-MM-DD):');
    const admin_note = prompt('Enter additional notes for the client:');

    const response = await fetch(`/api/quotes/${quoteId}/revise`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposed_price, work_start_date, work_end_date, admin_note }),
    });

    if (response.ok) {
        alert('Quote revised successfully!');
        populateAdminQuotes(); // Refresh the quotes table
    } else {
        alert('Error revising quote.');
    }
}
async function closeQuote(quoteId) {
    const response = await fetch(`/api/quotes/${quoteId}/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        alert('Quote closed successfully!');
        populateAdminQuotes(); // Refresh the quotes table
    } else {
        alert('Error closing quote.');
    }
}
async function fetchClientQuotes() {
    const quotes = await fetchData('/quotes/1'); // Replace with client ID
    if (quotes) {
        document.getElementById('quotes-table').innerHTML = quotes.map(quote => `
            <tr>
                <td>${quote.quote_id}</td>
                <td>${quote.proposed_price}</td>
                <td>${quote.work_start_date}</td>
                <td>${quote.work_end_date}</td>
                <td>${quote.admin_note}</td>
                <td>${quote.status}</td>
                <td>
                    ${quote.status === 'pending' ? `
                        <button onclick="acceptQuote(${quote.quote_id})">Accept</button>
                        <button onclick="resubmitQuote(${quote.quote_id})">Negotiate</button>
                        <button onclick="closeQuote(${quote.quote_id})">Close</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
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
async function payBill(billId) {
    const response = await fetch(`/api/bills/${billId}/pay`, {
        method: 'PUT',
    });
    if (response.ok) alert('Bill paid successfully!');
    populateClientBills(); // Refresh table
}

async function disputeBill(billId) {
    const clientNote = prompt('Enter the reason for dispute:');
    const response = await fetch(`/api/bills/${billId}/dispute`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientNote }),
    });
    if (response.ok) alert('Bill disputed successfully!');
    populateClientBills(); // Refresh table
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
async function resolveDispute(billId) {
    const adminNote = prompt('Enter resolution note or discount:');
    const response = await fetch(`/api/bills/${billId}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote }),
    });
    if (response.ok) alert('Dispute resolved successfully!');
    populateAdminBills(); // Refresh table
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
