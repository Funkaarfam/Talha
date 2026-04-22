/* ============================================================
   TALHA VFX PORTFOLIO — main.js
   ============================================================ */

'use strict';

/* ── Grain Canvas ─────────────────────────────────────────── */
(function initGrain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function drawGrain() {
    const imageData = ctx.createImageData(w, h);
    const buf = imageData.data;
    for (let i = 0; i < buf.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      buf[i] = buf[i + 1] = buf[i + 2] = v;
      buf[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawGrain);
  }

  resize();
  window.addEventListener('resize', resize);
  drawGrain();
})();


/* ── Custom Cursor ────────────────────────────────────────── */
(function initCursor() {
  const ring = document.getElementById('curRing');
  const dot  = document.getElementById('curDot');
  if (!ring || !dot) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(animRing);
  })();

  function addHover(el) {
    if (el._cursorDone) return;
    el._cursorDone = true;
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  }

  document.querySelectorAll('a, button, .wi, .tool, .btn-p, .btn-g').forEach(addHover);

  new MutationObserver(() => {
    document.querySelectorAll('a, button, .wi, .tool').forEach(addHover);
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; dot.style.opacity = '1'; });
})();


/* ── Navbar ───────────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Mobile menu ──────────────────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function close() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', close));
})();


/* ── Hero reel parallax ───────────────────────────────────── */
(function initReelParallax() {
  const track = document.getElementById('reelTrack');
  if (!track) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      track.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ── Hero frame counter ───────────────────────────────────── */
(function initFrameCounter() {
  const el = document.getElementById('frameCount');
  if (!el) return;
  let frame = 1;
  setInterval(() => {
    frame = frame >= 8 ? 1 : frame + 1;
    el.textContent = String(frame).padStart(3, '0');
  }, 2400);
})();


/* ── Scroll reveal ────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('vis'), idx * 90);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
})();


/* ── Skill bar animation ──────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      setTimeout(() => { fill.style.width = (fill.getAttribute('data-w') || '0') + '%'; }, 200);
      io.unobserve(fill);
    });
  }, { threshold: 0.5 });

  fills.forEach(el => io.observe(el));
})();


/* ── Work card: hover video preview ──────────────────────── */
(function initCardPreviews() {
  document.querySelectorAll('.wi').forEach(card => {
    const video = card.querySelector('.wi-bg-video');
    if (!video) return;

    // Save the src so lightbox can still use it, but don't preload
    const originalSrc = video.getAttribute('src') || '';
    video.removeAttribute('src');
    video.dataset.src = originalSrc;

    video.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      object-fit:cover; opacity:0;
      transition:opacity .5s ease;
      pointer-events:none; z-index:0;
    `;

    card.addEventListener('mouseenter', () => {
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      video.play().catch(() => {});
      video.style.opacity = '0.5';
    });

    card.addEventListener('mouseleave', () => {
      video.style.opacity = '0';
      video.pause();
    });
  });
})();


/* ── Video Lightbox ───────────────────────────────────────── */
// IMPORTANT: window.openVideo must be defined BEFORE any inline onclick fires
// so we declare it immediately, then build the DOM.

window.openVideo = function(src) {
  // Will be replaced by the real implementation below once DOM is built
  // This stub prevents "openVideo is not defined" errors on fast clicks
  console.warn('Lightbox not ready yet, retrying…');
  setTimeout(() => window.openVideo(src), 100);
};

(function initLightbox() {
  /* ── Build overlay ── */
  const overlay = document.createElement('div');
  overlay.id = 'videoOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Video player');
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9997;
    background:rgba(7,6,8,0.96);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    display:none; align-items:center; justify-content:center;
    padding:2rem;
    opacity:0; transition:opacity .3s ease;
  `;

  const inner = document.createElement('div');
  inner.style.cssText = `
    position:relative; width:100%; max-width:1140px;
    aspect-ratio:16/9;
    box-shadow:0 40px 120px rgba(0,0,0,0.7);
  `;

  const vid = document.createElement('video');
  vid.controls = true;
  vid.playsInline = true;
  vid.style.cssText = `
    width:100%; height:100%;
    border-radius:3px; background:#000; display:block;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
    width="32" height="32" style="display:block;pointer-events:none">
    <line x1="4" y1="4" x2="20" y2="20"/>
    <line x1="20" y1="4" x2="4" y2="20"/>
  </svg>`;
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.style.cssText = `
    position:absolute; top:-3.5rem; right:0;
    color:rgba(244,240,232,0.45);
    background:none; border:none; cursor:pointer;
    padding:8px; line-height:0;
    transition:color .2s;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.color = '#c9a96e';
  closeBtn.onmouseleave = () => closeBtn.style.color = 'rgba(244,240,232,0.45)';

  inner.appendChild(closeBtn);
  inner.appendChild(vid);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  /* ── Open / close ── */
  function openLightbox(src) {
    if (!src) return;
    // Stop any hover-preview videos first
    document.querySelectorAll('.wi-bg-video').forEach(v => { v.pause(); v.style.opacity = '0'; });

    vid.src = src;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Double rAF ensures display:flex is painted before opacity transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    });

    vid.play().catch(() => {});
  }

  function closeLightbox() {
    overlay.style.opacity = '0';
    vid.pause();
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.style.display = 'none';
      vid.src = '';
    }, 300);
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ── Replace the stub ── */
  window.openVideo = openLightbox;
})();


/* ── Work section header styling ─────────────────────────── */
(function styleWorkHeader() {
  const header = document.querySelector('.work-header');
  if (!header) return;
  header.style.cssText = `
    display:flex; align-items:baseline; gap:1.5rem;
    margin-bottom:3.5rem;
    padding-bottom:1.5rem;
    border-bottom:1px solid rgba(244,240,232,0.07);
  `;
  const num = header.querySelector('.work-header-num');
  if (num) num.style.cssText = `font-family:'Cormorant Garamond',serif; font-size:1rem; color:rgba(201,169,110,0.5);`;
  const h2 = header.querySelector('h2');
  if (h2) h2.style.cssText = `font-family:'Cormorant Garamond',serif; font-size:clamp(2.5rem,5vw,4rem); font-weight:700; letter-spacing:-.03em; flex:1;`;
  const count = header.querySelector('.work-header-count');
  if (count) count.style.cssText = `font-size:.7rem; letter-spacing:.18em; text-transform:uppercase; color:rgba(244,240,232,0.3);`;
})();


/* ── Fix wi-visual overlay, badges, play button z-index ──── */
(function fixVisuals() {
  document.querySelectorAll('.wi-visual').forEach(vis => {
    // Overlay gradient
    if (!vis.querySelector('.wi-overlay')) {
      const ov = document.createElement('div');
      ov.className = 'wi-overlay';
      ov.style.cssText = `
        position:absolute; inset:0; z-index:1;
        background:linear-gradient(to top, rgba(7,6,8,.85) 0%, rgba(7,6,8,.1) 55%, transparent 100%);
        pointer-events:none;
      `;
      vis.appendChild(ov);
    }

    const cat = vis.querySelector('.wi-category');
    if (cat) cat.style.cssText = `
      position:absolute; top:1rem; left:1rem; z-index:3;
      font-size:.62rem; letter-spacing:.15em; text-transform:uppercase;
      color:rgba(244,240,232,0.6); border:1px solid rgba(244,240,232,0.12);
      padding:4px 10px; border-radius:2px;
      background:rgba(7,6,8,0.55); backdrop-filter:blur(8px);
      font-family:'Outfit',sans-serif; pointer-events:none;
    `;

    const numBg = vis.querySelector('.wi-num-bg');
    if (numBg) numBg.style.cssText = `
      position:absolute; bottom:-1rem; right:1rem; z-index:1;
      font-family:'Cormorant Garamond',serif; font-size:9rem;
      font-weight:700; line-height:1;
      color:rgba(244,240,232,0.04); pointer-events:none; user-select:none;
    `;

    // Play button must be ABOVE overlay (z-index >= 2)
    const play = vis.querySelector('.wi-play');
    if (play) play.style.zIndex = '4';
  });
})();


/* ── Smooth anchor scrolling ──────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();


/* ── Magnetic buttons ─────────────────────────────────────── */
(function initMagneticBtns() {
  document.querySelectorAll('.btn-p, .btn-g').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();


/* ── Active nav highlight ─────────────────────────────────── */
(function initActiveNav() {
  const sections = ['work','about','skills'].map(id => document.getElementById(id)).filter(Boolean);
  const links = document.querySelectorAll('.nav-links a');

  function update() {
    const scrollY = window.scrollY + 120;
    let active = null;
    sections.forEach(sec => { if (sec.offsetTop <= scrollY) active = sec.id; });
    links.forEach(link => { link.style.color = link.getAttribute('href') === '#' + active ? 'var(--white)' : ''; });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── Contact form → Discord webhook ──────────────────────── */
(function initContactForm() {
  const form   = document.querySelector('form');
  const submit = form && form.querySelector('.form-submit');
  if (!form || !submit) return;

  const WEBHOOK = 'https://discord.com/api/webhooks/1483608314158911500/A3ltwdowlHvKgs_bfgyXwnQumGbJ0b7hWFX60TdAD1PUCA5Rw3PK-fT7SWHS0iN0CRuC';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Grab fields — adjust selectors if your input names differ
    const name    = (form.querySelector('[name="name"]')    || form.querySelectorAll('.form-input')[0])?.value.trim() || '—';
    const email   = (form.querySelector('[name="email"]')   || form.querySelectorAll('.form-input')[1])?.value.trim() || '—';
    const subject = (form.querySelector('[name="subject"]') || form.querySelectorAll('.form-input')[2])?.value.trim() || '—';
    const message = (form.querySelector('[name="message"]') || form.querySelector('.form-textarea'))?.value.trim()    || '—';

    submit.textContent = 'Sending…';
    submit.disabled = true;

    const payload = {
      username: 'Portfolio Contact',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      embeds: [{
        title: '📬 New Project Inquiry',
        color: 0xC9A96E,
        fields: [
          { name: '👤 Name',    value: name,    inline: true },
          { name: '📧 Email',   value: email,   inline: true },
          { name: '📌 Subject', value: subject, inline: false },
          { name: '💬 Message', value: message, inline: false },
        ],
        footer: { text: 'Talha VFX Portfolio' },
        timestamp: new Date().toISOString(),
      }]
    };

    try {
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        submit.textContent = 'Message Sent ✓';
        submit.style.background = '#4ade80';
        submit.style.color = '#070608';
        form.reset();
        setTimeout(() => {
          submit.textContent = 'Send Message';
          submit.style.background = '';
          submit.style.color = '';
          submit.disabled = false;
        }, 3500);
      } else {
        throw new Error('Webhook returned ' + res.status);
      }
    } catch (err) {
      console.error('Discord webhook error:', err);
      submit.textContent = 'Failed — Try Again';
      submit.style.background = '#e05050';
      submit.style.color = '#fff';
      submit.disabled = false;
      setTimeout(() => {
        submit.textContent = 'Send Message';
        submit.style.background = '';
        submit.style.color = '';
      }, 3000);
    }
  });
})();
