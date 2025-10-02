// ==========================
// Declarations
// ==========================
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

// ==========================
// Functions
// ==========================

// Update active nav link
function updateActiveNav() {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 90;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`)
      link.classList.add('active');
  });
}

// Hide/show navbar on small screens
function handleNavbar() {
  if (window.innerWidth <= 768) {
    if (window.scrollY > lastScrollY) {
      navbar.classList.add('hide'); // scrolling down → hide
    } else {
      navbar.classList.remove('hide'); // scrolling up → show
    }
  } else {
    navbar.classList.remove('hide'); // always visible on desktop
  }
}

// Animate sections on scroll (desktop + mobile)
function animateSections() {
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    const sectionHeight = section.offsetHeight;
    const visibleThreshold = sectionHeight * 0.3; // trigger when 30% visible

    const isVisible =
      sectionBottom > viewportTop + visibleThreshold &&
      sectionTop < viewportBottom - visibleThreshold;

    if (window.innerWidth <= 768) {
      sections.forEach((section) => section.classList.add('visible'));
    }

    if (window.innerWidth > 768) {
      if (isVisible) {
        // Only animate if section is visible
        section.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateX(0) translateY(0)';
      } else {
        // Hide section when out of viewport
        section.style.opacity = '0';
        if (section.classList.contains('slide-left')) {
          section.style.transform = 'translateX(-50px)';
        } else if (section.classList.contains('slide-right')) {
          section.style.transform = 'translateX(50px)';
        } else {
          section.style.transform = 'translateY(50px)';
        }
      }
    } else {
      // Mobile: fade-in once
      if (isVisible) section.classList.add('visible');
    }
  });
}

// Smooth scroll for nav links
function smoothScroll() {
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ==========================
// Event Listeners
// ==========================
window.addEventListener('scroll', () => {
  updateActiveNav();
  handleNavbar();
  animateSections();
});

// Initialize smooth scrolling
smoothScroll();
