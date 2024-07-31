document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.querySelector('.checkout-link button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', (event) => {
            event.preventDefault();

            const isLoggedIn = document.body.dataset.isLoggedIn !== "";

            if (isLoggedIn) {
                window.location.href = '/checkout';
            } else {
                const proceedAsGuest = confirm('You are not logged in. Do you want to continue as a guest or log in? Click "OK" to continue as a guest, or "Cancel" to log in.');

                if (proceedAsGuest) {
                    // Proceed as guest
                    window.location.href = '/checkout';
                } else {
                    // Redirect to login page
                    window.location.href = '/login';
                }
            }
        });
    }
});
