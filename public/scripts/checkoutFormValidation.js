document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    const form = event.target;
    if (!form.checkValidity()) {
        event.preventDefault();
        alert('Please fill out all required fields.');
    }
});