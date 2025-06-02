// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});

// Navigation and Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Handle scroll
  let lastScroll = 0;
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  function updateActiveSection() {
    const scrollY = window.pageYOffset;
    
    // Add/remove scrolled class for navbar
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update active section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
    
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();

  // Mobile menu toggle with animation
  let menuIcon = mobileMenuButton.querySelector('i');
  
  function toggleMobileMenu() {
    const isExpanded = mobileMenu.classList.contains('show');
    mobileMenu.classList.toggle('show');
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    
    // Animate icon
    if (!isExpanded) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-times');
      menuIcon.style.transform = 'rotate(90deg)';
    } else {
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
      menuIcon.style.transform = 'rotate(0deg)';
    }
  }

  mobileMenuButton.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target) && mobileMenu.classList.contains('show')) {
      toggleMobileMenu();
    }
  });

  // Close mobile menu when window is resized to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('show')) {
      toggleMobileMenu();
    }
  });

  // Theme toggle with enhanced animation
  themeToggle.addEventListener('click', () => {
    const icon = themeToggle.querySelector('i');
    icon.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
      html.classList.toggle('dark');
      const isDark = html.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
      icon.style.transform = 'rotate(0deg)';
    }, 150);
  });

  // Set initial theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.add('dark');
    updateThemeIcon(true);
  }

  // Update theme icon with transition
  function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Smooth scroll for navigation links with offset
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Close mobile menu if open
        if (mobileMenu.classList.contains('show')) {
          toggleMobileMenu();
        }
        
        // Calculate offset for fixed header
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Progress bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');
const notificationToast = document.getElementById('notification-toast');

// Form validation
const validateField = (field) => {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = document.getElementById(`${fieldName}-error`);
  const formGroup = field.closest('.form-group');
  
  let isValid = true;
  let errorMessage = '';

  switch (fieldName) {
    case 'name':
      if (!value) {
        isValid = false;
        errorMessage = 'Name is required';
      } else if (value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
      break;

    case 'subject':
      if (!value) {
        isValid = false;
        errorMessage = 'Subject is required';
      } else if (value.length < 5) {
        isValid = false;
        errorMessage = 'Subject must be at least 5 characters long';
      }
      break;

    case 'message':
      if (!value) {
        isValid = false;
        errorMessage = 'Message is required';
      } else if (value.length < 20) {
        isValid = false;
        errorMessage = 'Message must be at least 20 characters long';
      }
      break;
  }

  if (!isValid) {
    formGroup.classList.add('error');
    errorElement.textContent = errorMessage;
  } else {
    formGroup.classList.remove('error');
    errorElement.textContent = '';
  }

  return isValid;
};

// Real-time validation
const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
formInputs.forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.closest('.form-group').classList.contains('error')) {
      validateField(input);
    }
  });
});

// Show notification
const showNotification = (message, type = 'success') => {
  const notificationIcon = notificationToast.querySelector('.notification-icon');
  const notificationMessage = notificationToast.querySelector('.notification-message');

  notificationToast.className = 'notification-toast';
  notificationToast.classList.add(type);
  
  notificationIcon.className = 'notification-icon';
  notificationIcon.classList.add(type === 'success' ? 'fas' : 'fas');
  notificationIcon.classList.add(type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
  
  notificationMessage.textContent = message;
  notificationToast.classList.add('show');

  setTimeout(() => {
    notificationToast.classList.remove('show');
  }, 5000);
};

// Close notification
const notificationClose = notificationToast.querySelector('.notification-close');
notificationClose.addEventListener('click', () => {
  notificationToast.classList.remove('show');
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const isValid = Array.from(formInputs).every(input => validateField(input));

  if (!isValid) {
    showNotification('Please fix the errors in the form', 'error');
    return;
  }

  // Show loading state
  submitButton.classList.add('loading');
  submitButton.disabled = true;

  // Collect form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  try {
    // Simulate API call (replace with your actual API endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Success
    showNotification('Message sent successfully! I will get back to you soon.');
    contactForm.reset();
    
    // Remove loading state
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  } catch (error) {
    // Error
    showNotification('Failed to send message. Please try again later.', 'error');
    
    // Remove loading state
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  }
});

// Add hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.tech-tag').style.transform = 'translateY(-2px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.querySelector('.tech-tag').style.transform = 'translateY(0)';
  });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => lazyImageObserver.observe(img));
  }
});

// Project Filters
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const category = button.textContent.toLowerCase();
    
    projectCards.forEach(card => {
      const cardCategory = card.querySelector('.project-category').textContent.toLowerCase();
      
      // Show all projects if "All" is selected
      if (category === 'all') {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100);
      } else {
        // Show/hide projects based on category
        if (cardCategory.includes(category)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }
    });
  });
});

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
});

// Education Timeline Animation
const educationCards = document.querySelectorAll('.education-card');

const showEducationCard = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
};

const educationObserver = new IntersectionObserver(showEducationCard, {
  threshold: 0.3,
  rootMargin: '0px'
});

educationCards.forEach(card => {
  educationObserver.observe(card);
});

// Add hover effect for achievement tags
document.querySelectorAll('.achievement-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    const icon = tag.querySelector('i');
    icon.style.transform = 'scale(1.2) rotate(10deg)';
  });
  
  tag.addEventListener('mouseleave', () => {
    const icon = tag.querySelector('i');
    icon.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Scroll Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');

// Hide scroll indicator when scrolling down
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollIndicator.classList.add('hide');
  } else {
    scrollIndicator.classList.remove('hide');
  }
});

// Smooth scroll to next section when clicking scroll indicator
scrollIndicator.addEventListener('click', () => {
  const heroSection = document.querySelector('.hero');
  const nextSection = heroSection.nextElementSibling;
  
  if (nextSection) {
    const offset = 80; // Adjust this value based on your navbar height
    const targetPosition = nextSection.offsetTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
});

// Typing Animation
const typingElement = document.querySelector('.typing-animation');
const phrases = [
  
  'Web Developer',
  'Python Developer',
  'SQL Developer',
  'DSA enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isWaiting = false;

function type() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    // Remove characters
    typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add characters
    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  // Typing speed
  let typeSpeed = isDeleting ? 50 : 100;

  // If word is complete
  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end of word
    isWaiting = true;
    typeSpeed = 2000; // Wait 2 seconds
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500; // Wait 0.5 seconds before typing next word
  }

  setTimeout(type, typeSpeed);
}

// Start the typing animation when the page loads
document.addEventListener('DOMContentLoaded', function() {
  if (typingElement) {
    setTimeout(type, 1000); // Start after 1 second
  }
});

// Animate skill progress bars when they come into view
function initSkillsAnimation() {
  const skillItems = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const level = progressBar.closest('.skill-item').querySelector('.skill-level').textContent;
        progressBar.classList.add('animate');
        progressBar.querySelector('.progress-bar').style.setProperty('--progress-width', level);
        observer.unobserve(progressBar);
      }
    });
  }, {
    threshold: 0.5
  });

  skillItems.forEach(item => observer.observe(item));
}

// Initialize skills animation
document.addEventListener('DOMContentLoaded', () => {
  initSkillsAnimation();
});

