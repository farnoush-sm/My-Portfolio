// Element References
const navbar = document.querySelector('.navbar');
const navLinksMobile = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, header');
const skillCards = document.querySelectorAll('.skill-card');
const projectCarousel = document.querySelector('.project-carousel');
const projectCards = document.querySelectorAll('.project-card');
const carouselArrows = document.querySelectorAll('.carousel-arrow');

// Utility Functions
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

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const updateCenterCard = () => {
  if (!projectCarousel) return;

  const carouselRect = projectCarousel.getBoundingClientRect();
  const carouselCenter = carouselRect.left + carouselRect.width / 2;

  let closestCard = null;
  let minDistance = Infinity;

  projectCards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(cardCenter - carouselCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestCard = card;
    }
  });

  projectCards.forEach((card) => {
    card.classList.toggle('center', card === closestCard);
  });
};

const scrollCarousel = (direction) => {
  if (!projectCarousel) return;
  const cardWidth = projectCards[0]?.getBoundingClientRect().width || 250;
  const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
  projectCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
};

const debouncedUpdateCenterCard = debounce(updateCenterCard, 100);

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
        if (entry.target.id === 'home' && window.scrollY === 0) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.add('visible');
        }
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },
  { rootMargin: '0px 0px -150px 0px', threshold: 0.05 }
);

// Event Listeners
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

window.addEventListener('scroll', debouncedScrollHandler);

if (projectCarousel) {
  projectCarousel.addEventListener('scroll', debouncedUpdateCenterCard);
  window.addEventListener('resize', debouncedUpdateCenterCard);
  carouselArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const direction = arrow.classList.contains('left') ? 'left' : 'right';
      scrollCarousel(direction);
    });
  });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (!navbar || !navLinksMobile || !hamburger) {
    console.warn('One or more navbar elements not found');
    return;
  }
  if (!projectCarousel || projectCards.length === 0) {
    console.warn('Project carousel or cards not found');
  }

  document.querySelector('#home')?.classList.add('visible');
  skillCards.forEach((card) => skillObserver.observe(card));
  sections.forEach((section) => sectionObserver.observe(section));
  updateCenterCard();
});
