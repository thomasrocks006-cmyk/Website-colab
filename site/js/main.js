/* ============================================
   CAMBER & CASPER — SHARED JAVASCRIPT
   Scroll reveal, navigation, splash screen
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- SPLASH SCREEN ---
  const splash = document.querySelector('.splash');
  if (splash) {
    // Fade out + scale up, then remove from flow
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
