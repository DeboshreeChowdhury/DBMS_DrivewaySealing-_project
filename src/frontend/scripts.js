const BASE_URL = 'http://localhost:5000/api';

// Utility function for fetching data
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
        console.error('Fetch Error:', error.message);
        alert('An error occurred while fetching data.');
        return null; // Ensure calling functions handle null
    }
}

// Utility to update table rows dynamically
function updateTableRows(tableId, data, formatter, emptyMessage) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with ID "${tableId}" not found.`);
        return;
    }

    if (Array.isArray(data) && data.length > 0) {
        table.innerHTML = data.map(formatter).join('');
    } else {
        table.innerHTML = `<tr><td colspan="100%">${emptyMessage}</td></tr>`;
    }
}

// --- Client Dashboard Functions ---
// Client Registration
document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        credit_card_info: document.getElementById('credit-card').value,
        phone_number: document.getElementById('phone').value,
        email: document.getElementById('email').value,
    };
    const result = await fetchData('/clients', 'POST', formData);
    if (result) {
        alert(result.message);
        e.target.reset();
    }
});

// Submit a Quote
document.getElementById('quote-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const imagesInput = document.getElementById('images');
    const files = imagesInput.files;

    if (files.length !== 5) {
        const errorElement = document.getElementById('image-error');
        errorElement.style.display = 'block';
        return;
    }

    const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file)); // Use URL.createObjectURL as placeholder

    const quoteData = {
        client_id: document.getElementById('client-id').value,
        property_address: document.getElementById('property-address').value,
        square_feet: document.getElementById('square-feet').value,
        proposed_price: document.getElementById('proposed-price').value,
        note: document.getElementById('note').value,
        images: imageUrls, // Send array of image URLs
    };

    const response = await fetchData('/quotes', 'POST', quoteData);

    if (response) {
        alert('Quote submitted successfully!');
        populateQuotes(); // Refresh quotes table
    }
});

// Populate Quotes Table
// Update "View My Quotes" table with action buttons
async function populateQuotes() {
    const quotes = await fetchData(`/quotes/${clientId}`); // Pass client ID dynamically
    updateTableRows(
        'quotes-table',
        quotes,
        (quote) => `
            <tr>
                <td>${quote.quote_id}</td>
                <td>${quote.property_address}</td>
                <td>${quote.square_feet}</td>
                <td>${quote.proposed_price}</td>
                <td>${quote.status}</td>
                <td>
                    ${quote.status === 'pending' ? `
                        <button onclick="cancelQuote(${quote.quote_id})">Cancel</button>
                        <button onclick="negotiateQuote(${quote.quote_id})">Negotiate</button>
                    ` : ''}
                    ${quote.status === 'counter_proposed' ? `
                        <button onclick="acceptQuote(${quote.quote_id})">Accept</button>
                    ` : ''}
                </td>
            </tr>
        `,
        'No quotes available'
    );
}

document.getElementById('quote-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const quoteData = {
        client_id: document.getElementById('client-id').value,
        property_address: document.getElementById('property-address').value,
        square_feet: document.getElementById('square-feet').value,
        proposed_price: document.getElementById('proposed-price').value,
        note: document.getElementById('note').value,
    };

    const response = await fetchData('/quotes', 'POST', quoteData);

    if (response) {
        alert('Quote submitted successfully!');
        populateQuotes();
    }
});
// Cancel a Quote
async function cancelQuote(quoteId) {
    if (confirm('Are you sure you want to cancel this quote?')) {
        try {
            const response = await fetchData(`/quotes/${quoteId}/cancel`, 'PUT');
            if (response) {
                alert('Quote canceled successfully.');
                populateQuotes(); // Refresh quotes
            }
        } catch (error) {
            console.error('Error canceling quote:', error.message);
        }
    }
}

// Negotiate a Quote
async function negotiateQuote(quoteId) {
    const counterPrice = prompt('Enter your counter-proposed price:');
    const note = prompt('Add any additional notes for negotiation:');
    if (counterPrice) {
        try {
            const response = await fetchData(`/quotes/${quoteId}/negotiate`, 'PUT', {
                counter_price: counterPrice,
                note: note || '',
            });
            if (response) {
                alert('Negotiation request sent successfully.');
                populateQuotes(); // Refresh quotes
            }
        } catch (error) {
            console.error('Error negotiating quote:', error.message);
        }
    }
}

// Accept a Quote
async function acceptQuote(quoteId) {
    if (confirm('Are you sure you want to accept this quote?')) {
        try {
            const response = await fetchData(`/quotes/${quoteId}/accept`, 'PUT');
            if (response) {
                alert('Quote accepted successfully.');
                populateQuotes(); // Refresh quotes
            }
        } catch (error) {
            console.error('Error accepting quote:', error.message);
        }
    }
}
// --- Admin Dashboard Functions ---
// Populate Orders Table
async function populateOrders() {
    const orders = await fetchData('/orders');
    updateTableRows(
        'orders-table',
        orders ? orders.orders : [],
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
        `,
        'No orders available.'
    );
}
async function sendCounterProposal(quoteId) {
    const counterPrice = prompt('Enter counter price:');
    const startDate = prompt('Enter work start date (YYYY-MM-DD):');
    const endDate = prompt('Enter work end date (YYYY-MM-DD):');
    const adminNote = prompt('Enter additional comments:');

    if (counterPrice && startDate && endDate && adminNote) {
        await fetchData(`/quotes/${quoteId}/counter`, 'PUT', {
            counter_price: counterPrice,
            work_start_date: startDate,
            work_end_date: endDate,
            admin_note: adminNote,
        });
        populateQuotes();
    }
}

async function rejectQuote(quoteId) {
    const rejectionNote = prompt('Enter rejection reason:');
    if (rejectionNote) {
        await fetchData(`/quotes/${quoteId}/reject`, 'PUT', { rejection_note: rejectionNote });
        populateQuotes();
    }
}

// Populate Bills Table
async function populateBills() {
    const bills = await fetchData('/bills');
    updateTableRows(
        'bills-table',
        bills ? bills.bills : [],
        (bill) => `
            <tr>
                <td>${bill.bill_id}</td>
                <td>${bill.order_id}</td>
                <td>${bill.client_name}</td>
                <td>${bill.amount_due}</td>
                <td>${bill.status}</td>
                <td>
                    ${bill.status === 'pending' ? `
                        <button onclick="markBillPaid(${bill.bill_id})">Mark as Paid</button>
                        <button onclick="resolveDispute(${bill.bill_id})">Resolve</button>
                    ` : ''}
                </td>
            </tr>
        `,
        'No bills available.'
    );
}

// Mark Order as Completed
async function markOrderCompleted(orderId) {
    if (confirm('Mark this order as completed?')) {
        const result = await fetchData(`/orders/${orderId}/complete`, 'PUT');
        if (result) {
            alert(result.message);
            populateOrders();
        }
    }
}

// Generate Bill
async function generateBill(orderId) {
    const amountDue = prompt('Enter the amount due:');
    if (amountDue) {
        const result = await fetchData('/bills', 'POST', { order_id: orderId, amount_due: amountDue });
        if (result) {
            alert(result.message);
            populateBills();
        }
    }
}

// Mark Bill as Paid
async function markBillPaid(billId) {
    if (confirm('Mark this bill as paid?')) {
        const result = await fetchData(`/bills/${billId}/pay`, 'PUT');
        if (result) {
            alert(result.message);
            populateBills();
        }
    }
}

// Resolve Dispute
async function resolveDispute(billId) {
    const resolutionNote = prompt('Enter resolution note:');
    if (resolutionNote) {
        const result = await fetchData(`/bills/${billId}/resolve`, 'PUT', { admin_note: resolutionNote });
        if (result) {
            alert(result.message);
            populateBills();
        }
    }
}

// Initialize Dashboards
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quotes-table')) populateQuotes();
    if (document.getElementById('orders-table')) populateOrders();
    if (document.getElementById('bills-table')) populateBills();
});
