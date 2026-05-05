import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { inject } from '@vercel/analytics';

gsap.registerPlugin(ScrollTrigger);

// Initialize Vercel Web Analytics
inject();

// ===== Mobile Menu =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  if (!hamburger) return;

  // Create overlay if it doesn't exist
  let overlay = document.getElementById('mobile-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mobile-overlay';
    overlay.className = 'mobile-overlay';
    overlay.innerHTML = `
      <a href="/">Home</a>
      <a href="/services.html">Services</a>
      <a href="/team.html">Our Team</a>
      <a href="/contact.html">Contact</a>
    `;
    document.body.appendChild(overlay);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    overlay.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    });
  });
}
initMobileMenu();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  });
}

// --- GSAP Animations ---

// 1. Unified Hero Animation (One-time on scroll)
const pinnedHeroElement = document.getElementById('pinned-hero');
if (pinnedHeroElement) {
  // Lock scrolling initially (both html and body for full coverage)
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  
  // Ensure navbar is hidden initially on the home page
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.add('hidden-nav');

  let animationPlayed = false;
  let isAnimating = false;

  const preventScroll = (e) => {
    if (!animationPlayed || isAnimating) {
      if (e.cancelable) e.preventDefault();
      window.scrollTo(0, 0);
    }
  };

  const playIntro = (e) => {
    if (animationPlayed) return;
    
    // Attempt to prevent the exact scroll that triggered this
    if (e && e.cancelable) e.preventDefault();
    
    animationPlayed = true;
    isAnimating = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        // Unlock scrolling after animation completes
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    });

    // Shrink and move the logo layer UP
    const isMobile = window.innerWidth <= 768;
    tl.to('#animated-logo-layer', {
      scale: isMobile ? 0.3 : 0.4,
      y: isMobile ? '-40vh' : '-35vh',
      duration: 1.5,
      ease: 'power3.inOut'
    }, 0);

    // Fade out scroll hint
    tl.to('#scroll-hint', {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    // Fade in the hero content (text, buttons, carousel)
    tl.to('#hero-content-layer', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0.5);

    // Slide down the navbar
    if (nav) {
      tl.call(() => nav.classList.remove('hidden-nav'), null, 1);
      tl.call(() => nav.classList.add('nav-visible'), null, 1);
    }
  };

  // Listen for the first scroll attempt and aggressively prevent bypass
  window.addEventListener('wheel', (e) => { preventScroll(e); playIntro(e); }, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false }); // Lock dragging down
  window.addEventListener('touchstart', (e) => { playIntro(e); }, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp'].includes(e.code)) {
      preventScroll(e);
      playIntro(e);
    }
  }, { passive: false });
}

// 2. About Section Reveal
const aboutElement = document.getElementById('about');
if (aboutElement) {
  const aboutTarget = document.querySelector('.about-single') || document.querySelector('.about-text-content');
  if (aboutTarget) {
    gsap.set(aboutTarget, { opacity: 0, y: 50 });
    gsap.to(aboutTarget, {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }
}

// 3. Services Section
const servicesElement = document.getElementById('services');
if (servicesElement) {
  gsap.set('#services .section-title, #services .center-divider, #services .section-text', { opacity: 0, y: 30 });
  gsap.set('.service-card', { opacity: 0, y: 40 });

  gsap.to('#services .section-title, #services .center-divider, #services .section-text', {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.to('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 85%',
    },
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
  });
}

// 4. Team Section
const teamElement = document.getElementById('team');
if (teamElement) {
  gsap.set('#team .section-title, #team .center-divider, #team .section-text', { opacity: 0, y: 30 });
  gsap.set('.team-card', { opacity: 0, y: 40 });

  gsap.to('#team .section-title, #team .center-divider, #team .section-text', {
    scrollTrigger: {
      trigger: '#team',
      start: 'top 80%',
    },
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.to('.team-card', {
    scrollTrigger: {
      trigger: '.team-leadership',
      start: 'top 85%',
    },
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
  });
}

// 5. Contact Section
const contactElement = document.getElementById('contact');
if (contactElement) {
  const contactCards = document.querySelectorAll('.contact-grid > div, .contact-single > div');
  gsap.set(contactCards, { opacity: 0, y: 30 });

  gsap.to(contactCards, {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 75%',
    },
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out'
  });
}
