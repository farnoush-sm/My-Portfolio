// Element References
const navbar = document.querySelector('.navbar');
const navLinksMobile = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, header');
const skillCards = document.querySelectorAll('.skill-card');

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const toggleMobileMenu = () => {
  navLinksMobile.classList.toggle('show');
  hamburger.classList.toggle('active');
  document.body.classList.toggle('menu-open');
  document.body.style.overflow = document.body.classList.contains('menu-open')
    ? 'hidden'
    : '';
  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !isExpanded);
};

const updateActiveLink = () => {
  const viewportTop = window.scrollY;
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (viewportTop >= sectionTop - 90 && viewportTop < sectionBottom - 90) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};

// Intersection Observers
const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const progressDiv = entry.target.querySelector('.skill-progress');
        const fill = entry.target.querySelector('.progress-fill');
        const value =
          progressDiv.getAttribute('aria-valuenow') ||
          parseInt(
            entry.target.querySelector('.skill-progress label').textContent
          );

        entry.target.classList.add('visible');
        setTimeout(() => {
          fill.style.width = `${value}%`;
        }, index * 100);

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { rootMargin: '0px 0px -100px 0px', threshold: 0.1 }
);

// Event Listeners
let lastScrollY = window.scrollY;
const debouncedScrollHandler = debounce(() => {
  updateActiveLink();

  if (window.innerWidth <= 768 && !navLinksMobile.classList.contains('show')) {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      navbar.classList.add('hide');
    } else {
      navbar.classList.remove('hide');
    }
  } else {
    navbar.classList.remove('hide');
  }
  lastScrollY = window.scrollY;
}, 100);

if (navbar && navLinksMobile && hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);

  document.body.addEventListener('click', (e) => {
    if (
      navLinksMobile.classList.contains('show') &&
      !navbar.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });

    if (window.innerWidth <= 768) {
      toggleMobileMenu();
    }
  });
});

window.addEventListener('scroll', debouncedScrollHandler);

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (!navbar || !navLinksMobile || !hamburger) {
    console.error('Navbar elements missing:', {
      navbar,
      navLinksMobile,
      hamburger,
    });
    return;
  }
  if (!document.querySelector('#home')) {
    console.error('Home section not found');
  }
  if (skillCards.length === 0) {
    console.warn('No skill cards found');
  }

  document.querySelector('#home')?.classList.add('visible');
  skillCards.forEach((card) => {
    if (
      card.querySelector('.skill-progress') &&
      card.querySelector('.progress-fill')
    ) {
      skillObserver.observe(card);
    } else {
      console.warn('Skill card missing progress elements:', card);
    }
  });
  sections.forEach((section) => sectionObserver.observe(section));
});
