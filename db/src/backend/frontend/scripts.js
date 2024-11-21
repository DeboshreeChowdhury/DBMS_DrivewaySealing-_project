document.getElementById('quoteForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        client_id: 1, // Replace with dynamic client ID if available
        property_address: document.getElementById('property_address').value,
        square_feet: document.getElementById('square_feet').value,
        proposed_price: document.getElementById('proposed_price').value,
        note: document.getElementById('note').value
    };

    const response = await fetch('http://localhost:5000/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    alert(result.message);
});
