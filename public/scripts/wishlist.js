document.addEventListener('DOMContentLoaded', () => {
    const wishlistButton = document.getElementById('wishlistButton');
    const wishlistDropdown = document.getElementById('wishlistDropdown');
    const contextMenu = document.getElementById('contextMenu');

    wishlistButton.addEventListener('click', (e) => {
      e.stopPropagation();

      if (contextMenu.style.display === 'block') {
        contextMenu.style.display = 'none';
        }   
      wishlistDropdown.style.display = wishlistDropdown.style.display === 'block' ? 'none' : 'block';
    });
  
    document.addEventListener('click', () => {
      wishlistDropdown.style.display = 'none';
    });
  
    wishlistDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

});