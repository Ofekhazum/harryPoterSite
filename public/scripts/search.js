
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("searchModal");
    const btn = document.querySelector(".search-icon");
    const span = document.getElementsByClassName("close")[0];
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');

    const closeModal = () => {
        modal.style.display = "none";
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    };

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        closeModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    const debounce = (func, delay) => {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };
        
    const fetchProducts = async (query) => {
        const response = await fetch(`/search?query=${query}`);
        const products = await response.json();
        displayResults(products);
    };


    const displayResults = (products) => {
        resultsContainer.innerHTML = '';

        if (products.length > 0) {

            products.forEach(product => {
            const productRow = document.createElement('div');
            productRow.classList.add('product-row');
            productRow.innerHTML = `
                <div class="search-product-image"><img src="${product.image_url}" alt="${product.item_name}"></div>
                <div class="product-details">
                    <h2>${product.item_name}</h2>
                    <p>Price: £${product.price}</p>
                    <p>${product.item_description}</p>
                </div>
            `;
            productRow.style.cursor = 'pointer';
            productRow.addEventListener('click', () => {
                window.location.href = `/product/${product.item_id}`;
            });
            resultsContainer.appendChild(productRow);
            });
        } else {
            resultsContainer.innerHTML = '<p class="no-products">No products found</p>';
        }
    };

    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value;
        if (query.length > 0) {
            fetchProducts(query);
        } else {
            resultsContainer.innerHTML = '<p class="no-products">No products found</p>';
        }
    }, 300));
});
