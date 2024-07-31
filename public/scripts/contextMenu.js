document.addEventListener('DOMContentLoaded', () => {
    const contextMenuButton = document.getElementById('contextMenuButton');
    const contextMenu = document.getElementById('contextMenu');
    const wishlistDropdown = document.getElementById('wishlistDropdown');

    contextMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wishlistDropdown.style.display === 'block') {
            wishlistDropdown.style.display = 'none';
          }
      
        contextMenu.style.display = contextMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    contextMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});