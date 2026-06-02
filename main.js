const HCF_BOOKING_OPTIONS = {
  trial: { slotId: 'mt-trial', course: '泰拳團課體驗', price: 400 },
  muaythai: { slotId: 'mt-trial', course: '泰拳團課體驗', price: 400 },
  kickboxing: { slotId: 'kb-trial', course: '踢拳團課體驗', price: 400 },
  sanda: { slotId: 'kb-trial', course: '散打團課體驗', price: 400 },
  strength: { slotId: 'kb-trial', course: '肌力體能團課體驗', price: 400 },
  group: { slotId: 'mt-trial', course: '團體課程體驗', price: 400 },
  'group-class': { slotId: 'mt-trial', course: '團體課程體驗', price: 400 },
  private: { slotId: 'private-1', course: '私教體驗 1堂', price: 1400 },
  'private-class': { slotId: 'private-1', course: '私教體驗 1堂', price: 1400 },
  'private-double': { slotId: 'private-2', course: '私教體驗 2堂', price: 2400 },
};

const HCF_SCHEDULE = [
  {
    key: 'mon', label: '週一', courses: [
      { name: 'Muay Thai Base', zh: '泰拳基礎', time: '19:00 - 20:10', coach: '黃謙和', level: 'All Levels', blurb: '步伐、拳肘膝腿連動，適合想扎穩基本功的新手。' },
      { name: 'Strength Forge', zh: '肌力體能', time: '20:20 - 21:20', coach: 'Allen', level: 'Beginner+', blurb: '提升核心、爆發力與體能底盤，讓輸出更穩更久。' },
    ]
  },
  {
    key: 'tue', label: '週二', courses: [
      { name: 'Kickboxing Flow', zh: '踢拳節奏', time: '18:40 - 19:50', coach: 'Allen', level: 'All Levels', blurb: '拳腿轉換、距離管理、速度節奏一次建立。' },
      { name: 'Private Lab', zh: '私教時段', time: '20:00 - 21:30', coach: '預約安排', level: 'Custom', blurb: '依照減脂、技巧修正與比賽需求客製規劃。' },
    ]
  },
  {
    key: 'wed', label: '週三', courses: [
      { name: 'Sanda Engine', zh: '散打攻防', time: '19:00 - 20:10', coach: '鄭豫', level: 'Intermediate', blurb: '切入、摔防與攻防節奏，適合想提升實戰轉換的學員。' },
      { name: 'Shark Conditioning', zh: '燃脂循環', time: '20:20 - 21:10', coach: '高大可', level: 'Beginner', blurb: '高燃脂心肺循環，建立耐力與穩定呼吸節奏。' },
    ]
  },
  {
    key: 'thu', label: '週四', courses: [
      { name: 'Muay Thai Power', zh: '泰拳火力', time: '19:00 - 20:10', coach: '黃謙和', level: 'All Levels', blurb: '打靶、組合拳與爆發輸出，喚醒戰鬥 DNA。' },
      { name: 'Kickboxing Drill', zh: '踢拳拆解', time: '20:20 - 21:20', coach: 'Allen', level: 'Beginner+', blurb: '反應、閃躲、反擊的節奏細節深度拆解。' },
    ]
  },
  {
    key: 'fri', label: '週五', courses: [
      { name: 'Group Combat', zh: '團體綜合課', time: '19:00 - 20:10', coach: '輪值教練', level: 'All Levels', blurb: '全館熱血週五課，拳腿打靶、對練與體能一次到位。' },
      { name: 'Fight IQ', zh: '實戰策略', time: '20:20 - 21:20', coach: '黃謙和', level: 'Intermediate+', blurb: '針對擂台與自我突破設計的高濃度技巧時段。' },
    ]
  },
  {
    key: 'sat', label: '週六', courses: [
      { name: 'Starter Class', zh: '新手啟動班', time: '11:30 - 12:30', coach: 'Allen', level: 'Starter', blurb: '完全新手友善，從暖身、站姿到第一套組合安全入門。' },
      { name: 'Family Group', zh: '假日團課', time: '13:00 - 14:10', coach: '輪值教練', level: 'All Levels', blurb: '假日熱門時段，節奏輕快、氣氛熱血、適合揪伴同行。' },
    ]
  },
  {
    key: 'sun', label: '週日', courses: [
      { name: 'Recovery Flow', zh: '恢復訓練', time: '11:30 - 12:20', coach: '小米', level: 'All Levels', blurb: '放鬆、伸展與穩定動作修正，讓身體回到最佳狀態。' },
      { name: 'Private Focus', zh: '私教深度課', time: '13:00 - 15:00', coach: '預約安排', level: 'Custom', blurb: '進度追蹤、技術校正與目標突破，採預約制。' },
    ]
  },
];

const HCF_FAQ_FALLBACK = '⚠️ 鯊魚教練暫時離線，請直接點擊 LINE 與真人教練確認。';

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function setThemeLabel() {
  const label = document.getElementById('theme-toggle-label');
  if (label) {
    label.textContent = document.documentElement.classList.contains('light-mode') ? 'Dark' : 'Light';
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle('light-mode');
  localStorage.setItem('hcf-light-mode', document.documentElement.classList.contains('light-mode') ? '1' : '0');
  setThemeLabel();
}
window.toggleTheme = toggleTheme;

function openDrawer(which) {
  const backdrop = document.getElementById('drawer-backdrop');
  const target = document.getElementById(which === 'brand' ? 'brand-drawer' : 'nav-drawer');
  const other = document.getElementById(which === 'brand' ? 'nav-drawer' : 'brand-drawer');
  if (!target || !backdrop) return;
  backdrop.classList.add('is-open');
  target.classList.add('is-open');
  other?.classList.remove('is-open');
  document.body.style.overflow = 'hidden';
}
window.openDrawer = openDrawer;

function closeAllDrawers() {
  document.getElementById('drawer-backdrop')?.classList.remove('is-open');
  document.getElementById('brand-drawer')?.classList.remove('is-open');
  document.getElementById('nav-drawer')?.classList.remove('is-open');
  document.body.style.overflow = '';
}
window.closeAllDrawers = closeAllDrawers;

function resolveBookingOption(courseKey) {
  const normalized = (courseKey || '').toString().trim().toLowerCase();
  return HCF_BOOKING_OPTIONS[normalized] || HCF_BOOKING_OPTIONS.trial;
}

function openBooking(courseKey) {
  const modal = document.getElementById('booking-modal');
  const select = document.getElementById('booking-course');
  const option = resolveBookingOption(courseKey || document.body.dataset.bookingDefault);
  if (select) {
    const matched = Array.from(select.options).find((item) => item.value === option.slotId);
    if (matched) {
      select.value = option.slotId;
      select.dataset.courseName = matched.dataset.course;
      select.dataset.price = matched.dataset.price;
    }
  }
  modal?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
window.openBooking = openBooking;

function closeBooking() {
  document.getElementById('booking-modal')?.classList.remove('is-open');
  document.body.style.overflow = '';
}
window.closeBooking = closeBooking;

async function submitBooking() {
  const name = document.getElementById('booking-name');
  const phone = document.getElementById('booking-phone');
  const course = document.getElementById('booking-course');
  const notes = document.getElementById('booking-notes');
  const feedback = document.getElementById('booking-feedback');
  if (!course || !phone) return;
  if (!phone.value.trim()) {
    feedback.textContent = '請先留下聯絡電話，我們才能為你保留時段。';
    return;
  }
  const selected = course.options[course.selectedIndex];
  const payload = {
    slotId: selected.value,
    course: selected.dataset.course,
    price: Number(selected.dataset.price || 0),
    name: name?.value?.trim() || '匿名',
    phone: phone.value.trim(),
    source: 'website',
    notes: notes?.value?.trim() || '',
  };
  feedback.textContent = '傳送中…';
  try {
    const response = await fetch('/.netlify/functions/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '預約失敗');
    feedback.textContent = `已收到 ${data.booking?.course || payload.course} 預約需求，我們會盡快與你聯繫。`;
    document.getElementById('booking-form')?.reset();
    setTimeout(closeBooking, 1200);
  } catch (error) {
    feedback.textContent = error.message || '目前系統繁忙，請改用 LINE 洽詢。';
  }
}
window.submitBooking = submitBooking;

function toggleAiPanel(force) {
  const panel = document.getElementById('ai-chat-panel');
  if (!panel) return;
  const shouldOpen = typeof force === 'boolean' ? force : !panel.classList.contains('is-open');
  panel.classList.toggle('is-open', shouldOpen);
}
window.toggleAiPanel = toggleAiPanel;

async function sendAiMessage() {
  const input = document.getElementById('ai-chat-input');
  const list = document.getElementById('ai-chat-messages');
  if (!input || !list) return;
  const message = input.value.trim();
  if (!message) return;
  list.insertAdjacentHTML('beforeend', `<div class="ai-bubble user">${message}</div>`);
  input.value = '';
  list.insertAdjacentHTML('beforeend', '<div class="ai-bubble bot" data-loading="1">鯊魚教練正在分析你的訓練路徑…</div>');
  list.scrollTop = list.scrollHeight;
  try {
    const response = await fetch('/.netlify/functions/chat-claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    const loading = list.querySelector('[data-loading="1"]');
    if (loading) loading.remove();
    list.insertAdjacentHTML('beforeend', `<div class="ai-bubble bot">${data.reply || HCF_FAQ_FALLBACK}</div>`);
  } catch (error) {
    const loading = list.querySelector('[data-loading="1"]');
    if (loading) loading.remove();
    list.insertAdjacentHTML('beforeend', `<div class="ai-bubble bot">${HCF_FAQ_FALLBACK}</div>`);
  }
  list.scrollTop = list.scrollHeight;
}
window.sendAiMessage = sendAiMessage;

function renderSchedule() {
  const tabs = document.getElementById('schedule-day-tabs');
  const grid = document.getElementById('schedule-course-grid');
  const detail = document.getElementById('schedule-course-detail');
  if (!tabs || !grid || !detail) return;

  const todayIndex = new Date().getDay();
  const indexMap = [6, 0, 1, 2, 3, 4, 5];
  let activeDay = HCF_SCHEDULE[indexMap[todayIndex] || 0].key;
  let activeCourseIndex = 0;

  function renderTabs() {
    tabs.innerHTML = HCF_SCHEDULE.map((day, index) => {
      const isToday = index === (indexMap[todayIndex] || 0);
      return `<button class="schedule-tab ${day.key === activeDay ? 'is-active' : ''}" data-day="${day.key}">${day.label}${isToday ? '<span class="today-dot"></span>' : ''}</button>`;
    }).join('');
  }

  function renderCards() {
    const day = HCF_SCHEDULE.find((item) => item.key === activeDay) || HCF_SCHEDULE[0];
    grid.innerHTML = day.courses.map((course, index) => `
      <button class="schedule-card text-left p-5 ${index === activeCourseIndex ? 'is-active' : ''}" data-index="${index}">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-brand-red">${course.name}</p>
            <h3 class="text-xl font-display font-semibold text-brand-text">${course.zh}</h3>
          </div>
          <span class="text-sm text-brand-muted">${course.time}</span>
        </div>
        <p class="text-sm text-brand-muted leading-7">${course.blurb}</p>
      </button>
    `).join('');
    renderDetail();
  }

  function renderDetail() {
    const day = HCF_SCHEDULE.find((item) => item.key === activeDay) || HCF_SCHEDULE[0];
    const course = day.courses[activeCourseIndex] || day.courses[0];
    detail.innerHTML = `
      <p class="brand-kicker mb-4">Today Signal / ${day.label}</p>
      <h3 class="text-3xl font-display text-brand-text mb-3">${course.zh}</h3>
      <div class="space-y-3 text-sm text-brand-muted">
        <div class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 px-4 py-3"><span>時間</span><strong class="text-brand-text">${course.time}</strong></div>
        <div class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 px-4 py-3"><span>教練</span><strong class="text-brand-text">${course.coach}</strong></div>
        <div class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 px-4 py-3"><span>程度</span><strong class="text-brand-text">${course.level}</strong></div>
      </div>
      <p class="mt-5 text-sm leading-7 text-brand-muted">${course.blurb}</p>
      <button class="cta-secondary magnetic-btn mt-6 w-full" onclick="openBooking('${course.name.toLowerCase().includes('private') ? 'private' : day.key === 'tue' ? 'kickboxing' : day.key === 'wed' ? 'sanda' : day.key === 'sun' ? 'group' : 'muaythai'}')">預約這堂課</button>
    `;
  }

  renderTabs();
  renderCards();

  tabs.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-day]');
    if (!btn) return;
    activeDay = btn.dataset.day;
    activeCourseIndex = 0;
    renderTabs();
    renderCards();
  });

  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-index]');
    if (!btn) return;
    activeCourseIndex = Number(btn.dataset.index || 0);
    renderCards();
  });
}

function initFadeUp() {
  const items = $all('.fade-up');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  items.forEach((item) => observer.observe(item));
}

function initMagnetic() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  $all('.magnetic-btn').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
}

function initCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let ringX = 0;
  let ringY = 0;
  let mouseX = 0;
  let mouseY = 0;

  const tick = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(tick);
  };
  tick();

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  $all('a, button, summary, input, textarea, select').forEach((item) => {
    item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

function initStandaloneMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  document.documentElement.classList.toggle('is-standalone', isStandalone);
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initCoachCards() {
  if (window.matchMedia('(hover:hover)').matches) return;
  $all('.coach-card').forEach((card) => {
    card.addEventListener('toggle', () => {
      card.classList.toggle('is-touch-open', card.open);
    });
  });
}

function initImageFallbacks() {
  $all('img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallback && image.src !== image.dataset.fallback) {
        image.src = image.dataset.fallback;
      }
    }, { once: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('hcf-light-mode') === '1') {
    document.documentElement.classList.add('light-mode');
  }
  setThemeLabel();
  initStandaloneMode();
  initFadeUp();
  initMagnetic();
  initCursor();
  initNavbar();
  initCoachCards();
  initImageFallbacks();
  renderSchedule();

  document.getElementById('drawer-backdrop')?.addEventListener('click', closeAllDrawers);
  document.getElementById('ai-chat-submit')?.addEventListener('click', sendAiMessage);
  document.getElementById('ai-chat-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendAiMessage();
  });
  document.getElementById('booking-course')?.addEventListener('change', (event) => {
    const selected = event.target.options[event.target.selectedIndex];
    event.target.dataset.courseName = selected.dataset.course;
    event.target.dataset.price = selected.dataset.price;
  });
  document.getElementById('booking-modal')?.addEventListener('click', (event) => {
    if (event.target.id === 'booking-modal') closeBooking();
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.getAttribute('href') !== '#') closeAllDrawers();
    });
  });
  const year = document.getElementById('site-year');
  if (year) year.textContent = String(new Date().getFullYear());
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
