/**
 * Etincelle Website - Enhanced Animations & Interactions
 * Modern, elegant animations with smooth micro-interactions
 */

// ==========================================================================
// Enhanced Scroll Animations with Intersection Observer
// ==========================================================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class with slight delay for stagger effect
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    '.fade-up, .fade-in, .scale-in, .slide-left, .slide-right, .blur-in, [data-animate]'
  );
  animatedElements.forEach(el => animationObserver.observe(el));

  // Observe stagger containers
  const staggerContainers = document.querySelectorAll('.stagger');
  staggerContainers.forEach(container => {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate children
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);
    staggerObserver.observe(container);
  });
}

// ==========================================================================
// Navigation - Always visible, background on scroll
// ==========================================================================
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;

        // Add background on scroll
        if (currentScroll > 50) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ==========================================================================
// Enhanced FAQ Accordion with Smooth Animation
// ==========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const answerInner = item.querySelector('.faq__answer-inner');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items with animation
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq__answer');
          otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answerInner.offsetHeight + 'px';
      }
    });
  });
}

// ==========================================================================
// Counter Animation with Easing
// ==========================================================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.floor(easedProgress * target);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCounter(entry.target, target, 2500);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ==========================================================================
// Magnetic Button Effect
// ==========================================================================
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
}

// ==========================================================================
// Services Tabs with Smooth Transitions (Claura-style)
// ==========================================================================
function initServicesTabs() {
  const tabList = document.querySelector('.services__tab-list');
  const tabs = document.querySelectorAll('.services__tab');
  const panels = document.querySelectorAll('.services__tab-panel');
  const indicator = document.querySelector('.services__tab-indicator');

  if (!tabList || !tabs.length || !indicator) return;

  // Position indicator on the active tab
  function moveIndicator(tab) {
    const tabRect = tab.getBoundingClientRect();
    const listRect = tabList.getBoundingClientRect();
    const offsetTop = tab.offsetTop;

    indicator.style.transform = `translateY(${offsetTop}px)`;
    indicator.style.height = `${tab.offsetHeight}px`;
  }

  // Initialize indicator position
  const activeTab = document.querySelector('.services__tab.active');
  if (activeTab) {
    // Set initial position without animation
    indicator.style.transition = 'none';
    moveIndicator(activeTab);
    // Re-enable animation after initial position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        indicator.style.transition = '';
      });
    });
  }

  // Handle tab hover (activate on hover instead of click)
  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => {
      const tabId = tab.dataset.tab;
      const currentPanel = document.querySelector('.services__tab-panel.active');
      const newPanel = document.getElementById(tabId);

      if (currentPanel === newPanel) return;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Move indicator
      moveIndicator(tab);

      // Smooth crossfade - just swap active class
      if (currentPanel) {
        currentPanel.classList.remove('active');
      }
      if (newPanel) {
        newPanel.classList.add('active');
      }
    });
  });

  // Update indicator on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const activeTab = document.querySelector('.services__tab.active');
      if (activeTab) {
        moveIndicator(activeTab);
      }
    }, 100);
  });
}

// ==========================================================================
// Parallax Effect for Visual Elements
// ==========================================================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero__gradient-shape, .gradient-blob');

  if (parallaxElements.length === 0) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
          const speed = 0.3;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ==========================================================================
// Hover Tilt Effect for Cards
// ==========================================================================
function initTiltEffect() {
  const cards = document.querySelectorAll('.team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

// ==========================================================================
// Cursor Glow Effect (subtle)
// ==========================================================================
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 107, 74, 0.06), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

// ==========================================================================
// Page Loader with Letter Drop Animation
// ==========================================================================
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  // Hide loader after animation completes
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero animations after loader hides
      setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-up');
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('visible');
          }, index * 150);
        });
      }, 300);
    }, 1800); // Wait for letter animation to complete
  });
}

// ==========================================================================
// Moving Hero Background Animation
// ==========================================================================
function initMovingFlower() {
  const flower = document.getElementById('heroFlower');
  if (!flower) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const rect = flower.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset from center (normalized -1 to 1)
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  });

  function animate() {
    // Smooth interpolation
    currentX += (mouseX * 20 - currentX) * 0.05;
    currentY += (mouseY * 15 - currentY) * 0.05;

    flower.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// Mobile Menu Animation
// ==========================================================================
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__links');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('nav__links--open');
    toggle.classList.toggle('nav__toggle--active');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('nav__links--open');
      toggle.classList.remove('nav__toggle--active');
    });
  });
}

// ==========================================================================
// Form Input Animations
// ==========================================================================
function initFormAnimations() {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
}

// ==========================================================================
// Process Timeline Animation
// ==========================================================================
function initProcessTimeline() {
  const timeline = document.querySelector('.process__timeline');
  if (!timeline) return;

  const steps = timeline.querySelectorAll('.process__step');
  const progressBar = timeline.querySelector('.process__timeline-progress');
  let currentStep = 0;
  let animationInterval;

  // Intersection observer to start animation when visible
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        startStepAnimation();
      } else {
        entry.target.classList.remove('visible');
        stopStepAnimation();
      }
    });
  }, { threshold: 0.3 });

  timelineObserver.observe(timeline);

  function startStepAnimation() {
    // Set first step as active initially
    currentStep = 0;
    updateActiveStep();

    // Sync with CSS animation (6 seconds total, 2 seconds per phase)
    animationInterval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      updateActiveStep();
    }, 2000); // 6s animation / 3 steps = 2s per step
  }

  function stopStepAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval);
    }
    steps.forEach(step => step.classList.remove('active'));
  }

  function updateActiveStep() {
    steps.forEach((step, index) => {
      if (index === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }
}

// ==========================================================================
// Cursor Follow Effect for Comparison Cards
// ==========================================================================
function initCursorFollow() {
  const cards = document.querySelectorAll('[data-cursor-area]');

  cards.forEach(card => {
    const cursorFollow = card.querySelector('.cursor-follow');
    if (!cursorFollow) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let animationFrame;

    function animate() {
      // Smooth interpolation
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      cursorFollow.style.left = `${currentX}px`;
      cursorFollow.style.top = `${currentY}px`;

      animationFrame = requestAnimationFrame(animate);
    }

    card.addEventListener('mouseenter', () => {
      animate();
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top - 20; // Offset above cursor
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animationFrame);
    });
  });
}

// ==========================================================================
// Initialize All
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Page loader
  initPageLoader();

  // Core animations
  initScrollAnimations();
  initNavigation();

  // Interactive elements
  initFaqAccordion();
  initServicesTabs();
  initCounterAnimations();
  initProcessTimeline();
  initCursorFollow();

  // Hero interactions
  initMovingFlower();

  // Enhanced effects
  initMagneticButtons();
  initParallax();
  initTiltEffect();
  initCursorGlow();
  initFormAnimations();

  // Mobile
  initMobileNav();
});

// ==========================================================================
// Utility Functions
// ==========================================================================

function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lerp function for smooth animations
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}
