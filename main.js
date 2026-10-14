(function () {
  'use strict';

  /* ---------- Navigasi ---------- */
  var navMap = [
    ['about-top', 'Home'],
    ['about', 'About'],
    ['experience', 'Experience'],
    ['projects', 'Projects'],
    ['academic', 'Academic'],
    ['education', 'Education'],
    ['achievements', 'Achievements'],
    ['skills', 'Skills'],
    ['beyond', 'Beyond work'],
    ['contact-footer', 'Contact']
  ];
  var navInner = document.getElementById('navInner');
  var buttons = {};

  navMap.forEach(function (item) {
    var el = document.getElementById(item[0]);
    if (!el) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item[1];
    btn.addEventListener('click', function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    navInner.appendChild(btn);
    buttons[item[0]] = btn;
  });

  var sections = navMap
    .map(function (i) { return document.getElementById(i[0]); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(buttons).forEach(function (k) { buttons[k].classList.remove('active'); });
        if (buttons[e.target.id]) buttons[e.target.id].classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { navObs.observe(s); });

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- KPI count-up ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^([\d.]+)(.*)$/);
    if (!match || reduceMotion) return;
    var target = parseFloat(match[1]);
    var suffix = match[2] || '';
    var isDecimal = match[1].indexOf('.') > -1;
    var duration = 900, startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = target * eased;
      el.textContent = (isDecimal ? val.toFixed(2) : Math.round(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    }
    requestAnimationFrame(step);
  }

  var kpiNums = document.querySelectorAll('.kpi .num');
  if ('IntersectionObserver' in window && kpiNums.length) {
    var kpiObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          kpiObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    kpiNums.forEach(function (el) { kpiObs.observe(el); });
  }

  /* ---------- Modal gambar ---------- */
  var overlay = document.getElementById('modalOverlay');
  var modalImg = document.getElementById('modalImg');
  var modalCaption = document.getElementById('modalCaption');
  var closeBtn = document.getElementById('modalClose');
  var lastFocus = null;

  document.querySelectorAll('[data-img]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.getAttribute('data-img');
      var caption = btn.getAttribute('data-caption') || '';
      if (!img) return;
      lastFocus = btn;
      modalImg.src = img;
      modalImg.alt = caption;
      modalCaption.textContent = caption;
      overlay.classList.add('open');
      closeBtn.focus();
    });
  });

  function closeModal() {
    overlay.classList.remove('open');
    modalImg.src = '';
    if (lastFocus) lastFocus.focus();
  }
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* ---------- Toggle dark / light ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function paintToggle() {
    var dark = currentTheme() === 'dark';
    toggle.textContent = dark ? '☀' : '☾';
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (err) { /* abaikan kalau storage tidak tersedia */ }
  paintToggle();

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (err) {}
    paintToggle();
  });
})();
