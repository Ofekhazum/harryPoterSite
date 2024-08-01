const scrollTopButton = document.getElementById('scrollTopButton');

window.addEventListener('scroll', function() {
  const scrollHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const scrollTop = window.scrollY;

  // Show button only after passing 45% of the page height
  const showButtonAfter = viewportHeight * 0.45;

  if (scrollTop > showButtonAfter) {
    scrollTopButton.style.opacity = 1;
  } else {
    scrollTopButton.style.opacity = 0;
  }
});

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
