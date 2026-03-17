/* ============================================================
   TALHA VFX — BRUTALIST main.js v4
   Cursor · Nav · Reveal · Skills · Form · Video · Filter
   ============================================================ */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  }));
  initCursor();
  initGrain();
  initNav();
  initMobileMenu();
  initReveal();
  initSkillBars();
  initSmoothScroll();
  initVideoHover();
  initVideoModal();
  initContactForm();
  initActiveNavLink();
  initWorkFilter();
});

/* ── CURSOR ──────────────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover:none)').matches) return;

  const dot  = document.createElement('div'); dot.className  = 'cur-dot';
  const ring = document.createElement('div'); ring.className = 'cur-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let dx = mx, dy = my, rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const tick = () => {
    // dot follows instantly
    dx += (mx - dx) * 0.55;
    dy += (my - dy) * 0.55;
    dot.style.left = dx + 'px';
    dot.style.top  = dy + 'px';
    // ring lags behind for that trailing feel
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  };
  tick();

  const TARGETS = 'a,button,[data-cursor],input,textarea,.tool,.wi,.work-item,.service-card,.filter-btn,.tl-col,.timeline-col';
  $$(TARGETS).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov');  ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
  });

  document.addEventListener('mousedown', () => { dot.classList.add('clicking');  ring.classList.add('clicking'); });
  document.addEventListener('mouseup',   () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.7'; });
}

/* ── GRAIN ───────────────────────────────────────────────────── */
function initGrain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9990;opacity:0.025;mix-blend-mode:multiply';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, rafId;
  const resize = () => {
    W = canvas.width  = Math.ceil(innerWidth  / 2);
    H = canvas.height = Math.ceil(innerHeight / 2);
    canvas.style.width  = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  };
  const draw = () => {
    const d = ctx.createImageData(W, H);
    const b = d.data;
    for (let i = 0; i < b.length; i += 4) {
      const v = Math.random() * 255 | 0;
      b[i] = b[i+1] = b[i+2] = v; b[i+3] = 18;
    }
    ctx.putImageData(d, 0, 0);
    rafId = requestAnimationFrame(draw);
  };
  document.addEventListener('visibilitychange', () => {
    document.hidden ? cancelAnimationFrame(rafId) : (!rafId && draw());
    if (!document.hidden) rafId = null, draw();
  });
  window.addEventListener('resize', resize, { passive: true });
  resize(); draw();
}

/* ── NAV ─────────────────────────────────────────────────────── */
function initNav() {
  // Nav is always visible/same in brutalist design — no scrolled state needed
}

/* ── MOBILE MENU ─────────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = $('#menuBtn');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;
  const close = () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.mm-link', menu).forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
function initReveal() {
  const els = $$('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = $$('[data-reveal]', e.target.parentElement);
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('vis'), idx * 80);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ── SKILL BARS ──────────────────────────────────────────────── */
function initSkillBars() {
  const fills = $$('.sb-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => { e.target.style.width = (e.target.dataset.w || '0') + '%'; }, 200);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  fills.forEach(f => obs.observe(f));
}

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = $('#nav')?.offsetHeight ?? 56;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - navH, behavior: 'smooth' });
    });
  });
}

/* ── VIDEO HOVER ─────────────────────────────────────────────── */
function initVideoHover() {
  $$('.wi, .work-item').forEach(card => {
    const vid = card.querySelector('.wi-bg-video');
    if (!vid) return;
    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  });
}

/* ── VIDEO MODAL ─────────────────────────────────────────────── */
function initVideoModal() {
  const modal = $('#vmodal');
  if (!modal) return;
  window.openVideo = src => {
    const v = $('#vmodal-video');
    if (!v) return;
    v.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    v.play().catch(() => {});
  };
  window.closeVideo = () => {
    const v = $('#vmodal-video');
    if (v) { v.pause(); v.src = ''; }
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  const closeBtn = modal.querySelector('.vmodal-close');
  if (closeBtn) closeBtn.addEventListener('click', window.closeVideo);
  modal.addEventListener('click', e => { if (e.target === modal) window.closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) window.closeVideo(); });
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  // ⚠️ Replace this with your actual Discord webhook URL
  const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1483608314158911500/A3ltwdowlHvKgs_bfgyXwnQumGbJ0b7hWFX60TdAD1PUCA5Rw3PK-fT7SWHS0iN0CRuC';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-submit');
    const orig = btn.textContent;

    const name    = (form.querySelector('#name')?.value    || '').trim();
    const email   = (form.querySelector('#email')?.value   || '').trim();
    const project = (form.querySelector('#project')?.value || '').trim();
    const message = (form.querySelector('#message')?.value || '').trim();

    btn.disabled    = true;
    btn.textContent = 'Sending...';

    const embed = {
      title: '📬 New Portfolio Inquiry',
      color: 0xe0271a,
      fields: [
        { name: '👤 Name',         value: name    || '—', inline: true  },
        { name: '📧 Email',        value: email   || '—', inline: true  },
        { name: '🎬 Project Type', value: project || '—', inline: false },
        { name: '💬 Message',      value: message || '—', inline: false },
      ],
      footer: { text: 'Talha VFX Portfolio • Contact Form' },
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (res.ok || res.status === 204) {
        btn.textContent      = 'Sent ✓';
        btn.style.background = '#22c55e';
        btn.style.borderColor= '#22c55e';
        form.reset();
      } else {
        throw new Error('Discord webhook returned ' + res.status);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      btn.textContent      = 'Error — try again';
      btn.style.background = '#e0271a';
      btn.style.borderColor= '#e0271a';
    }

    setTimeout(() => {
      btn.textContent      = orig;
      btn.style.background = '';
      btn.style.borderColor= '';
      btn.disabled         = false;
    }, 3500);
  });
}

/* ── ACTIVE NAV ──────────────────────────────────────────────── */
function initActiveNavLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const page = href.split('/').pop().split('#')[0] || 'index.html';
    if (page === path) a.classList.add('active');
  });
}

/* ── WORK FILTER ─────────────────────────────────────────────── */
function initWorkFilter() {
  const btns = $$('.filter-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      $$('.all-work-grid .work-item').forEach(item => {
        item.style.display = (f === 'all' || (item.dataset.cat || '').includes(f)) ? '' : 'none';
      });
    });
  });
}
