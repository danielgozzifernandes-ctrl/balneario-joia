// ── NAV SCROLL ──
  const nav = document.getElementById('mainNav');
  const syncNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  // ── SCROLL PROGRESS BAR ──
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
  }, { passive: true });

  // ── MOBILE MENU ──
  function openMobile() {
    document.getElementById('mobileMenu').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── TECLADO: Escape fecha menu e lightbox ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMobile(); closeLightbox(); }
  });

  // ── FAQ ACCORDION ──
  function toggleFaq(el) {
    const item = el.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      el.setAttribute('aria-expanded', 'true');
    }
  }

  // ── SCROLL REVEAL ──
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── STAGGER GRID ITEMS ──
  const staggerGroups = [
    '.ben-grid',
    '.roteiro-steps',
  ];
  staggerGroups.forEach(sel => {
    const container = document.querySelector(sel);
    if (!container) return;
    const children = Array.from(container.children);
    children.forEach((child, i) => {
      if (!child.classList.contains('reveal')) {
        child.classList.add('stagger-child');
        child.style.transitionDelay = (i * 0.09) + 's';
      }
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          children.forEach(c => c.classList.add('visible'));
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(container);
  });

  // ── CARDÁPIO TABS ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const currentPanel = document.querySelector('.tab-panel.active');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      if (currentPanel && currentPanel.id !== 'tab-' + target) {
        currentPanel.style.animation = 'tabExit 0.18s ease forwards';
        setTimeout(() => {
          document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.remove('active');
            p.style.animation = '';
          });
          document.getElementById('tab-' + target).classList.add('active');
        }, 170);
      } else {
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-' + target).classList.add('active');
      }
    });
  });

  // ── CONTADOR ANIMADO ──
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isFloat = el.dataset.float === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 1800, step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('pt-BR')) + suffix;
    }, step);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.contador-num[data-target]').forEach(el => counterObs.observe(el));

  // ── LIGHTBOX ──
  (function() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lbImg    = document.getElementById('lb-img');
    const lbCaption= document.getElementById('lb-caption');
    const lbCounter= document.getElementById('lb-counter');
    let lbIdx = 0;
    const lbData = [];

    document.querySelectorAll('.galeria-item').forEach((item, i) => {
      const img   = item.querySelector('img');
      const label = item.querySelector('.galeria-item-label');
      const caption = label ? label.textContent.trim() : (img.alt || '');
      lbData.push({ src: img.src, alt: img.alt, caption });
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Ampliar foto: ' + caption);
      item.addEventListener('click', () => openLightbox(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });

    function openLightbox(i) {
      lbIdx = i; updateLb();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => document.getElementById('lb-close').focus());
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    function updateLb() {
      const d = lbData[lbIdx];
      lbImg.src = d.src; lbImg.alt = d.alt;
      lbCaption.textContent = d.caption;
      lbCounter.textContent = (lbIdx + 1) + ' / ' + lbData.length;
    }
    function lbPrev() { lbIdx = (lbIdx - 1 + lbData.length) % lbData.length; updateLb(); }
    function lbNext() { lbIdx = (lbIdx + 1) % lbData.length; updateLb(); }

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', lbPrev);
    document.getElementById('lb-next').addEventListener('click', lbNext);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'Escape') closeLightbox();
    });
  })();

    // ── 3D TILT NOS CARDS ──
  document.querySelectorAll('.sauna-card, .preco-card').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  // ── HERO PARALLAX ──
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    }, { passive: true });
  }

  // ── SHINE EFFECT NOS CARDS ──
  document.querySelectorAll('.preco-card, .depo-card, .pillar').forEach(el => {
    el.classList.add('shine-card');
  });

  // ════════════════════════════════════════════════
  //  PREMIUM ANIMATIONS v2
  // ════════════════════════════════════════════════

  // ── PAGE LOADER ──
  (function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    const hide = () => loader.classList.add('hidden');
    // Minimum 1.8s display so the animation completes
    const t = performance.now();
    const minTime = 1800;
    const doHide = () => {
      const elapsed = performance.now() - t;
      const wait = Math.max(0, minTime - elapsed);
      setTimeout(hide, wait);
    };
    if (document.readyState === 'complete') doHide();
    else window.addEventListener('load', doHide);
  })();


  // ── SPLIT-WORD TITLE REVEAL ──
  (function () {
    // Only target .section-title elements not themselves reveal (those use opacity reveal)
    document.querySelectorAll('.section-title').forEach(el => {
      // Already processed
      if (el.classList.contains('split-reveal')) return;

      const raw = el.innerHTML.trim().replace(/\s+/g, ' ');
      // Match <em>...</em> as a single unit, or any non-whitespace text token
      el.innerHTML = raw.replace(
        /(<em>[^<]*<\/em>|[^\s<]+)/g,
        '<span class="word-wrap"><span class="word-inner">$1</span></span>'
      );
      el.classList.add('split-reveal');

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          // Stagger each word
          el.querySelectorAll('.word-inner').forEach((w, i) => {
            w.style.transitionDelay = (i * 0.1) + 's';
          });
          // Small delay so parent reveal can start first
          setTimeout(() => el.classList.add('sr-visible'), 80);
          obs.unobserve(el);
        });
      }, { threshold: 0.25 });
      obs.observe(el);
    });
  })();

  // ── CLIP-PATH IMAGE REVEAL (sobre frame) ──
  (function () {
    const sobreVisual = document.querySelector('.sobre-visual');
    if (!sobreVisual) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        // Delay so container opacity reveal starts first
        setTimeout(() => sobreVisual.classList.add('clip-in'), 220);
        obs.unobserve(sobreVisual);
      });
    }, { threshold: 0.18 });
    obs.observe(sobreVisual);
  })();

  // ── MAGNETIC BUTTONS ──
  (function () {
    const STRENGTH = 0.38;
    const selectors = '.btn-primary, .btn-white, .btn-ghost, .btn-outline-white, .nav-cta';
    document.querySelectorAll(selectors).forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - (r.left + r.width  / 2)) * STRENGTH).toFixed(1);
        const y = ((e.clientY - (r.top  + r.height / 2)) * STRENGTH).toFixed(1);
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  })();

  // ── AMBIENT PARTICLES (dark sections) ──
  (function () {
    const sections = document.querySelectorAll('.beneficios, .horarios, .bar-lazer');
    sections.forEach(section => {
      const layer = document.createElement('div');
      layer.className = 'particles-layer';
      section.insertBefore(layer, section.firstChild);

      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'particle-dot';
        const size   = (Math.random() * 2.5 + 0.8).toFixed(1);
        const travel = Math.floor(Math.random() * 90 + 55);
        const dur    = (Math.random() * 12 + 7).toFixed(1);
        const delay  = (Math.random() * -15).toFixed(2);
        const maxOp  = (Math.random() * 0.07 + 0.03).toFixed(3);
        dot.style.cssText =
          `width:${size}px;height:${size}px;` +
          `left:${(Math.random() * 100).toFixed(1)}%;` +
          `bottom:${(Math.random() * 60).toFixed(1)}%;` +
          `--travel:${travel}px;--dur:${dur}s;--delay:${delay}s;--max-op:${maxOp};`;
        layer.appendChild(dot);
      }
    });
  })();

  // ── STAGGER: saunas, preços, depoimentos, serviços ──
  (function () {
    const configs = [
      { containerSel: '.saunas-grid',    childSel: '.sauna-card',    delay: 0.09 },
      { containerSel: '.precos-grid',    childSel: '.preco-card',    delay: 0.1  },
      { containerSel: '.depos-grid',     childSel: '.depo-card',     delay: 0.08 },
      { containerSel: '.servicos-list',  childSel: '.servico-item',  delay: 0.07 },
    ];
    configs.forEach(({ containerSel, childSel, delay }) => {
      const container = document.querySelector(containerSel);
      if (!container) return;
      const children = Array.from(container.querySelectorAll(childSel))
        .filter(c => !c.classList.contains('reveal') && !c.classList.contains('stagger-child'));
      children.forEach((child, i) => {
        child.style.transitionDelay = (i * delay) + 's';
      });
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          container.classList.add('stg-done');
          // Reset delays after animation completes
          setTimeout(() => children.forEach(c => { c.style.transitionDelay = ''; }), 1200);
          obs.unobserve(container);
        });
      }, { threshold: 0.07 });
      obs.observe(container);
    });
  })();

  // ── BACK TO TOP ──
  (function () {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ── ACTIVE NAV ──
  (function () {
    const sections = [
      { id: 'sobre',    navHref: '#sobre' },
      { id: 'saunas',   navHref: '#saunas' },
      { id: 'servicos', navHref: '#servicos' },
      { id: 'precos',   navHref: '#precos' },
      { id: 'horarios', navHref: '#horarios' },
    ];
    const navLinks = document.querySelectorAll('.nav-links a');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove('nav-active'));
        const s = sections.find(s => s.id === e.target.id);
        if (s) {
          const link = document.querySelector(`.nav-links a[href="${s.navHref}"]`);
          if (link) link.classList.add('nav-active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -55% 0px' });
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
  })();

  // ── ROTEIRO STEPS: draw connecting line on scroll ──
  (function () {
    const roteiroLine = document.querySelector('.roteiro-steps::before');
    // CSS handles this; enhance with scroll class
    const steps = document.querySelector('.roteiro-steps');
    if (!steps) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          steps.style.setProperty('--line-opacity', '1');
          obs.unobserve(steps);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(steps);
  })();

  // ── ROTEIRO RING POP ──
  (function () {
    const steps = document.querySelectorAll('.roteiro-step');
    if (!steps.length) return;
    const stepsArr = Array.from(steps);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = stepsArr.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('ring-pop');
        }, idx * 110);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.55 });
    steps.forEach(s => obs.observe(s));
  })();

  // ── WORD ROTATOR (HERO TITLE) ──
  (function () {
    const words = ['bem‑estar', 'relaxamento', 'renovação', 'tranquilidade'];
    const el = document.querySelector('.hero-title .hero-rotate-em');
    if (!el) return;
    // Respect reduced motion — just keep static
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let idx = 0;
    el.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
    setInterval(() => {
      idx = (idx + 1) % words.length;
      el.style.opacity = '0';
      el.style.transform = 'translateY(9px)';
      setTimeout(() => {
        el.textContent = words[idx];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 380);
    }, 3600);
  })();

  // ══════════════════════════════════════════════
  //  TRANSIÇÃO ENTRE PÁGINAS
  //  Fade suave ao clicar em links para outras páginas
  // ══════════════════════════════════════════════
  (function () {
    // Aplica transição de saída antes de navegar
    function navigateWithTransition(href) {
      document.body.classList.add('exiting');
      setTimeout(() => { window.location.href = href; }, 280);
    }

    // Intercepta todos os links que apontam para outras páginas do site
    const sitePages = ['index.html', 'experiencia.html', 'bar-cardapio.html', 'visitar.html'];
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const page = href.split('#')[0];
      if (sitePages.includes(page) && href !== window.location.pathname.split('/').pop()) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          navigateWithTransition(href);
        });
      }
    });

    // Mesmo para botoes com data-href
    document.querySelectorAll('[data-href]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateWithTransition(btn.dataset.href);
      });
    });
  })();
