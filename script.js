/**
 * TORI SNACKS & SIPS - Script Logic
 * - Real Google Apps Script Order Tracking (api_testing.html logic)
 * - Potion Roulette Spin & Celebrations
 * - Smooth Scrolling & Navigation
 */

const API_URL = "https://script.google.com/macros/s/AKfycbw11jg4D_8gfogGQhviVET-Hom6LAlDvUIg_pEEfklQ4zQFuYeKQ2GQ16y0f9zCRF_jtA/exec";

// ==========================================
// 1. Order Tracking API Logic
// ==========================================
async function checkOrderStatus() {
  const input = document.getElementById('tracking-input');
  const resultsContainer = document.getElementById('tracking-results');
  const checkBtn = document.getElementById('check-status-btn');

  const phoneNo = input ? input.value.trim() : '';

  if (!phoneNo) {
    alert('Please enter a WhatsApp number!');
    if (input) input.focus();
    return;
  }

  // Set loading state
  if (checkBtn) {
    checkBtn.disabled = true;
    checkBtn.innerText = 'Searching...';
  }

  resultsContainer.innerHTML = `
    <div class="bg-surface-container-low p-space-md rounded-xl text-center py-8">
      <span class="font-headline-sm text-headline-sm text-on-surface block mb-1">Checking Live Orders...</span>
      <span class="font-body-sm text-body-sm text-on-surface-variant">Searching orders for <strong>${escapeHtml(phoneNo)}</strong>...</span>
    </div>
  `;

  try {
    const response = await fetch(`${API_URL}?phoneNo=${encodeURIComponent(phoneNo)}`, {
      method: 'GET',
      redirect: 'follow'
    });

    const data = await response.json();

    if (data.status === 'success') {
      let ordersHtml = `
        <!-- Customer Header Tag -->
        <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div>
            <span class="font-headline-sm text-headline-sm text-on-surface">Customer: <strong class="text-primary font-black" id="customer-name">${escapeHtml(data.customerName)}</strong></span>
            <span class="font-body-sm text-body-sm text-on-surface-variant block" id="order-count">Found ${data.totalOrders} order(s)</span>
          </div>
          <span class="font-label-badge text-label-badge text-tertiary-container bg-surface-container px-3 py-1 rounded-full uppercase self-start sm:self-auto">
            Order Batch #04
          </span>
        </div>
      `;

      (data.orders || []).forEach(order => {
        let badgeStyle = 'bg-[#E2DFDE] text-[#474746]';
        const st = order.orderStatus || '';

        if (st === 'Delivered' || st === 'Done') {
          badgeStyle = 'bg-[#E8F8F0] text-[#2E7D32]';
        } else if (st === 'Ready to Deliver' || st === 'Ready') {
          badgeStyle = 'bg-[#E1F5FE] text-[#0277BD]';
        } else if (st === 'On-Make') {
          badgeStyle = 'bg-[#FFF3CD] text-[#856404]';
        } else if (st === 'Order Received') {
          badgeStyle = 'bg-[#CCE5FF] text-[#004085]';
        }

        ordersHtml += `
          <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm order-card-enter">
            <div>
              <span class="font-body-sm text-body-sm text-on-surface-variant block mb-1">${escapeHtml(order.timestamp)}</span>
              <span class="font-headline-sm text-headline-sm text-on-surface">Item: <span class="font-medium text-on-surface-variant">${escapeHtml(order.menu)}</span></span>
            </div>
            <span class="${badgeStyle} font-label-badge text-label-badge px-4 py-1.5 rounded-full uppercase self-start sm:self-auto">
              ${escapeHtml(st)}
            </span>
          </div>
        `;
      });

      resultsContainer.innerHTML = ordersHtml;
    } else if (data.status === 'not_found') {
      resultsContainer.innerHTML = `
        <div class="bg-surface-container-low p-space-md rounded-xl text-center py-6 border border-dashed border-outline-variant">
          <span class="font-headline-sm text-headline-sm text-primary uppercase block mb-1">No Orders Found</span>
          <p class="font-body-md text-body-md text-on-surface-variant mb-2">No active orders registered under WhatsApp number <strong>${escapeHtml(phoneNo)}</strong>.</p>
          <span class="font-body-sm text-body-sm text-on-surface-variant block">Please check that you entered the exact number submitted in the Google Form.</span>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = `
        <div class="bg-error-container text-on-error-container p-space-md rounded-xl text-center py-4">
          <p class="font-headline-sm text-headline-sm uppercase">Error Retrieving Orders</p>
          <p class="font-body-sm text-body-sm mt-1">Please try again in a few moments or contact kitchen admin.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Fetch order error:", error);
    resultsContainer.innerHTML = `
      <div class="bg-error-container text-on-error-container p-space-md rounded-xl text-center py-4">
        <p class="font-headline-sm text-headline-sm uppercase">Connection Error</p>
        <p class="font-body-sm text-body-sm mt-1">Unable to connect to order server. Please check your connection.</p>
      </div>
    `;
  } finally {
    if (checkBtn) {
      checkBtn.disabled = false;
      checkBtn.innerText = 'Check Status';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// 2. Interactive Potion Roulette Wheel
// ==========================================
let currentRotation = 0;
let isSpinning = false;

const drinkNames = [
  { name: 'Energy Potion (Matcha Latte)', color: '#2e7d32', id: 'potion-card-0' },
  { name: 'Ocean Potion (Blue Lemonade)', color: '#0288d1', id: 'potion-card-1' },
  { name: 'Galaxy Potion (Taro Latte)', color: '#7b1fa2', id: 'potion-card-2' },
  { name: 'Love Potion (Strawberry Milk)', color: '#d81b60', id: 'potion-card-3' },
  { name: 'Lucky Potion (Mango Yakult)', color: '#f57c00', id: 'potion-card-4' },
  { name: 'Rage Potion (Dark Chocolate)', color: '#4e342e', id: 'potion-card-5' }
];

function spinRoulette() {
  if (isSpinning) return;

  const wheel = document.getElementById('roulette-wheel');
  const pointer = document.getElementById('roulette-pointer');
  const resultText = document.getElementById('roulette-result');
  const btn = document.getElementById('spin-button');

  if (!wheel || !btn) return;

  isSpinning = true;
  btn.disabled = true;

  // Haptic feedback on mobile if supported
  if (navigator.vibrate) {
    try { navigator.vibrate([40, 30, 40]); } catch (e) {}
  }

  // Clear previous highlights
  drinkNames.forEach(d => {
    const el = document.getElementById(d.id);
    if (el) el.classList.remove('potion-highlight');
  });

  if (pointer) pointer.classList.add('pointer-ticking');

  const extraSpins = 5 * 360;
  const randomAngle = Math.floor(Math.random() * 360);
  currentRotation += extraSpins + randomAngle;

  wheel.style.transform = `rotate(${currentRotation}deg)`;
  resultText.innerHTML = '<span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary animate-ping"></span> Spinning magic potion wheel...</span>';

  // Wheel animation takes 3.2s (3200ms) to decelerate to a stop
  setTimeout(() => {
    if (pointer) pointer.classList.remove('pointer-ticking');

    const effectiveAngle = (360 - (currentRotation % 360)) % 360;
    const index = Math.floor(effectiveAngle / 60) % 6;
    const selected = drinkNames[index];

    resultText.innerHTML = `🎉 Fate Selected: <strong class="text-[#ffddb9] font-black uppercase underline decoration-2">${selected.name}</strong>!`;

    const winningCard = document.getElementById(selected.id);
    if (winningCard) {
      winningCard.classList.add('potion-highlight');
      // Scroll winning card into view on small screens if needed
      if (window.innerWidth < 1024) {
        winningCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    launchConfetti(selected.color);

    // Haptic celebration pulse
    if (navigator.vibrate) {
      try { navigator.vibrate([60, 50, 80, 50, 120]); } catch (e) {}
    }

    isSpinning = false;
    btn.disabled = false;
  }, 3200);
}

function launchConfetti(accentColor) {
  const colors = [accentColor, '#ffddb9', '#ffffff', '#af101a', '#ffb961', '#ffd54f'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'roulette-confetti';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${window.innerWidth / 2 + (Math.random() * 200 - 100)}px`;
    p.style.top = `${window.innerHeight * 0.42 + (Math.random() * 100 - 50)}px`;
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 420}px`);
    p.style.setProperty('--dy', `${Math.random() * 320 + 80}px`);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1600);
  }
}

// ==========================================
// 3. Scroll Reveal Engine (IntersectionObserver)
// ==========================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after revealing for optimal performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ==========================================
// 4. Mobile Bottom Navigation Scroll Spy
// ==========================================
function initMobileScrollSpy() {
  const sections = [
    { id: 'menu', navId: 'mobile-nav-menu' },
    { id: 'potions-section', navId: 'mobile-nav-potions' },
    { id: 'combos-section', navId: 'mobile-nav-combos' },
    { id: 'track-section', navId: 'mobile-nav-track' }
  ];

  const updateActiveNav = () => {
    const scrollPosition = window.scrollY + 200;

    let currentSectionId = null;
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = id;
        }
      }
    });

    sections.forEach(({ id, navId }) => {
      const navItem = document.getElementById(navId);
      if (navItem) {
        if (id === currentSectionId) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// ==========================================
// 5. Smooth Anchor Scrolling with Header Offset
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// 6. DOM Ready Initializations
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initMobileScrollSpy();
  initSmoothScroll();

  const trackingInput = document.getElementById('tracking-input');
  if (trackingInput) {
    trackingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkOrderStatus();
      }
    });
  }

  const quickTrackPill = document.getElementById('header-quick-track');
  if (quickTrackPill) {
    quickTrackPill.addEventListener('click', () => {
      const trackSection = document.getElementById('track-section');
      if (trackSection) {
        const headerOffset = 90;
        const offsetPosition = trackSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        setTimeout(() => {
          if (trackingInput) trackingInput.focus();
        }, 400);
      }
    });
  }
});
