// Theme toggle
(function () {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const currentTheme = () => {
    const attr = root.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Follow OS changes if user hasn't picked one
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved !== 'dark' && saved !== 'light') {
      root.removeAttribute('data-theme');
    }
  });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Reading progress bar
const bar = document.createElement('div');
bar.className = 'progress-bar';
document.body.prepend(bar);

window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  bar.style.width = pct + '%';
}, { passive: true });

// Scroll fade-in for projects, staggered
const projects = document.querySelectorAll('.project');
projects.forEach((p, i) => {
  p.classList.add('fade-pending');
  p.style.transitionDelay = `${i * 60}ms`;
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      fadeObserver.unobserve(e.target);
      e.target.addEventListener('transitionend', () => {
        e.target.style.transitionDelay = '';
        e.target.classList.remove('fade-pending', 'is-visible');
      }, { once: true });
    }
  });
}, { threshold: 0.06 });

projects.forEach(p => fadeObserver.observe(p));

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// Animated details expand/collapse
document.querySelectorAll('details.install').forEach(details => {
  const summary = details.querySelector('summary');
  const body = details.querySelector('.install-body');

  summary.addEventListener('click', e => {
    e.preventDefault();

    if (details.open) {
      body.style.height = body.scrollHeight + 'px';
      body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        body.style.transition = 'height 0.22s ease, opacity 0.18s ease';
        body.style.height = '0';
        body.style.opacity = '0';
      });
      body.addEventListener('transitionend', () => {
        details.removeAttribute('open');
        body.style.cssText = '';
      }, { once: true });
    } else {
      details.setAttribute('open', '');
      const h = body.scrollHeight;
      body.style.height = '0';
      body.style.opacity = '0';
      body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        body.style.transition = 'height 0.26s ease, opacity 0.22s ease';
        body.style.height = h + 'px';
        body.style.opacity = '1';
      });
      body.addEventListener('transitionend', () => {
        body.style.cssText = '';
      }, { once: true });
    }
  });
});
