/**
 * SOLARVOLT – main.js
 * Core functionality: theme, nav, animations, calculator, forms
 */

'use strict';

// ── Theme Management ──────────────────────────────────────────
const Theme = (() => {
  const KEY = 'solarvolt-theme';
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;

  function set(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    updateIcon(theme);
  }

  function updateIcon(theme) {
    if (!btn) return;
    btn.querySelector('.theme-icon-sun') && (btn.querySelector('.theme-icon-sun').style.display = theme === 'dark' ? 'inline' : 'none');
    btn.querySelector('.theme-icon-moon') && (btn.querySelector('.theme-icon-moon').style.display = theme === 'light' ? 'inline' : 'none');
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    set(saved || preferred);
    if (btn) btn.addEventListener('click', () => set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(KEY)) set(e.matches ? 'dark' : 'light');
    });
  }

  return { init, set };
})();

// ── Navigation ────────────────────────────────────────────────
const Nav = (() => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  function init() {
    // Active link highlighting
    const links = document.querySelectorAll('.navbar__nav a, .mobile-menu a');
    links.forEach(link => {
      if (link.href === window.location.href) link.classList.add('active');
    });

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
      });

      // Close on outside click
      document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        }
      });
    }
  }

  return { init };
})();

// ── Scroll To Top ─────────────────────────────────────────────
const ScrollTop = (() => {
  function init() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  return { init };
})();

// ── Savings Calculator ────────────────────────────────────────
const Calculator = (() => {
  function calculate() {
    const billEl = document.getElementById('calcBill');
    const sizeEl = document.getElementById('calcSize');
    const typeEl = document.getElementById('calcType');
    const resultEl = document.getElementById('calcResult');
    const roiEl = document.getElementById('calcROI');
    const co2El = document.getElementById('calcCO2');
    if (!billEl || !resultEl) return;

    const bill = parseFloat(billEl.value) || 0;
    const size = parseFloat(sizeEl?.value) || 5;
    const type = typeEl?.value || 'solar';
    const factor = type === 'wind' ? 0.78 : 0.72;

    const annual = bill * 12 * factor;
    const roi = Math.round(annual / (size * 2200) * 100);
    const co2 = (size * 1.2).toFixed(1);

    animateNumber(resultEl, 0, Math.round(annual), 1200, v => '$' + v.toLocaleString());
    if (roiEl) animateNumber(roiEl, 0, roi, 1200, v => v + '%');
    if (co2El) co2El.textContent = co2 + ' tons/yr';
  }

  function animateNumber(el, from, to, duration, format) {
    const start = performance.now();
    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(from + (to - from) * easeOut(progress));
      el.textContent = format ? format(value) : value;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function init() {
    const inputs = document.querySelectorAll('.calc-input');
    inputs.forEach(input => input.addEventListener('input', () => {
      const id = input.id + 'Val';
      const valEl = document.getElementById(id);
      if (valEl) valEl.textContent = input.value;
      calculate();
    }));
    calculate();
  }

  return { init };
})();

// ── Form Validation ───────────────────────────────────────────
const Forms = (() => {
  const rules = {
    name: { min: 2, msg: 'Please enter at least 2 characters.' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email address.' },
    phone: { pattern: /^\+?[\d\s\-()]{7,}$/, msg: 'Please enter a valid phone number.' },
    message: { min: 10, msg: 'Message must be at least 10 characters.' },
    default: { min: 1, msg: 'This field is required.' }
  };

  function validate(input) {
    const name = input.name || input.id || 'default';
    const rule = rules[name] || rules.default;
    const val = input.value.trim();
    const errEl = input.nextElementSibling?.classList.contains('form-error') ? input.nextElementSibling : null;
    let ok = true;

    if (input.required && !val) {
      ok = false;
    } else if (rule.pattern && !rule.pattern.test(val)) {
      ok = false;
    } else if (rule.min && val.length < rule.min) {
      ok = false;
    }

    input.classList.toggle('error', !ok);
    if (errEl) { errEl.textContent = !ok ? rule.msg : ''; errEl.classList.toggle('visible', !ok); }
    return ok;
  }

  function init() {
    document.querySelectorAll('.validated-form').forEach(form => {
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        input.addEventListener('blur', () => validate(input));
        input.addEventListener('input', () => { if (input.classList.contains('error')) validate(input); });
      });

      form.addEventListener('submit', e => {
        e.preventDefault();
        const valid = [...inputs].map(validate).every(Boolean);
        if (valid) {
          Toast.show('Message sent successfully! We\'ll be in touch shortly.', 'success');
          form.reset();
        } else {
          Toast.show('Please fix the errors above.', 'error');
        }
      });
    });
  }

  return { init, validate };
})();

// ── Toast Notifications ───────────────────────────────────────
const Toast = (() => {
  let container;

  function ensureContainer() {
    if (!container) {
      container = document.getElementById('toastContainer') || createContainer();
    }
    return container;
  }

  function createContainer() {
    const el = document.createElement('div');
    el.id = 'toastContainer';
    el.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.75rem;';
    document.body.appendChild(el);
    return el;
  }

  function show(msg, type = 'success', duration = 4000) {
    const c = ensureContainer();
    const toast = document.createElement('div');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${msg}</span>`;
    c.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  return { show };
})();

// ── Intersection Observer Animations ─────────────────────────
const Animate = (() => {
  function init() {
    const els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animate-fadeInUp');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }
  return { init };
})();

// ── Counter Animation ─────────────────────────────────────────
const Counter = (() => {
  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.getAttribute('data-count'));
        const suf = el.getAttribute('data-suffix') || '';
        const pre = el.getAttribute('data-prefix') || '';
        let start = performance.now();
        const update = now => {
          const prog = Math.min((now - start) / 1800, 1);
          const val = end < 100 ? (end * easeOut(prog)).toFixed(1) : Math.round(end * easeOut(prog));
          el.textContent = pre + val + suf;
          if (prog < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  return { init };
})();

// ── FAQ Accordion ─────────────────────────────────────────────
const FAQ = (() => {
  function init() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
  return { init };
})();

// ── Newsletter Form ───────────────────────────────────────────
const Newsletter = (() => {
  function init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          Toast.show('Thank you for subscribing!', 'success');
          form.reset();
        } else {
          Toast.show('Please enter a valid email.', 'error');
        }
      });
    });
  }
  return { init };
})();

// ── Particles (Hero) ─────────────────────────────────────────
const Particles = (() => {
  function init() {
    const container = document.querySelector('.hero__particles');
    if (!container) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 6 + 3;
      p.className = 'particle';
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation-duration:${Math.random() * 15 + 10}s;
        animation-delay:${Math.random() * -10}s;
        opacity:${Math.random() * 0.15 + 0.05};
      `;
      container.appendChild(p);
    }
  }
  return { init };
})();

// ── RTL Toggle ────────────────────────────────────────────────
const RTL = (() => {
  const KEY = 'solarvolt-dir';

  function set(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(KEY, dir);
    // Update all RTL toggle buttons on the page
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      const isRTL = dir === 'rtl';
      btn.setAttribute('aria-label', isRTL ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('title', isRTL ? 'Switch to LTR layout' : 'Switch to RTL layout');
      const icon = btn.querySelector('.rtl-icon');
      if (icon) icon.textContent = isRTL ? 'LTR' : 'RTL';
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    set(current === 'rtl' ? 'ltr' : 'rtl');
  }

  function init() {
    const saved = localStorage.getItem(KEY) || 'ltr';
    set(saved);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, set, toggle };
})();

// ── Logout Toast ──────────────────────────────────────────────
const Logout = (() => {
  function init() {
    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const target = btn.getAttribute('href') || btn.getAttribute('data-href') || '../index.html';
        Toast.show('You have been logged out successfully. See you soon! 👋', 'success', 3000);
        setTimeout(() => { window.location.href = target; }, 2000);
      });
    });
  }
  return { init };
})();

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Nav.init();
  ScrollTop.init();
  Calculator.init();
  Forms.init();
  Animate.init();
  Counter.init();
  FAQ.init();
  Newsletter.init();
  Particles.init();
  RTL.init();
  Logout.init();
});
