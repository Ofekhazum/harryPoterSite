

function updatePriceValue(value) {
    document.getElementById('priceValue').textContent = `£0 - £${value}`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const priceInput = document.getElementById('price');
    updatePriceValue(priceInput.value);
  });
  
document.querySelectorAll('.filter-list li').forEach(item => {
    item.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
      this.classList.add('selected');
      
      const input = parent.nextElementSibling;
      input.value = this.getAttribute('data-value');
    });
  });

  document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const url = new URL(form.action);
    const params = new URLSearchParams(new FormData(form));
    window.location.href = `products-catalog?${params.toString()}`;
  });

  document.getElementById('reset-filter').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = `products-catalog`;
  });

