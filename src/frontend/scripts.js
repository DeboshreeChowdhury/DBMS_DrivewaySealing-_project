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

// --- Client Registration ---
document.getElementById('registration-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const clientData = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        credit_card_info: document.getElementById('credit-card').value,
        phone_number: document.getElementById('phone').value,
        email: document.getElementById('email').value,
    };

    const response = await fetchData('/clients', 'POST', clientData);

    if (response) {
        alert('Registration successful!');
    } else {
        alert('Error: Registration failed.');
    }
});

// --- Quote Submission ---
document.getElementById('quote-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const property_address = document.getElementById('property-address').value;
    const square_feet = document.getElementById('square-feet').value;
    const proposed_price = document.getElementById('proposed-price').value;
    const note = document.getElementById('note').value;
    const images = Array.from(document.getElementById('images').files).map((file) => file.name); // Mocked image names

    const body = {
        client_id: 1, // Replace with dynamic client ID
        property_address,
        square_feet,
        proposed_price,
        note,
        images,
    };

    const response = await fetchData('/quotes', 'POST', body);

    if (response) {
        alert('Quote submitted successfully!');
        populateClientQuotes(); // Refresh quotes
    } else {
        alert('Error submitting quote. Please try again.');
    }
});

// --- Client Dashboard Functions ---
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
                                ? `<button onclick="acceptQuote(${quote.quote_id})">Accept</button>
                                   <button onclick="resubmitQuote(${quote.quote_id})">Negotiate</button>
                                   <button onclick="closeQuote(${quote.quote_id})">Close</button>`
                                : ''
                        }
                    </td>
                </tr>
            `
            )
            .join('');
    }
}

async function acceptQuote(quoteId) {
    const work_start_date = prompt('Enter work start date (YYYY-MM-DD):');
    const work_end_date = prompt('Enter work end date (YYYY-MM-DD):');
    const agreed_price = prompt('Enter agreed price:');

    const response = await fetchData(`/quotes/${quoteId}/accept`, 'POST', {
        work_start_date,
        work_end_date,
        agreed_price,
    });

    if (response) {
        alert('Quote accepted and order created!');
        populateClientQuotes(); // Refresh quotes table
    }
}

async function resubmitQuote(quoteId) {
    const client_note = prompt('Enter new terms or comments:');
    if (!client_note) return;

    const response = await fetchData(`/quotes/${quoteId}/resubmit`, 'PUT', { client_note });

    if (response) {
        alert('Quote resubmitted successfully!');
        populateClientQuotes();
    }
}

async function closeQuote(quoteId) {
    const response = await fetchData(`/quotes/${quoteId}/close`, 'PUT');
    if (response) {
        alert('Quote closed successfully!');
        populateClientQuotes();
    }
}

// --- Admin Dashboard Functions ---
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

// --- Initialize Dashboards ---
document.addEventListener('DOMContentLoaded', () => {
    populateClientQuotes();
    populateAdminQuotes();
});
