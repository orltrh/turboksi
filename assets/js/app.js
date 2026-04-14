/* ============================================================
   app.js — Turboksi · All UI behavior
   ============================================================ */

/* 1. Navbar: transparent → frosted on scroll + hamburger */
(function initNavbar() {
  var navbar = document.getElementById('navbar');
  var toggle = document.getElementById('nav-toggle');
  var menu   = document.getElementById('nav-menu');
  if (!navbar) return;

  if (!document.querySelector('.hero')) {
    navbar.classList.add('scrolled');
  }

  function handleScroll() {
    if (document.querySelector('.hero')) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('active', isOpen);
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      });
    });
  }
})();


/* 2. Scroll-to-top button */
(function initScrollTop() {
  var btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* 3. Scroll-triggered animations via IntersectionObserver */
(function initAnimations() {
  var targets = document.querySelectorAll('.anim-up');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  targets.forEach(function (el) { observer.observe(el); });
})();


/* 4. Smooth scroll for anchor links */
(function initSmoothScroll() {
  var navbar = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = (navbar ? navbar.offsetHeight : 70);
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
})();


/* 5. FAQ accordion — one-open-at-a-time */
(function initFAQ() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(function (item) {
    var btn    = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      items.forEach(function (other) {
        var ob = other.querySelector('.faq-question');
        var oa = other.querySelector('.faq-answer');
        if (ob && oa) { ob.setAttribute('aria-expanded', 'false'); oa.hidden = true; }
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();


/* 6. Project detail modal — reads data from card data-* attributes (no fetch required) */
(function initProjectModal() {
  var overlay = document.getElementById('project-modal');
  if (!overlay) return;

  var closeBtn = overlay.querySelector('.modal-close');
  var thumbImg = overlay.querySelector('.modal-thumb');
  var thumbPlh = overlay.querySelector('.modal-thumb-placeholder');

  function populate(project) {
    if (project.image) {
      thumbImg.src = project.image;
      thumbImg.style.display = 'block';
      if (thumbPlh) thumbPlh.style.display = 'none';
    } else {
      thumbImg.style.display = 'none';
      if (thumbPlh) {
        thumbPlh.style.background = project.thumbGradient || 'var(--clr-navy)';
        thumbPlh.style.display = 'block';
      }
    }

    overlay.querySelector('.modal-title').textContent     = project.title       || '';
    overlay.querySelector('.modal-sector').textContent    = project.sector      || '';
    overlay.querySelector('.modal-type').textContent      = project.type        || '';
    overlay.querySelector('.modal-year').textContent      = project.year        || '';
    overlay.querySelector('.modal-location').textContent  = project.location    || '';
    overlay.querySelector('.modal-desc').textContent      = project.description || '';
    overlay.querySelector('.modal-challenge').textContent = project.challenge   || '';
    overlay.querySelector('.modal-approach').textContent  = project.approach    || '';
    overlay.querySelector('.modal-outcome').textContent   = project.outcome     || '';

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    overlay.scrollTop = 0;
  }

  function openFromCard(card) {
    var ds = card.dataset;
    populate({
      id:           ds.projectId,
      title:        ds.title        || '',
      sector:       ds.sector       || '',
      type:         ds.type         || '',
      year:         ds.year         || '',
      location:     ds.location     || '',
      description:  ds.description  || '',
      challenge:    ds.challenge    || '',
      approach:     ds.approach     || '',
      outcome:      ds.outcome      || '',
      image:        ds.image        || '',
      thumbGradient: ds.thumbGradient || 'var(--clr-navy)'
    });
  }

  function close() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* Click delegation — works for both static and dynamically rendered cards */
  document.addEventListener('click', function (e) {
    var card = e.target.closest('.portfolio-card[data-project-id]');
    if (card && !overlay.contains(e.target)) openFromCard(card);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) close();
  });
})();
