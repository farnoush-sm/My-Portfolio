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

// New Intersection Observer for active nav link
const navLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.4 } // Trigger when 40% of the section is in viewport
);

// Event Listeners
let lastScrollY = window.scrollY;
const debouncedScrollHandler = debounce(() => {
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
  sections.forEach((section) => {
    sectionObserver.observe(section);
    navLinkObserver.observe(section); // Observe sections for nav link updates
  });
});

// Carousel Functionality
const carouselContainer = document.querySelector('.carousel-container');
const carouselTrack = document.querySelector('.carousel-track');
const leftNav = document.querySelector('.left-nav');
const rightNav = document.querySelector('.right-nav');

// Define projects data dynamically (add/remove here as needed)
const projectsData = [
  {
    dataProject: 'portfolio',
    imgSrc: 'images/projects/myPortfolio.png',
    alt: 'Portfolio Website Screenshot',
    title: 'Portfolio Website',
    desc: 'A personal portfolio showcasing skills and projects with responsive design and animations.',
    repoLink: 'https://github.com/farnoush-sm/My-Portfolio.git',
  },
  {
    dataProject: 'helen-cafe',
    imgSrc: 'images/projects/helenCafe.png',
    alt: 'Helen Cafe Screenshot',
    title: 'Helen Cafe',
    desc: 'Responsive e-commerce site prototype with product grids and cart functionality.',
    repoLink: 'https://github.com/farnoush-sm/Helen-Cafe.git',
  },
  {
    dataProject: 'weather-app',
    imgSrc: '', // Assuming no specific image available; triggers placeholder
    alt: 'Weather App Screenshot',
    title: 'Weather App',
    desc: 'Real-time weather fetcher using APIs, with dynamic UI updates.',
    repoLink: 'https://github.com/farnoush-sm/Practice.git',
  },
  {
    dataProject: 'todo-list',
    imgSrc: 'images/projects/toDoList.png',
    alt: 'To Do List Screenshot',
    title: 'To Do List',
    desc: 'A simple, clean to-do list application for task management.',
    repoLink: 'https://github.com/farnoush-sm/myToDoList.git',
  },
  {
    dataProject: 'signup-form',
    imgSrc: 'images/projects/signUp-in.png',
    alt: 'Sign Up/In Form Screenshot',
    title: 'Sign Up/In Form',
    desc: 'A secure user authentication form with input validation, error handling, and responsive layout for seamless sign-up and login experiences.',
    repoLink: 'https://github.com/farnoush-sm/Practice.git',
  },
];

// Create a project card element from data
function createProjectCard(data) {
  const card = document.createElement('div');
  card.classList.add('project-card');
  card.dataset.project = data.dataProject;

  // Use placeholder if imgSrc is missing or empty
  const effectiveImgSrc =
    data.imgSrc && data.imgSrc.trim() !== '' && data.imgSrc !== '#'
      ? data.imgSrc
      : 'images/projects/projectPlaceHolder.png';

  card.innerHTML = `
    <img src="${effectiveImgSrc}" alt="${data.alt}" class="project-image" loading="lazy" />
    <div class="project-content">
      <h3>${data.title}</h3>
      <div class="project-description-wrapper">
        <p class="project-desc">${data.desc}</p>
        <a href="${data.repoLink}" class="project-link btn" target="_blank">View Repository</a>
      </div>
    </div>
  `;

  return card;
}

let items; // Will include clones
let currentIndex;
let itemWidth;
let visibleCount;
let cloneCount;
let isSliding = false; // Prevent multiple slides at once
let slideInterval;
let slideDirection; // 1 for next, -1 for prev
let startX; // For swipe
let isSwiping = false;

// Setup carousel (called on init and resize)
function setupCarousel() {
  // Clear track
  carouselTrack.innerHTML = '';

  // Create original project cards from data
  const originalProjects = projectsData.map(createProjectCard);
  originalProjects.forEach((card) => carouselTrack.appendChild(card));

  // Determine visible count based on screen width
  visibleCount =
    window.innerWidth < 768 ? 1 : window.innerWidth >= 1440 ? 5 : 3;

  // Clone count: Buffer for smooth looping (at least sides +1)
  cloneCount = Math.floor(visibleCount / 2) + 3; // Extra buffer for smoother loops

  // Prepend clones of last items
  for (let i = 0; i < cloneCount; i++) {
    const clone =
      originalProjects[originalProjects.length - 1 - i].cloneNode(true);
    carouselTrack.prepend(clone);
  }

  // Append clones of first items
  for (let i = 0; i < cloneCount; i++) {
    const clone = originalProjects[i].cloneNode(true);
    carouselTrack.appendChild(clone);
  }

  // Update items array
  items = carouselTrack.querySelectorAll('.project-card');

  // Set flex-basis dynamically
  const partialPx = visibleCount === 1 ? 40 : 0;
  const flexBasis =
    visibleCount === 1
      ? `calc(100% - ${partialPx}px)`
      : `calc(100% / ${visibleCount})`;
  items.forEach((item) => {
    item.style.flex = `0 0 ${flexBasis}`;
  });

  // Start at first real item
  currentIndex = cloneCount;

  // Item width (dynamic, based on rendered size)
  itemWidth = items[0].getBoundingClientRect().width;

  // Add click and keyboard listeners for project cards
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('center')) {
        const shift = index - currentIndex;
        moveToIndex(currentIndex + shift);
      }
    });

    // Make project link focusable and handle keyboard interaction
    const link = item.querySelector('.project-link');
    if (link) {
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent default scrolling behavior for Space
          window.open(link.href, '_blank'); // Open the repository link
        }
      });
    }
  });

  // Initial position (no transition)
  carouselTrack.style.transition = 'none';
  updateTransform();
  updateClasses();

  // Restore transition after setup
  setTimeout(() => {
    carouselTrack.style.transition =
      'transform var(--carousel-speed, 0.5s) ease';
  }, 0);

  // Add click listeners for non-center cards
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('center')) {
        const shift = index - currentIndex;
        moveToIndex(currentIndex + shift);
      }
    });
  });
}

// Update track position to center the active item
function updateTransform() {
  const containerWidth = carouselContainer.getBoundingClientRect().width;
  // Calculate offset to center the current item
  const offset = (containerWidth - itemWidth) / 2;
  carouselTrack.style.transform = `translateX(${
    -(currentIndex * itemWidth) + offset
  }px)`;
}

// Update classes for center/prev/next (controls scale, opacity, description)
function updateClasses() {
  items.forEach((item) => {
    item.classList.remove('center', 'prev', 'next');
  });

  // Center
  items[currentIndex].classList.add('center');

  // Sides (always set prev/next even on mobile for opacity)
  const sideCount = visibleCount === 1 ? 1 : Math.floor(visibleCount / 2);
  for (let i = 1; i <= sideCount; i++) {
    if (currentIndex - i >= 0) items[currentIndex - i].classList.add('prev');
    if (currentIndex + i < items.length)
      items[currentIndex + i].classList.add('next');
  }
}

// Move to a new index with animation
function moveToIndex(newIndex) {
  if (isSliding) return;
  isSliding = true;
  currentIndex = newIndex;
  updateTransform();
  updateClasses();
}

// Next slide
function next() {
  moveToIndex(currentIndex + 1);
}

// Previous slide
function prev() {
  moveToIndex(currentIndex - 1);
}

// Handle seamless loop on animation end
carouselTrack.addEventListener('transitionend', (e) => {
  if (e.propertyName !== 'transform') return; // Only handle transform transitions
  const originalLength = projectsData.length;
  if (currentIndex >= originalLength + cloneCount) {
    carouselTrack.style.transition = 'none';
    currentIndex -= originalLength;
    updateTransform();
    updateClasses(); // Reapply classes immediately after reset
    // Force reflow to ensure no visual glitch
    carouselTrack.offsetHeight;
    setTimeout(() => {
      carouselTrack.style.transition =
        'transform var(--carousel-speed, 0.5s) ease';
    }, 0);
  } else if (currentIndex < cloneCount) {
    carouselTrack.style.transition = 'none';
    currentIndex += originalLength;
    updateTransform();
    updateClasses(); // Reapply classes immediately after reset
    // Force reflow to ensure no visual glitch
    carouselTrack.offsetHeight;
    setTimeout(() => {
      carouselTrack.style.transition =
        'transform var(--carousel-speed, 0.5s) ease';
    }, 0);
  }
  isSliding = false;
});

// Continuous sliding on hold
function startSliding(direction) {
  slideDirection = direction;
  slide(); // Immediate slide
  slideInterval = setInterval(slide, 500); // Continuous speed (customizable)
}

function slide() {
  if (slideDirection === 1) next();
  else prev();
}

function stopSliding() {
  clearInterval(slideInterval);
}

// Mouse events for nav areas
leftNav.addEventListener('mousedown', () => startSliding(-1));
rightNav.addEventListener('mousedown', () => startSliding(1));
document.addEventListener('mouseup', stopSliding);
document.addEventListener('mouseleave', stopSliding);

// Touch swipe
carouselContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
  stopSliding(); // Cancel any hold sliding
  carouselTrack.style.transition = 'none'; // For smooth drag
});

carouselContainer.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  const delta = startX - e.touches[0].clientX;
  const containerWidth = carouselContainer.getBoundingClientRect().width;
  const offset = (containerWidth - itemWidth) / 2;
  carouselTrack.style.transform = `translateX(${
    -(currentIndex * itemWidth) + offset - delta
  }px)`;
});

carouselContainer.addEventListener('touchend', (e) => {
  if (!isSwiping) return;
  isSwiping = false;
  const delta = startX - e.changedTouches[0].clientX;
  carouselTrack.style.transition = 'transform var(--carousel-speed, 0.5s) ease';
  if (Math.abs(delta) > 50) {
    // Swipe threshold
    if (delta > 0) next();
    else prev();
  } else {
    updateTransform();
  }
});

// Keyboard navigation (when container focused)
carouselContainer.setAttribute('tabindex', '0'); // Make focusable
carouselContainer.setAttribute('role', 'region');
carouselContainer.setAttribute('aria-label', 'Project carousel');
carouselContainer.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
  e.preventDefault(); // Prevent page scroll
});

// Resize handling (debounced)
const debouncedResize = debounce(setupCarousel, 300);
window.addEventListener('resize', debouncedResize);

// Initialize
setupCarousel();
