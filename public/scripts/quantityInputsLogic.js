document.getElementById('decreaseQuantity').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

document.getElementById('increaseQuantity').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value < parseInt(quantityInput.max)) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
});