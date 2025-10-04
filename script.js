document.addEventListener('DOMContentLoaded', () => {
  // ==========================
  // Elements
  // ==========================
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const hamburger = document.querySelector('.hamburger');
  const navLinksMobile = document.querySelector('.nav-links');
  const skillCards = document.querySelectorAll('.skill-card'); // Animate once

  let lastScrollY = window.scrollY;

  // ==========================================
  // 1. SKILLS BAR OBSERVER (Animate Once)
  // ==========================================
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressDiv = entry.target.querySelector('.skill-progress');
          const fill = entry.target.querySelector('.progress-fill');

          // Recommended: Extract value from a custom data attribute for robustness
          // Fallback to label text if data attribute isn't set
          let value;
          if (progressDiv.hasAttribute('aria-valuenow')) {
            value = progressDiv.getAttribute('aria-valuenow');
          } else {
            // Using the existing label text as a fallback
            const label = entry.target.querySelector('.skill-progress label');
            value = parseInt(label.textContent);
          }

          fill.style.width = value + '%'; // Trigger CSS transition

          observer.unobserve(entry.target); // <-- CRITICAL: Animate only once
        }
      });
    },
    { threshold: 0.5 } // Triggers when 50% of card is visible
  );

  skillCards.forEach((card) => skillObserver.observe(card));

  // ==========================================
  // 2. SECTION SLIDE OBSERVER (Animate Every Time)
  // ==========================================
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If section is visible, add 'visible' to trigger slide
        if (entry.isIntersecting) {
          // We only want the home section to be "visible" on load without animation
          if (entry.target.id === 'home' && window.scrollY === 0) {
            entry.target.classList.add('visible');
          } else {
            // For all other sections, add 'visible' to trigger the slide-in
            entry.target.classList.add('visible');
          }
        } else {
          // CRITICAL: Remove 'visible' when leaving the viewport
          // This resets the section to the 'slide-left' or 'slide-right' state
          // so it can animate again when re-entering.
          entry.target.classList.remove('visible');
        }
      });
    },
    // Root Margin is used to adjust the boundary box.
    // 0.15 threshold is fine, but using rootMargin is often better for sections.
    { rootMargin: '0px 0px -150px 0px', threshold: 0.05 }
  );

  // Start observing all sections
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Ensure 'home' is visible on page load (since it's not a slide animation)
  document.querySelector('#home').classList.add('visible');

  // ==========================
  // Hamburger toggle
  // ==========================
  hamburger.addEventListener('click', () => {
    navLinksMobile.classList.toggle('show');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close hamburger when clicking outside
  document.body.addEventListener('click', (e) => {
    if (
      navLinksMobile.classList.contains('show') &&
      !navbar.contains(e.target)
    ) {
      navLinksMobile.classList.remove('show');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });

  // Smooth scroll & auto-close mobile menu
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });

      // Auto-close menu on mobile click
      if (window.innerWidth <= 768) {
        navLinksMobile.classList.remove('show');
        hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });

  // ==========================
  // Scroll: active link, navbar hide/show
  // ==========================
  window.addEventListener('scroll', () => {
    let current = '';
    const viewportTop = window.scrollY;

    // --- Active link logic ---
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      // Determines the currently active section for the nav highlight
      if (viewportTop >= sectionTop - 90 && viewportTop < sectionBottom - 90) {
        current = section.getAttribute('id');
      }
    });

    // Update active nav link
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // --- Navbar hide/show for mobile ---
    if (window.innerWidth <= 768) {
      // Only hide/show if the mobile menu is NOT open
      if (!navLinksMobile.classList.contains('show')) {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Add > 100 to avoid flicker at top
          navbar.classList.add('hide');
        } else {
          navbar.classList.remove('hide');
        }
      }
      lastScrollY = window.scrollY;
    } else {
      // Ensure desktop always shows navbar
      navbar.classList.remove('hide');
    }
  });
});
