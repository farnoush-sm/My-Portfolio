// ==========================
// Elements
// ==========================
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navLinksMobile = document.querySelector('.nav-links');

let lastScrollY = window.scrollY;

// ==========================
// Hamburger toggle
// ==========================
hamburger.addEventListener('click', () => {
  navLinksMobile.classList.toggle('show');
  hamburger.classList.toggle('active');
});

// Smooth scroll & auto-close mobile menu
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });

    if (window.innerWidth <= 768) {
      navLinksMobile.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });
});

// ==========================
// Scroll: active link, navbar hide/show, section animation
// ==========================
window.addEventListener('scroll', () => {
  let current = '';
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    // Active link
    if (viewportTop >= sectionTop - 90 && viewportTop < sectionBottom - 90) {
      current = section.getAttribute('id');
    }

    // Section animation (desktop only)
    if (window.innerWidth > 768) {
      if (
        sectionBottom > viewportTop + 100 &&
        sectionTop < viewportBottom - 100
      ) {
        section.classList.add('visible');
      } else {
        section.classList.remove('visible');
      }
    } else {
      // Mobile: always visible
      section.classList.add('visible');
    }
  });

  // Update active nav link
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Navbar hide/show for mobile
  if (window.innerWidth <= 768) {
    if (window.scrollY > lastScrollY) {
      navbar.classList.add('hide');
    } else {
      navbar.classList.remove('hide');
    }
    lastScrollY = window.scrollY;
  } else {
    navbar.classList.remove('hide');
  }
});
