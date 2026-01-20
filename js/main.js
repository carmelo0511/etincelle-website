/**
 * Etincelle Website - Enhanced Animations & Interactions
 * Modern, elegant animations with smooth micro-interactions
 */

// ==========================================================================
// Lenis Smooth Scroll - Framer-like buttery scrolling
// ==========================================================================
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 0.4,
    easing: (t) => t,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 1,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Connect Lenis to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
}

// ==========================================================================
// Scroll Progress Indicator
// ==========================================================================
function initScrollProgress() {
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

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
// Smooth Scroll with Easing
// ==========================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
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
// Text Split Animation (for headings)
// ==========================================================================
function initTextSplit() {
  const textElements = document.querySelectorAll('.text-reveal');

  textElements.forEach(element => {
    const text = element.textContent;
    element.innerHTML = `<span>${text}</span>`;
  });
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
// Typing Effect for Hero (optional)
// ==========================================================================
function initTypingEffect() {
  const element = document.querySelector('.typing-text');
  if (!element) return;

  const words = ['clarity.', 'results.', 'innovation.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
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
// Smooth Reveal on Load
// ==========================================================================
function initPageReveal() {
  // Add initial styles to body
  document.body.style.opacity = '0';

  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';

    // Trigger hero animations
    setTimeout(() => {
      const heroElements = document.querySelectorAll('.hero .fade-up, .hero__content, .hero__visual');
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, index * 150);
      });
    }, 200);
  });
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
// Initialize All
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Lenis smooth scroll
  initLenis();

  // Core animations
  // initScrollProgress(); // Disabled - removed progress bar
  initScrollAnimations();
  initNavigation();
  // initSmoothScroll(); // Replaced by Lenis

  // Interactive elements
  initFaqAccordion();
  initServicesTabs();
  initCounterAnimations();
  initProcessTimeline();

  // Enhanced effects
  initMagneticButtons();
  initParallax();
  initTiltEffect();
  initCursorGlow();
  initFormAnimations();

  // Mobile
  initMobileNav();

  // Optional effects
  // initTypingEffect();
  // initTextSplit();
});

// Page reveal animation
initPageReveal();

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
