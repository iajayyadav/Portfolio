  // Dark Mode Toggle
  const toggleButton = document.getElementById('dark-mode-toggle');
  const body = document.body;

  // Check and apply user's preference for dark mode
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark');
  }

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark');
    
    // Save the user's preference
    if (body.classList.contains('dark')) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  
toggleButton.addEventListener('click', () => {
document.documentElement.classList.toggle('dark');
});


  const form = document.getElementById('contact-form');
  const thankYouPopup = document.getElementById('thank-you-popup');

  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // stop normal form submit
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        thankYouPopup.classList.remove('hidden');
      } else {
        alert('Oops! Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Oops! Something went wrong. Please try again.');
    }
  });

  function closePopup() {
    thankYouPopup.classList.add('hidden');
  }




  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });




  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

