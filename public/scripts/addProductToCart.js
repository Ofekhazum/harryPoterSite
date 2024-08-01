document.getElementById('addToCartForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);
    const productId = formData.get('productId');
    const quantity = formData.get('quantity') || 1;
    const price = formData.get('price');
    const category = formData.get('category');
    const size = formData.get('selectedSize') || 'M';
    const productName = formData.get('productName');

    

    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity, price, category, size, productName })
        });

        const data = await response.json();

        if (data.success) {
            alert('Product added to cart!');
        } else {
            alert('Failed to add product to cart.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
});