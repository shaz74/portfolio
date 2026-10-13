/**
 * MD SHAZAAN AMIN — CINEMATIC PORTFOLIO JAVASCRIPT
 * Vanilla JS | Modern ES6+ | High Performance | Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Detect Reduced Motion Preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ==========================================================================
     1. SCROLL PROGRESS INDICATOR
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');

  const updateScrollProgress = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && scrollProgress) {
      const pct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      scrollProgress.style.width = `${pct}%`;
    }

    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });
  updateScrollProgress();

  /* ==========================================================================
     2. MOUSE-FOLLOW SPOTLIGHT (DESKTOP ONLY)
     ========================================================================== */
  const spotlight = document.getElementById('cursor-spotlight');

  if (spotlight && isFinePointer && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        spotlight.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      spotlight.style.opacity = '0';
    });

    const renderSpotlight = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderSpotlight);
    };
    requestAnimationFrame(renderSpotlight);
  }

  /* ==========================================================================
     3. SPLIT HEADING LETTER-BY-LETTER RISE-IN ANIMATION
     ========================================================================== */
  const splitHeadings = document.querySelectorAll('.split-heading');

  splitHeadings.forEach((heading) => {
    const originalText = heading.getAttribute('data-split') || heading.textContent.trim();
    heading.textContent = ''; // clear

    const fragment = document.createDocumentFragment();
    let charIndex = 0;

    for (let i = 0; i < originalText.length; i++) {
      const char = originalText[i];
      const span = document.createElement('span');
      span.classList.add('split-char');
      
      if (char === '.') {
        span.classList.add('accent-dot');
      }
      span.textContent = char;

      if (!prefersReducedMotion) {
        span.style.transitionDelay = `${charIndex * 40}ms`;
      }
      charIndex++;
      fragment.appendChild(span);
    }

    heading.appendChild(fragment);
  });

  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        headingObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  splitHeadings.forEach((h) => headingObserver.observe(h));

  /* ==========================================================================
     4. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealItems = document.querySelectorAll('.reveal-item');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((el, index) => {
      // Add slight cascading delay to consecutive grid items
      if (!el.style.transitionDelay && el.parentElement) {
        const siblings = Array.from(el.parentElement.querySelectorAll('.reveal-item'));
        const sibIndex = siblings.indexOf(el);
        if (sibIndex > 0 && sibIndex < 6) {
          el.style.transitionDelay = `${sibIndex * 80}ms`;
        }
      }
      revealObserver.observe(el);
    });
  } else {
    // Immediate fallback for reduced motion or non-supporting browsers
    revealItems.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     5. HERO PORTRAIT PARALLAX TILT
     ========================================================================== */
  const portraitStage = document.getElementById('portrait-stage');
  const heroSection = document.getElementById('hero');

  if (portraitStage && heroSection && isFinePointer && !prefersReducedMotion) {
    let heroBounds = heroSection.getBoundingClientRect();

    window.addEventListener('resize', () => {
      heroBounds = heroSection.getBoundingClientRect();
    }, { passive: true });

    heroSection.addEventListener('mousemove', (e) => {
      const relX = (e.clientX - heroBounds.left) / heroBounds.width - 0.5;
      const relY = (e.clientY - heroBounds.top) / heroBounds.height - 0.5;

      const tiltX = -relY * 14;
      const tiltY = relX * 14;

      portraitStage.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      portraitStage.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      portraitStage.style.transition = 'transform 0.5s var(--ease-cinematic)';
    });

    heroSection.addEventListener('mouseenter', () => {
      portraitStage.style.transition = 'transform 0.15s ease-out';
    });
  }

  /* ==========================================================================
     6. MAGNETIC BUTTONS
     ========================================================================== */
  const magneticElements = document.querySelectorAll('.magnetic');

  if (isFinePointer && !prefersReducedMotion) {
    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0, 0, 0)';
        el.style.transition = 'transform 0.4s var(--ease-spring)';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  /* ==========================================================================
     7. PROJECT CARDS EXPANSION TOGGLE
     ========================================================================== */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    const toggleBtn = card.querySelector('.expand-toggle-btn');
    const toggleText = toggleBtn ? toggleBtn.querySelector('.toggle-text') : null;

    const toggleCard = (e) => {
      // Prevent double triggers when clicking button specifically
      if (e.target.closest('a')) return;

      const isExpanded = card.getAttribute('data-expanded') === 'true';
      const newState = !isExpanded;

      card.setAttribute('data-expanded', newState.toString());
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', newState.toString());
      }
      if (toggleText) {
        toggleText.textContent = newState ? 'Collapse Details' : 'Expand Details & Metrics';
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCard(e);
      });
    }

    card.addEventListener('click', (e) => {
      // If clicking interactive child element, ignore
      if (e.target.closest('button') || e.target.closest('a')) return;
      toggleCard(e);
    });
  });

  /* ==========================================================================
     8. STICKY NAV ACTIVE SECTION HIGHLIGHT
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(highlightNav);
  }, { passive: true });

  /* ==========================================================================
     9. MOBILE MENU DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-close');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     10. COPY EMAIL FUNCTIONALITY WITH VISIBLE FALLBACK
     ========================================================================== */
  const copyBtn = document.getElementById('copy-email-btn');
  const toastNotice = document.getElementById('toast-notice');
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    toastNotice.setAttribute('aria-hidden', 'false');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
      toastNotice.setAttribute('aria-hidden', 'true');
    }, 3200);
  };

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-clipboard') || 'mdshazaanamin@gmail.com';
      const label = copyBtn.querySelector('.copy-label');

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback using textarea
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        if (label) label.textContent = 'Copied!';
        showToast(`Copied ${email} to clipboard!`);

        setTimeout(() => {
          if (label) label.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  }

  /* ==========================================================================
     11. CONTACT MESSAGE COMPOSER
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const composerStatus = document.getElementById('composer-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name')?.value.trim() || 'Visitor';
      const subject = document.getElementById('sender-subject')?.value || 'Portfolio Inquiry';
      const message = document.getElementById('sender-message')?.value.trim() || '';

      const recipient = 'mdshazaanamin@gmail.com';
      const fullSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
      const fullBody = encodeURIComponent(
        `Hi Md Shazaan,\n\n${message}\n\nBest regards,\n${name}`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${fullSubject}&body=${fullBody}`;

      if (composerStatus) {
        composerStatus.textContent = 'Launching mail client...';
        composerStatus.style.color = 'var(--amber-core)';
      }

      window.location.href = mailtoUrl;

      showToast('Opening default email client...');

      setTimeout(() => {
        if (composerStatus) {
          composerStatus.textContent = 'Draft ready! Email client triggered.';
        }
      }, 1000);
    });
  }
});
