/* ============================
   VASUDEV PHOTOGRAPHY — script.js
   ============================ */

'use strict';

/* ===== LOADING SCREEN ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('.hero-eyebrow, .hero-title, .hero-divider, .hero-sub, .hero-btns')
      .forEach(el => el.classList.add('in'));
  }, 2400);
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

// Sticky nav on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  toggleScrollTop();
});

// Hamburger menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Active nav highlight
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ===== HERO SLIDER ===== */
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
let slideInterval;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dotsContainer.children[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dotsContainer.children[currentSlide].classList.add('active');
}

function startSlider() {
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function stopSlider() { clearInterval(slideInterval); }

startSlider();
document.querySelector('.hero').addEventListener('mouseenter', stopSlider);
document.querySelector('.hero').addEventListener('mouseleave', startSlider);

/* ===== SCROLL REVEAL (Intersection Observer) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const matches = filter === 'all' || item.dataset.cat === filter;
      if (matches) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeUp 0.5s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let lbImages = [];
let lbIndex = 0;

function buildLightboxImages() {
  lbImages = Array.from(document.querySelectorAll('.portfolio-item:not(.hidden)'));
}

function openLightbox(index) {
  buildLightboxImages();
  lbIndex = index;
  showLbImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLbImage() {
  const item = lbImages[lbIndex];
  lbImg.src = item.querySelector('img').src;
  lbCaption.textContent = item.querySelector('.portfolio-overlay span').textContent;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

portfolioItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    buildLightboxImages();
    const visibleIndex = lbImages.indexOf(item);
    if (visibleIndex !== -1) openLightbox(visibleIndex);
  });
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showLbImage();
});

lbNext.addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % lbImages.length;
  showLbImage();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbImage(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; showLbImage(); }
});

// Touch swipe for lightbox
let lbTouchStartX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = lbTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) { lbIndex = (lbIndex + 1) % lbImages.length; }
    else { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; }
    showLbImage();
  }
});

/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrors() {
  ['nameErr', 'emailErr', 'msgErr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();
  let valid = true;

  if (!name || name.length < 2) {
    showError('nameErr', 'Please enter your full name.');
    valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('emailErr', 'Please enter a valid email address.');
    valid = false;
  }
  if (!message || message.length < 10) {
    showError('msgErr', 'Please write a message (at least 10 characters).');
    valid = false;
  }

  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  // Simulate sending
  setTimeout(() => {
    contactForm.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1800);
});

// Real-time validation clear on input
['fname', 'femail', 'fmsg'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', clearErrors);
});

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== STATS COUNTER ANIMATION ===== */
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start + (el.dataset.suffix || '+');
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.textContent.replace(/\D/g, '');
        const target = parseInt(raw, 10);
        el.dataset.suffix = el.textContent.includes('+') ? '+' : '';
        animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ===== PARALLAX HERO SUBTLE ===== */
window.addEventListener('scroll', () => {
  const heroSlider = document.querySelector('.hero-slider');
  if (!heroSlider) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroSlider.style.transform = `translateY(${scrolled * 0.25}px)`;
  }
}, { passive: true });
