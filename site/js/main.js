/* ============================================
   CAMBER & CASPER — SHARED JAVASCRIPT
   Full Premium Feature Set v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- SPLASH SCREEN ---
  const splash = document.querySelector('.splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      setTimeout(() => { splash.style.display = 'none'; }, 1100);
    }, 2800);
  }

  // --- NAV SCROLL ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // --- SCROLL REVEAL ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  }

  // --- MOBILE MENU ---
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- ACTIVE NAV LINK ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // PREMIUM FEATURES
  // ============================================

  // --- CUSTOM CURSOR ---
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    const dot = document.createElement('div');
    dot.className = 'cc-cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cc-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
    }, { passive: true });

    // Smooth ring follow
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Hover expand
    document.querySelectorAll('a, button, [role="button"], .tilt-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    // Click shrink
    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

    // Dark section detection
    const darkEls = document.querySelectorAll('.section-dark, .card-dark, [style*="background: var(--cc-zinc-950)"], [style*="background:var(--cc-zinc-950)"], [style*="background:#09090b"]');
    window.addEventListener('scroll', () => {
      let onDark = false;
      darkEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (mouseY >= rect.top && mouseY <= rect.bottom) onDark = true;
      });
      dot.classList.toggle('on-dark', onDark);
      ring.classList.toggle('on-dark', onDark);
    }, { passive: true });
  }

  // --- SCROLL PROGRESS BAR ---
  const progressBar = document.createElement('div');
  progressBar.className = 'cc-progress-bar';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }, { passive: true });

  // --- FLOATING CTA BAR ---
  const floatCta = document.createElement('div');
  floatCta.className = 'cc-float-cta';
  floatCta.innerHTML = `
    <span class="cc-float-cta-label">100 Agents</span>
    <div class="cc-float-cta-divider"></div>
    <span class="cc-float-cta-price">$799<span style="font-size:0.75rem;font-weight:400;color:var(--cc-zinc-400)">/mo</span></span>
    <div class="cc-float-cta-divider"></div>
    <a href="pricing.html" class="cc-float-cta-btn">Deploy Now →</a>
    <button class="cc-float-cta-close" aria-label="Close">✕</button>
  `;
  document.body.appendChild(floatCta);
  let ctaDismissed = false;
  const ctaClose = floatCta.querySelector('.cc-float-cta-close');
  ctaClose.addEventListener('click', () => { ctaDismissed = true; floatCta.classList.remove('visible'); });
  window.addEventListener('scroll', () => {
    if (!ctaDismissed) floatCta.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  // --- NUMBER COUNTER ANIMATIONS ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
          const start = performance.now();
          const easeOut = t => 1 - Math.pow(1 - t, 3);
          (function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = target * easeOut(progress);
            el.textContent = prefix + (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          })(start);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  }

  // --- TYPEWRITER / TEXT CYCLE (hero only) ---
  const typeTarget = document.getElementById('typewriter-cycle');
  if (typeTarget) {
    const words = typeTarget.dataset.words ? JSON.parse(typeTarget.dataset.words) : [];
    if (words.length > 1) {
      let idx = 0;
      typeTarget.textContent = words[0];
      setInterval(() => {
        typeTarget.classList.add('fade-out');
        setTimeout(() => {
          idx = (idx + 1) % words.length;
          typeTarget.textContent = words[idx];
          typeTarget.classList.remove('fade-out');
          typeTarget.classList.add('fade-in');
          requestAnimationFrame(() => requestAnimationFrame(() => typeTarget.classList.remove('fade-in')));
        }, 350);
      }, 2600);
    }
  }

  // --- 3D CARD TILT ---
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });

  // --- DARK MODE TOGGLE (Camber ☀ / Casper ☾) ---
  const themeToggle = document.createElement('button');
  themeToggle.className = 'cc-theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle Casper dark mode');
  const savedTheme = localStorage.getItem('cc-theme') || 'camber';
  if (savedTheme === 'casper') document.documentElement.setAttribute('data-theme', 'casper');
  themeToggle.textContent = savedTheme === 'casper' ? '☀' : '☾';
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'casper' ? 'camber' : 'casper';
    document.documentElement.setAttribute('data-theme', next === 'camber' ? '' : next);
    themeToggle.textContent = next === 'casper' ? '☀' : '☾';
    localStorage.setItem('cc-theme', next);
  });
  document.body.appendChild(themeToggle);

  // --- PAGE TRANSITION EXIT ---
  // Intercept internal link clicks → fade out then navigate
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    const isSameOrigin = href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto');
    if (isSameOrigin) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.documentElement.classList.add('cc-exiting');
        setTimeout(() => { window.location.href = href; }, 320);
      });
    }
  });

  // --- STICKY SCROLL STORYTELLING ---
  const stickyChapters = document.querySelectorAll('.cc-sticky-chapter');
  if (stickyChapters.length) {
    const panel = document.querySelector('.cc-sticky-panel');
    const pips = document.querySelectorAll('.cc-sticky-pip');
    const numLarge = document.querySelector('.cc-sticky-num-large');
    const badge = document.querySelector('.cc-sticky-badge');
    const title = document.querySelector('.cc-sticky-title');
    const desc = document.querySelector('.cc-sticky-desc');
    const layerPills = document.querySelector('.cc-sticky-layer-pills');

    const chapterData = [
      {
        layers: '01–07', color: 'var(--cc-blue-500)',
        badgeBg: 'rgba(59,130,246,0.08)', badgeBorder: 'rgba(59,130,246,0.2)', badgeColor: 'var(--cc-blue-600)',
        badgeText: 'The Cortex',
        title: 'Foundation Intelligence',
        desc: 'The bedrock of every decision. Macro forces, fiscal depth, market signals, and the psychological fingerprints of your buyers — synthesised into a single strategic truth.',
        pills: ['Macro Context', 'Fiscal Depth', 'Competitive Signal', 'Intent DNA'],
        pip: 'blue'
      },
      {
        layers: '08–14', color: 'var(--cc-emerald-500)',
        badgeBg: 'rgba(16,185,129,0.08)', badgeBorder: 'rgba(16,185,129,0.2)', badgeColor: 'var(--cc-emerald-500)',
        badgeText: 'Deep Tissue',
        title: 'Operational Reality',
        desc: 'Below the surface of every business is an engine of physical systems, human capital, and supply chains. Layers 8–14 read that engine in real time — down to tool battery levels.',
        pills: ['Operational Telemetry', 'Regulatory Sentinel', 'Supply Forensics', 'Dark Data Synthesis'],
        pip: 'green'
      },
      {
        layers: '15–19', color: 'var(--cc-amber-500)',
        badgeBg: 'rgba(245,158,11,0.08)', badgeBorder: 'rgba(245,158,11,0.2)', badgeColor: 'var(--cc-amber-500)',
        badgeText: 'Strategic Command',
        title: 'Revenue and Execution',
        desc: 'Strategy without execution is fiction. Layers 15–19 bridge the gap — from pipeline orchestration and client lifecycle mapping through to predictive risk and innovation signals.',
        pills: ['Revenue Architecture', 'Execution Cadence', 'Client Lifecycle', 'Risk Radar'],
        pip: 'amber'
      },
      {
        layers: '20–24', color: 'var(--cc-red-500)',
        badgeBg: 'rgba(239,68,68,0.08)', badgeBorder: 'rgba(239,68,68,0.2)', badgeColor: 'var(--cc-red-500)',
        badgeText: 'Sovereign Core',
        title: 'Protective Intelligence',
        desc: 'The final five layers protect your sovereignty — cryptographic audit trails, reputational sentinel, existential risk scanning, and the continuous governance loop that keeps you untouchable.',
        pills: ['Cryptographic Audit', 'Reputational Sentinel', 'Existential Risk', 'Governance Loop'],
        pip: 'red'
      }
    ];

    function activateChapter(idx) {
      const d = chapterData[idx];
      if (!d || !panel) return;
      stickyChapters.forEach((ch, i) => ch.classList.toggle('active', i === idx));
      pips.forEach((p, i) => {
        p.classList.toggle('active', i === idx);
        p.className = `cc-sticky-pip ${chapterData[i].pip}${i === idx ? ' active' : ''}`;
      });
      if (numLarge) { numLarge.style.color = d.color; numLarge.textContent = d.layers; }
      if (badge) {
        badge.style.background = d.badgeBg;
        badge.style.border = `1px solid ${d.badgeBorder}`;
        badge.style.color = d.badgeColor;
        badge.textContent = d.badgeText;
      }
      if (title) title.textContent = d.title;
      if (desc) desc.textContent = d.desc;
      if (layerPills) {
        layerPills.innerHTML = d.pills.map(p =>
          `<span class="cc-sticky-layer-pill" style="border:1px solid ${d.badgeBorder};color:${d.color}">${p}</span>`
        ).join('');
      }
    }

    activateChapter(0);

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(stickyChapters).indexOf(entry.target);
          if (idx >= 0) activateChapter(idx);
        }
      });
    }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });
    stickyChapters.forEach(ch => chapterObserver.observe(ch));
  }

  // --- PAGE-SPECIFIC CALCULATOR INIT ---
  const quantifierSlider = document.querySelector('.quantifier-slider');
  if (quantifierSlider && typeof updateCalculator === 'function') {
    updateCalculator(quantifierSlider.value);
  }

});

// --- COMPETITIVE RACE SIMULATOR ---
function startRace(btn) {
  const section = btn.closest('.race-section');
  const humanFill = section.querySelector('.race-human');
  const ccFill = section.querySelector('.race-cc');
  const isRacing = btn.dataset.racing === 'true';
  if (isRacing) {
    humanFill.style.width = '0';
    ccFill.style.width = '0';
    btn.textContent = 'Start Race';
    btn.dataset.racing = 'false';
  } else {
    humanFill.style.width = '10%';
    ccFill.style.width = '100%';
    btn.textContent = 'Reset';
    btn.dataset.racing = 'true';
  }
}

// --- AUTONOMY CALCULATOR ---
function updateCalculator(value) {
  const employees = parseInt(value);
  const salaryBase = 68000;
  const overhead = 1.28;
  const humanMonthly = (salaryBase * overhead * employees) / 12;
  const ccMonthly = 799;
  const yearlySavings = (salaryBase * overhead * employees) - (799 * 12);

  document.getElementById('calc-employees').textContent = employees;
  document.getElementById('calc-human-cost').textContent = Math.round(humanMonthly).toLocaleString();
  document.getElementById('calc-savings').textContent = '$' + Math.round(yearlySavings / 1000) + 'k';

  const plays = document.getElementById('calc-plays');
  if (plays) {
    if (yearlySavings < 100000) {
      plays.innerHTML = '<div class="play">Toyota HiLux SR5 — fully funded in 10 months</div><div class="play">500% Marketing Boost — total local search domination</div><div class="play">3 Months Off (Paid) — full quarter sabbatical</div>';
    } else if (yearlySavings < 300000) {
      plays.innerHTML = '<div class="play">New Warehouse Lease — 2 years covered</div><div class="play">3x Fully Kitted Vans — expand service radius</div><div class="play">Owner Equity — direct injection into super/offset</div>';
    } else {
      plays.innerHTML = '<div class="play">Franchise Expansion — second territory with zero debt</div><div class="play">Full Sales Agency — massive marketing retainer</div><div class="play">Commercial Property — 20% deposit on $1.5M warehouse</div>';
    }
  }
}

// --- NAV SCROLL ---
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// --- SCROLL REVEAL ---
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

// --- MOBILE MENU ---
const menuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- ACTIVE NAV LINK ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// --- PAGE-SPECIFIC CALCULATOR INIT ---
const quantifierSlider = document.querySelector('.quantifier-slider');
if (quantifierSlider && typeof updateCalculator === 'function') {
  updateCalculator(quantifierSlider.value);
}

});

// --- COMPETITIVE RACE SIMULATOR ---
function startRace(btn) {
  const section = btn.closest('.race-section');
  const humanFill = section.querySelector('.race-human');
  const ccFill = section.querySelector('.race-cc');
  const isRacing = btn.dataset.racing === 'true';

  if (isRacing) {
    humanFill.style.width = '0';
    ccFill.style.width = '0';
    btn.textContent = 'Start Race';
    btn.dataset.racing = 'false';
  } else {
    humanFill.style.width = '10%';
    ccFill.style.width = '100%';
    btn.textContent = 'Reset';
    btn.dataset.racing = 'true';
  }
}

// --- AUTONOMY CALCULATOR ---
function updateCalculator(value) {
  const employees = parseInt(value);
  const salaryBase = 68000;
  const overhead = 1.28;
  const humanMonthly = (salaryBase * overhead * employees) / 12;
  const ccMonthly = 799;
  const yearlySavings = (salaryBase * overhead * employees) - (799 * 12);

  document.getElementById('calc-employees').textContent = employees;
  document.getElementById('calc-human-cost').textContent = Math.round(humanMonthly).toLocaleString();
  document.getElementById('calc-savings').textContent = '$' + Math.round(yearlySavings / 1000) + 'k';

  // Update reinvestment plays
  const plays = document.getElementById('calc-plays');
  if (plays) {
    if (yearlySavings < 100000) {
      plays.innerHTML = '<div class="play">Toyota HiLux SR5 — fully funded in 10 months</div><div class="play">500% Marketing Boost — total local search domination</div><div class="play">3 Months Off (Paid) — full quarter sabbatical</div>';
    } else if (yearlySavings < 300000) {
      plays.innerHTML = '<div class="play">New Warehouse Lease — 2 years covered</div><div class="play">3x Fully Kitted Vans — expand service radius</div><div class="play">Owner Equity — direct injection into super/offset</div>';
    } else {
      plays.innerHTML = '<div class="play">Franchise Expansion — second territory with zero debt</div><div class="play">Full Sales Agency — massive marketing retainer</div><div class="play">Commercial Property — 20% deposit on $1.5M warehouse</div>';
    }
  }
}

// --- TABS ---
function switchTab(btn, group) {
  const parent = btn.closest('.tab-group');
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(group + '-' + btn.dataset.tab).classList.add('active');
}

/* ============================================
   PASS 3 PREMIUM FEATURES
   ============================================ */

// --- BACK TO TOP ---
(function () {
  const btn = document.getElementById('cc-back-top');
  if (!btn) return;
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// --- FAQ ACCORDION ---
document.querySelectorAll('.cc-faq-item').forEach(item => {
  const btn = item.querySelector('.cc-faq-q');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all siblings
    item.closest('.cc-faq').querySelectorAll('.cc-faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// --- SPOTLIGHT HOVER ON .cc-spotlight-card ---
document.querySelectorAll('.cc-spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
