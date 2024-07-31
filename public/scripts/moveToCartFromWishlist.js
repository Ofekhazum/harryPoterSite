
document.addEventListener('DOMContentLoaded', () => {
    // Function to handle removing an item from the wishlist
    const handleRemoveFromWishlist = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const productId = formData.get('productId');

        try {
            const removeWishlistResponse = await fetch('/wishlist/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });

            const removeWishlistData = await removeWishlistResponse.json();

            if (removeWishlistData.success) {
                alert('Product removed from wishlist!');
                window.location.reload();
            } else {
                alert('Failed to remove product from wishlist.');
            }

        } catch (error) {
            console.error('Error removing product from wishlist:', error);
            alert('An error occurred while processing your request.');
        }
    };

    // Function to handle adding an item to the cart and removing it from the wishlist
    const handleMoveToCart = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const productId = formData.get('productId');
        const price = formData.get('price');
        const category = formData.get('category');
        const productName = formData.get('productName');

        try {
            const addCartResponse = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity: 1, price, category, size: "S", productName })
            });

            const removeWishlistResponse = await fetch('/wishlist/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });

            const addCartData = await addCartResponse.json();
            const removeWishlistData = await removeWishlistResponse.json();

            if (addCartData.success && removeWishlistData.success) {
                alert('Product added to cart and removed from wishlist!');
                window.location.reload();
            } else {
                alert('Failed to add product to cart or remove from wishlist.');
            }

        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('An error occurred while processing your request.');
        }
    };

    document.querySelectorAll('.remove-from-wishlist-form').forEach(form => {
        form.addEventListener('submit', handleRemoveFromWishlist);
    });

    document.querySelectorAll('[id^="move-to-cart-form"]').forEach(form => {
        form.addEventListener('submit', handleMoveToCart);
    });
});

