// Sections and nav links
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('.navbar');

let lastScrollY = window.scrollY;

// Scroll event: active link + navbar hide/show
window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 90; // adjust for navbar height
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Navbar hide/show on small screens
  if (window.innerWidth <= 768) {
    if (window.scrollY > lastScrollY) {
      // scrolling down → hide
      navbar.classList.add('hide');
    } else {
      // scrolling up → show
      navbar.classList.remove('hide');
    }
    lastScrollY = window.scrollY;
  } else {
    // always visible on desktop
    navbar.classList.remove('hide');
  }
});

// Smooth scroll for nav links
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// Fade-in sections on scroll
const allSections = document.querySelectorAll('.section');

const observerOptions = {
  threshold: 0.2, // triggers when 20% of section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // optional: only animate once
    }
  });
}, observerOptions);

allSections.forEach((section) => {
  observer.observe(section);
});
