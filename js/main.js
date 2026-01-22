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
// Liquid Button Effect
// ==========================================================================
function initLiquidButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    // Create liquid ripple effect on click
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.className = 'liquid-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });

    // Enhanced hover effect with liquid flow
    button.addEventListener('mouseenter', function() {
      button.classList.add('liquid-active');
    });

    button.addEventListener('mouseleave', function() {
      button.classList.remove('liquid-active');
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
// User Presence Avatar Animation
// ==========================================================================
function initUserPresenceAvatars() {
  const presenceGroup = document.querySelector('.presence-group');
  if (!presenceGroup) return;

  const presenceItems = presenceGroup.querySelectorAll('.presence-item');
  if (presenceItems.length === 0) return;

  // Store base positions and animation state for each item
  const itemStates = Array.from(presenceItems).map((item, index) => {
    const baseX = parseFloat(item.style.getPropertyValue('--x') || '0');
    const baseY = parseFloat(item.style.getPropertyValue('--y') || '0');
    
    return {
      item,
      baseX,
      baseY,
      currentX: baseX,
      currentY: baseY,
      floatRadius: 8 + Math.random() * 6,
      floatSpeed: 0.0008 + Math.random() * 0.0004,
      floatPhase: Math.random() * Math.PI * 2,
      time: index * 0.5, // Stagger start times
      isFloating: true
    };
  });

  // Mouse interaction state
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;

  presenceGroup.addEventListener('mousemove', (e) => {
    const rect = presenceGroup.getBoundingClientRect();
    mouseX = e.clientX - rect.left - rect.width / 2;
    mouseY = e.clientY - rect.top - rect.height / 2;
  });

  presenceGroup.addEventListener('mouseenter', () => {
    isHovering = true;
  });

  presenceGroup.addEventListener('mouseleave', () => {
    isHovering = false;
    mouseX = 0;
    mouseY = 0;
  });

  // Main animation loop
  function animate() {
    itemStates.forEach((state) => {
      if (isHovering && (Math.abs(mouseX) > 1 || Math.abs(mouseY) > 1)) {
        // Cursor interaction mode - repel from cursor
        const distance = Math.sqrt(
          Math.pow(state.baseX - mouseX, 2) + Math.pow(state.baseY - mouseY, 2)
        );
        
        const repelDistance = 120;
        if (distance < repelDistance) {
          const repelStrength = (1 - distance / repelDistance) * 15;
          const angle = Math.atan2(state.baseY - mouseY, state.baseX - mouseX);
          state.currentX = state.baseX + Math.cos(angle) * repelStrength;
          state.currentY = state.baseY + Math.sin(angle) * repelStrength;
        } else {
          // Smooth return to base position
          state.currentX += (state.baseX - state.currentX) * 0.1;
          state.currentY += (state.baseY - state.currentY) * 0.1;
        }
        state.isFloating = false;
      } else {
        // Floating animation mode
        state.time += 0.016;
        const offsetX = Math.sin(state.time * state.floatSpeed + state.floatPhase) * state.floatRadius;
        const offsetY = Math.cos(state.time * state.floatSpeed * 1.3 + state.floatPhase) * state.floatRadius * 0.7;
        state.currentX = state.baseX + offsetX;
        state.currentY = state.baseY + offsetY;
        state.isFloating = true;
      }

      // Apply transform
      state.item.style.transform = `translate(-50%, -50%) translate(${state.currentX}px, ${state.currentY}px)`;
    });

    requestAnimationFrame(animate);
  }

  // Start animation after a brief delay to let CSS animations complete
  setTimeout(() => {
    animate();
  }, 600);
}

// ==========================================================================
// Code Typing Animation
// ==========================================================================
function initCodeTyping() {
  const codeContent = document.getElementById('codeContent');
  const codeCursor = document.getElementById('codeCursor');
  const copyButton = document.querySelector('.code-header__copy');
  
  if (!codeContent || !codeCursor) return;

  // Store the original HTML content
  const originalHTML = codeContent.innerHTML;
  const plainCode = `// Built with Lovable, Cursor & Claude Code
// Automated with n8n
// Trusted by 10+ Toronto businesses

export async function createBooking(data) {
  // Save booking
  const booking = await saveToDatabase(data);
  
  // Trigger n8n workflow
  await n8n.webhook('new-booking', booking);
  
  return booking;
}

export async function syncSchedule() {
  const bookings = await getBookings();
  await n8n.webhook('sync-schedule', bookings);
  
  return bookings;
}`;

  let typingTimeout = null;
  let animationInterval = null;

  // Parse code into tokens with syntax highlighting
  function parseCode(code) {
    const lines = code.split('\n');
    const tokens = [];
    
    lines.forEach((line, lineIndex) => {
      if (line.trim() === '') {
        tokens.push({ type: 'newline', value: '\n' });
        return;
      }
      
      // Tokenize the line
      const lineTokens = [];
      let i = 0;
      let currentToken = '';
      let inString = false;
      let stringChar = '';
      let inTag = false;
      
      while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        // Handle strings
        if ((char === '"' || char === "'") && !inTag) {
          if (!inString) {
            if (currentToken) {
              lineTokens.push({ type: 'text', value: currentToken });
              currentToken = '';
            }
            inString = true;
            stringChar = char;
            lineTokens.push({ type: 'string', value: char });
          } else if (char === stringChar && line[i - 1] !== '\\') {
            lineTokens.push({ type: 'string', value: char });
            inString = false;
            stringChar = '';
          } else {
            lineTokens.push({ type: 'string', value: char });
          }
          i++;
          continue;
        }
        
        if (inString) {
          lineTokens.push({ type: 'string', value: char });
          i++;
          continue;
        }
        
        // Handle JSX tags
        if (char === '<' && nextChar && /[a-zA-Z]/.test(nextChar)) {
          if (currentToken) {
            lineTokens.push({ type: 'text', value: currentToken });
            currentToken = '';
          }
          inTag = true;
          lineTokens.push({ type: 'tag', value: char });
          i++;
          continue;
        }
        
        if (inTag) {
          if (char === '>' || (char === '/' && nextChar === '>')) {
            lineTokens.push({ type: 'tag', value: char });
            inTag = false;
          } else {
            lineTokens.push({ type: 'tag', value: char });
          }
          i++;
          continue;
        }
        
        // Handle keywords
        const keywords = ['import', 'export', 'async', 'await', 'function', 'type', 'return', 'as', 'from', 'use', 'const', 'let', 'var'];
        const keywordMatch = line.substring(i).match(/^(\w+)/);
        if (keywordMatch && keywords.includes(keywordMatch[1])) {
          if (currentToken) {
            lineTokens.push({ type: 'text', value: currentToken });
            currentToken = '';
          }
          lineTokens.push({ type: 'keyword', value: keywordMatch[1] });
          i += keywordMatch[1].length;
          continue;
        }
        
        // Handle types (after 'type' keyword or in type annotations)
        if (line.substring(Math.max(0, i - 10), i).match(/type\s+\w+\s*=|:\s*$/)) {
          const typeMatch = line.substring(i).match(/^([A-Z]\w*)/);
          if (typeMatch) {
            if (currentToken) {
              lineTokens.push({ type: 'text', value: currentToken });
              currentToken = '';
            }
            lineTokens.push({ type: 'type', value: typeMatch[1] });
            i += typeMatch[1].length;
            continue;
          }
        }
        
        // Handle function names (after 'function' or 'async function' keyword)
        if (line.substring(Math.max(0, i - 20), i).match(/(async\s+)?function\s+$/)) {
          const funcMatch = line.substring(i).match(/^(\w+)/);
          if (funcMatch) {
            if (currentToken) {
              lineTokens.push({ type: 'text', value: currentToken });
              currentToken = '';
            }
            lineTokens.push({ type: 'function', value: funcMatch[1] });
            i += funcMatch[1].length;
            continue;
          }
        }
        
        // Handle async function names
        if (line.substring(Math.max(0, i - 10), i).match(/async\s+function\s+\w+/)) {
          const asyncFuncMatch = line.substring(i).match(/^(\w+)/);
          if (asyncFuncMatch && !keywords.includes(asyncFuncMatch[1])) {
            if (currentToken) {
              lineTokens.push({ type: 'text', value: currentToken });
              currentToken = '';
            }
            lineTokens.push({ type: 'function', value: asyncFuncMatch[1] });
            i += asyncFuncMatch[1].length;
            continue;
          }
        }
        
        // Handle parameters (in function parentheses)
        if (line.substring(Math.max(0, i - 20), i).match(/\([^)]*$/)) {
          const paramMatch = line.substring(i).match(/^(\w+)/);
          if (paramMatch && !keywords.includes(paramMatch[1])) {
            if (currentToken) {
              lineTokens.push({ type: 'text', value: currentToken });
              currentToken = '';
            }
            lineTokens.push({ type: 'param', value: paramMatch[1] });
            i += paramMatch[1].length;
            continue;
          }
        }
        
        currentToken += char;
        i++;
      }
      
      if (currentToken) {
        lineTokens.push({ type: 'text', value: currentToken });
      }
      
      tokens.push(...lineTokens);
      if (lineIndex < lines.length - 1) {
        tokens.push({ type: 'newline', value: '\n' });
      }
    });
    
    return tokens;
  }

  // Function to start the typing animation
  function startTypingAnimation() {
    // Clear any existing timeouts
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }

    // Reset content
    codeContent.innerHTML = '';
    codeCursor.classList.remove('hidden');
    codeContent.classList.add('writing');

    const tokens = parseCode(plainCode);
    let currentTokenIndex = 0;
    const duration = 4000; // 4 seconds total
    const delay = 800; // Start delay
    const charDelay = duration / plainCode.length;

    function typeNext() {
      if (currentTokenIndex < tokens.length) {
        const token = tokens[currentTokenIndex];
        const span = document.createElement('span');
        
        if (token.type === 'newline') {
          const lineBreak = document.createElement('br');
          codeContent.appendChild(lineBreak);
          currentTokenIndex++;
          typingTimeout = setTimeout(typeNext, charDelay * 2);
          return;
        }
        
        // Type character by character for this token
        let charIndex = 0;
        function typeChar() {
          if (charIndex < token.value.length) {
            span.textContent = token.value[charIndex];
            span.className = `code-${token.type}`;
            codeContent.appendChild(span.cloneNode(true));
            charIndex++;
            typingTimeout = setTimeout(typeChar, charDelay);
          } else {
            currentTokenIndex++;
            typingTimeout = setTimeout(typeNext, charDelay);
          }
        }
        typeChar();
      } else {
        // Typing complete
        codeContent.classList.remove('writing');
        codeCursor.classList.remove('hidden');
      }
      
      // Scroll to bottom
      codeContent.parentElement.scrollTop = codeContent.parentElement.scrollHeight;
    }

    // Start typing after delay
    typingTimeout = setTimeout(() => {
      typeNext();
    }, delay);
  }

  // Start the initial animation
  startTypingAnimation();

  // Restart animation every 10 seconds
  animationInterval = setInterval(() => {
    startTypingAnimation();
  }, 10000);

  // Copy button functionality
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(plainCode);
        const originalHTML = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          copyButton.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  }
}

// ==========================================================================
// Smooth Cursor
// ==========================================================================
function initSmoothCursor() {
  const cursor = document.getElementById('smoothCursor');
  if (!cursor) return;

  // Only show on desktop
  if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isVisible = false;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor on first movement
    if (!isVisible) {
      cursor.style.opacity = '1';
      isVisible = true;
    }
  });

  // Smooth cursor animation
  function animateCursor() {
    // Smooth interpolation (lerp)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    // Position at tip of cursor (not centered)
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  // Start animation
  animateCursor();

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (isVisible) {
      cursor.style.opacity = '1';
    }
  });

  // Add hover effects for interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .btn, input, textarea, select, [role="button"], .nav__link, .faq__question'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // Hide default cursor on desktop
  document.body.style.cursor = 'none';

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        document.body.style.cursor = '';
      } else {
        cursor.style.display = '';
        document.body.style.cursor = 'none';
      }
    }, 100);
  });
}

// ==========================================================================
// Animated Tooltip
// ==========================================================================
function initAnimatedTooltips() {
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
  
  tooltipTriggers.forEach(trigger => {
    const tooltip = trigger.nextElementSibling;
    if (!tooltip || !tooltip.classList.contains('tooltip')) return;
    
    let openTimeout;
    let closeTimeout;
    const openDelay = 500; // ms delay before showing
    const closeDelay = 100; // ms delay before hiding
    
    const showTooltip = () => {
      clearTimeout(closeTimeout);
      clearTimeout(openTimeout);
      
      openTimeout = setTimeout(() => {
        tooltip.classList.add('show');
      }, openDelay);
    };
    
    const hideTooltip = () => {
      clearTimeout(openTimeout);
      clearTimeout(closeTimeout);
      
      closeTimeout = setTimeout(() => {
        tooltip.classList.remove('show');
      }, closeDelay);
    };
    
    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
    trigger.addEventListener('focus', showTooltip);
    trigger.addEventListener('blur', hideTooltip);
    
    // Also handle tooltip hover to keep it visible
    tooltip.addEventListener('mouseenter', () => {
      clearTimeout(closeTimeout);
    });
    
    tooltip.addEventListener('mouseleave', hideTooltip);
  });
}

// ==========================================================================
// Animated Beam Component
// ==========================================================================
function initAnimatedBeams() {
  const container = document.getElementById('animatedBeamContainer');
  const svg = document.getElementById('animatedBeamsSvg');
  
  if (!container || !svg) return;

  let resizeTimeout;
  
  function drawBeams() {
    const centerCircle = container.querySelector('[data-ref="centerCircle"]');
    const circles = container.querySelectorAll('.animated-beam-circle:not(.animated-beam-circle--center)');
    
    if (!centerCircle || circles.length === 0) return;

    const centerRect = centerCircle.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
    const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

    // Clear existing paths
    svg.innerHTML = '';

    circles.forEach((circle, index) => {
      const circleRect = circle.getBoundingClientRect();
      const circleX = circleRect.left + circleRect.width / 2 - containerRect.left;
      const circleY = circleRect.top + circleRect.height / 2 - containerRect.top;

      // Calculate distance and angle
      const dx = circleX - centerX;
      const dy = circleY - centerY;
      const angle = Math.atan2(dy, dx);

      // Calculate start and end points (edge of circles)
      const centerRadius = centerRect.width / 2;
      const circleRadius = circleRect.width / 2;
      
      const startX = centerX + Math.cos(angle) * centerRadius;
      const startY = centerY + Math.sin(angle) * centerRadius;
      const endX = circleX - Math.cos(angle) * circleRadius;
      const endY = circleY - Math.sin(angle) * circleRadius;

      // Create curved path
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      // Add curvature based on position
      let curvature = 0;
      if (index % 2 === 0) {
        curvature = -25;
      } else {
        curvature = 25;
      }
      
      // Perpendicular offset for curve
      const perpX = -Math.sin(angle) * curvature;
      const perpY = Math.cos(angle) * curvature;
      
      const controlX = midX + perpX;
      const controlY = midY + perpY;

      // Create SVG path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
      path.setAttribute('d', pathData);
      path.setAttribute('class', 'animated-beam-path animated-beam-path--animated');
      path.setAttribute('style', `animation-delay: ${index * 0.15}s`);
      
      svg.appendChild(path);
    });
  }

  // Initial draw after layout
  setTimeout(drawBeams, 200);

  // Redraw on resize
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(drawBeams, 150);
  });

  // Redraw when section becomes visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(drawBeams, 100);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);
}

// ==========================================================================
// Animated Notification List for Industries
// ==========================================================================
function initIndustriesAnimatedList() {
  const container = document.getElementById('industriesAnimatedList');
  const listInner = document.getElementById('industriesListInner');

  if (!container || !listInner) return;

  // Notification data
  const notifications = [
    {
      name: "Restaurant booked",
      description: "Table for 4 confirmed",
      icon: "🍽️",
      color: "#00C9A7",
      time: "Just now"
    },
    {
      name: "Appointment set",
      description: "Haircut & styling",
      icon: "💇",
      color: "#FFB800",
      time: "2m ago"
    },
    {
      name: "New member joined",
      description: "Gym membership activated",
      icon: "💪",
      color: "#FF3D71",
      time: "5m ago"
    },
    {
      name: "Invoice sent",
      description: "Consulting services",
      icon: "📄",
      color: "#1E86FF",
      time: "8m ago"
    },
    {
      name: "Staff scheduled",
      description: "Weekend shift covered",
      icon: "📅",
      color: "#9B59B6",
      time: "12m ago"
    },
    {
      name: "Inventory alert",
      description: "Reorder supplies",
      icon: "📦",
      color: "#E67E22",
      time: "15m ago"
    },
    {
      name: "Payment received",
      description: "Client subscription",
      icon: "💸",
      color: "#27AE60",
      time: "18m ago"
    },
    {
      name: "Class reminder",
      description: "Yoga starts in 1 hour",
      icon: "🧘",
      color: "#3498DB",
      time: "20m ago"
    }
  ];

  let isAnimating = false;
  let animationInterval = null;

  // Create notification element
  function createNotification(data) {
    const item = document.createElement('div');
    item.className = 'notification-item';
    item.innerHTML = `
      <div class="notification-item__content">
        <div class="notification-item__icon" style="background-color: ${data.color}">
          <span>${data.icon}</span>
        </div>
        <div class="notification-item__text">
          <div class="notification-item__header">
            <span class="notification-item__name">${data.name}</span>
            <span class="notification-item__dot">·</span>
            <span class="notification-item__time">${data.time}</span>
          </div>
          <p class="notification-item__description">${data.description}</p>
        </div>
      </div>
    `;
    return item;
  }

  // Add notification with animation
  function addNotification(index) {
    const data = notifications[index % notifications.length];
    const item = createNotification(data);

    // Add to the top of the list
    listInner.insertBefore(item, listInner.firstChild);

    // Remove old items if more than 5
    const items = listInner.querySelectorAll('.notification-item');
    if (items.length > 5) {
      const oldItem = items[items.length - 1];
      oldItem.style.opacity = '0';
      oldItem.style.transform = 'translateY(20px)';
      setTimeout(() => oldItem.remove(), 300);
    }
  }

  // Start animation loop
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;

    let index = 0;

    // Add initial items
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        addNotification(index);
        index++;
      }, i * 600);
    }

    // Continue adding items
    animationInterval = setInterval(() => {
      addNotification(index);
      index++;
    }, 3000);
  }

  // Stop animation
  function stopAnimation() {
    isAnimating = false;
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }

  // Intersection observer to start/stop animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
      } else {
        stopAnimation();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(container);
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
  initLiquidButtons();
  initParallax();
  initTiltEffect();
  initCursorGlow();
  initFormAnimations();
  initUserPresenceAvatars();
  initCodeTyping();
  initSmoothCursor();
  initAnimatedTooltips();
  initAnimatedBeams();
  initIndustriesAnimatedList();

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
