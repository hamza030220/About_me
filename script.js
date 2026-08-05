// ============================================
// BOOT TERMINAL TYPING EFFECT
// ============================================
const bootLines = [
  { type: 'prompt', text: 'whoami' },
  { type: 'out',    text: 'Hamza Slimani — ZEUS' },
  { type: 'prompt', text: 'role' },
  { type: 'out',    text: 'IoT & Embedded Systems Engineering Student, ESPRIT' },
  { type: 'prompt', text: 'mission' },
  { type: 'out',    text: 'Turn ideas into working systems' },
  { type: 'comment',text: '// status: ONLINE' },
];

function typeTerminal(target, lines, opts = {}) {
  const { charDelay = 22, lineDelay = 320, startDelay = 400 } = opts;
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      target.appendChild(cursor);
      return;
    }
    const { type, text } = lines[lineIndex];
    const row = document.createElement('div');

    if (type === 'prompt') {
      const promptSpan = document.createElement('span');
      promptSpan.className = 'l-prompt';
      promptSpan.textContent = '$ ';
      row.appendChild(promptSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.className = type === 'out' ? 'l-out' : type === 'comment' ? 'l-comment' : '';
    row.appendChild(textSpan);
    target.appendChild(row);

    let charIndex = 0;
    const delay = type === 'comment' ? charDelay * 0.6 : charDelay;

    function typeChar() {
      if (charIndex < text.length) {
        textSpan.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeChar, delay + Math.random() * 14);
      } else {
        lineIndex++;
        setTimeout(typeLine, lineDelay);
      }
    }
    typeChar();
  }

  setTimeout(typeLine, startDelay);
}

// ============================================
// GLITCH BURST helper — brief chromatic flicker,
// not a continuous effect
// ============================================
function glitchBurst(el) {
  if (!el || el.classList.contains('glitch-active')) return;
  el.classList.add('glitch-active');
  setTimeout(() => el.classList.remove('glitch-active'), 550);
}

// ============================================
// IDLE FLICKER — loose-bulb ambient effect.
// Desyncs each element with a random duration/
// delay so multiple flickering elements never
// blink in unison.
// ============================================
const flickerTargets = [];
function makeFlicker(el) {
  if (!el || el.classList.contains('idle-flicker')) return;
  const dur = (Math.random() * 4 + 6).toFixed(2);   // 6s–10s
  const delay = (-Math.random() * 10).toFixed(2);    // random negative start offset
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = delay + 's';
  el.classList.add('idle-flicker');
  flickerTargets.push(el);
}
function pauseFlicker() {
  flickerTargets.forEach(el => {
    el.style.animationPlayState = 'paused';
    el.style.opacity = '1';
  });
}
function resumeFlicker() {
  flickerTargets.forEach(el => {
    el.style.opacity = '';
    el.style.animationPlayState = 'running';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // touch/small-screen devices skip the heaviest effects entirely
  // (mousemove-driven tilt/parallax/cursor never fire there anyway)
  const isTouch = matchMedia('(hover: none)').matches || matchMedia('(pointer: coarse)').matches || window.innerWidth <= 780;

  const termBody = document.getElementById('term-body');
  if (termBody) {
    typeTerminal(termBody, bootLines);
  }

  // ============================================
  // AMBIENT PARTICLES — drifting sparks in the bg
  // skipped on mobile: hidden via CSS anyway, and
  // costly to generate/animate on low-power devices
  // ============================================
  const particleField = document.getElementById('bg-particles');
  if (particleField && !isTouch) {
    const COUNT = 22;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle' + (Math.random() < 0.3 ? ' particle--amber' : '');
      const size = (Math.random() * 2.5 + 1.5).toFixed(1);
      const dur = (Math.random() * 14 + 12).toFixed(1);
      const delay = (Math.random() * -26).toFixed(1);
      const drift = (Math.random() * 80 - 40).toFixed(0);
      p.style.left = (Math.random() * 100).toFixed(1) + '%';
      p.style.setProperty('--size', size + 'px');
      p.style.setProperty('--dur', dur + 's');
      p.style.setProperty('--delay', delay + 's');
      p.style.setProperty('--drift', drift + 'px');
      particleField.appendChild(p);
    }
  }

  // ============================================
  // GLITCH-ENABLE SECTION TITLES
  // (adds data-text + glitch class programmatically
  // so the markup elsewhere stays clean)
  // ============================================
  document.querySelectorAll('.section-title').forEach(el => {
    el.setAttribute('data-text', el.textContent.trim());
    el.classList.add('glitch');
  });

  // periodic glitch on the ZEUS badge — small, contained, looping
  const zeusBadge = document.getElementById('zeus-glitch');
  if (zeusBadge) {
    setInterval(() => glitchBurst(zeusBadge), 4200);
  }

  // idle flicker: nav prompt, always on
  const navBrand = document.querySelector('.nav-brand');
  if (navBrand) makeFlicker(navBrand);

  // idle flicker: hero name kicks in once its load-in flicker finishes
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.addEventListener('animationend', function onLoadFlicker(e) {
      if (e.animationName === 'flicker-in') {
        makeFlicker(heroName);
        heroName.removeEventListener('animationend', onLoadFlicker);
      }
    });
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // glitch-in section titles the moment they arrive
        if (entry.target.classList.contains('section-title')) {
          glitchBurst(entry.target);
          // once the burst settles, let it join the idle flicker pool
          setTimeout(() => makeFlicker(entry.target), 600);
        }
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => io.observe(el));

  // mode labels glitch as the switch flips into view
  const modeSwitchEl = document.getElementById('mode-switch');
  const modeLabels = document.querySelectorAll('.mode-label');
  if (modeSwitchEl) {
    const modeIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          modeLabels.forEach((label, i) => {
            label.setAttribute('data-text', label.textContent.trim());
            label.classList.add('glitch');
            setTimeout(() => glitchBurst(label), 300 + i * 150);
          });
          modeIO.disconnect();
        }
      });
    }, { threshold: 0.5 });
    modeIO.observe(modeSwitchEl);
  }

  // ============================================
  // NAV SCROLL STATE
  // ============================================
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // touch it and it steadies: scrolling pauses the idle flicker,
  // it starts up again once scrolling stops for a moment
  let flickerSettleTimer;
  window.addEventListener('scroll', () => {
    pauseFlicker();
    clearTimeout(flickerSettleTimer);
    flickerSettleTimer = setTimeout(resumeFlicker, 700);
  }, { passive: true });

  // ============================================
  // SESSION UPTIME COUNTER (fun detail)
  // ============================================
  const uptimeEl = document.getElementById('uptime');
  const start = Date.now();
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const h = pad(Math.floor(elapsed / 3600));
    const m = pad(Math.floor((elapsed % 3600) / 60));
    const s = pad(elapsed % 60);
    if (uptimeEl) uptimeEl.textContent = `UPTIME ${h}:${m}:${s}`;
  }
  setInterval(tick, 1000);
  tick();

  // ============================================
  // PAUSE AMBIENT CSS ANIMATIONS WHEN TAB HIDDEN
  // saves battery/CPU on mobile when backgrounded
  // ============================================
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('tab-hidden', document.hidden);
  });

  // ============================================
  // FOOTER YEAR
  // ============================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================
  // SCROLL PROGRESS RAIL
  // ============================================
  const rail = document.getElementById('scroll-rail-fill');
  if (rail) {
    const updateRail = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      rail.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateRail, { passive: true });
    updateRail();
  }

  // ============================================
  // CUSTOM CURSOR
  // Smooth-follow using rAF interpolation. Grows
  // and shows a HUD label on interactive elements.
  // ============================================
  const cursor = document.getElementById('cursor');
  const hudText = document.getElementById('cursor-hud-text');
  if (cursor && !isTouch) {
    document.body.classList.add('has-custom-cursor');
    let tx = -100, ty = -100, cx = -100, cy = -100;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-down'));

    const hoverables = document.querySelectorAll('a, button, [data-magnetic], .pcb-card, .hobby-card, .toggle-track');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        const label = el.dataset.cursor
          || (el.tagName === 'A' ? 'OPEN' : el.tagName === 'BUTTON' ? 'CLICK' : el.classList.contains('pcb-card') ? 'INSPECT' : 'HOVER');
        if (hudText) hudText.textContent = label;
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
    window.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    window.addEventListener('mouseenter', () => cursor.style.opacity = '');
  }

  // ============================================
  // SECTION TITLES — split into chars for stagger
  // Runs AFTER the earlier glitch attribute pass.
  // ============================================
  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent;
    title.textContent = '';
    let i = 0;
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', i++);
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      title.appendChild(span);
    }
  });

  // ============================================
  // TEXT SCRAMBLE — cycles random glyphs into place
  // ============================================
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEF';
  function scramble(el, finalText, duration = 900) {
    const chars = finalText.split('');
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(chars.length * t);
      let out = '';
      for (let i = 0; i < chars.length; i++) {
        if (i < revealed || chars[i] === ' ') out += chars[i];
        else out += scrambleChars[(Math.random() * scrambleChars.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  // apply scramble to eyebrows once they enter view (one-shot)
  const eyebrows = document.querySelectorAll('.eyebrow');
  const scrambleIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const finalText = el.dataset.scrambleText || el.textContent;
        el.dataset.scrambleText = finalText;
        scramble(el, finalText, 700);
        scrambleIO.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  eyebrows.forEach(el => scrambleIO.observe(el));

  // ============================================
  // PROJECT CARDS — 3D tilt + scan beam element
  // tilt listeners skipped on touch: mousemove never
  // fires there, so attaching them is dead weight
  // ============================================
  document.querySelectorAll('.pcb-card').forEach(card => {
    const scan = document.createElement('div');
    scan.className = 'pcb-scan';
    card.appendChild(scan);
    if (isTouch) return;
    card.classList.add('tilt-ready');

    let rafId = 0;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -8;
      const ry = (px - 0.5) *  10;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(rafId);
      card.style.transform = '';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  });

  // ============================================
  // MAGNETIC BUTTONS — pull toward cursor
  // ============================================
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      const strength = 14;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        const dx = ((mx / r.width) - 0.5) * strength;
        const dy = ((my / r.height) - 0.5) * strength;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
        btn.style.setProperty('--mx', (mx / r.width * 100) + '%');
        btn.style.setProperty('--my', (my / r.height * 100) + '%');
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ============================================
  // HERO — parallax on mouse move
  // ============================================
  const heroCircuit = document.querySelector('.hero-circuit');
  const heroTitleBlock = document.querySelector('.hero-title-block');
  const heroSection = document.querySelector('.hero');
  if (heroSection && !isTouch) {
    heroSection.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width  - 0.5);
      const py = ((e.clientY - r.top)  / r.height - 0.5);
      if (heroCircuit)    heroCircuit.style.transform    = `translate(${px * -22}px, ${py * -18}px)`;
      if (heroTitleBlock) heroTitleBlock.style.transform = `translate(${px *  8}px, ${py *  6}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      if (heroCircuit)    heroCircuit.style.transform = '';
      if (heroTitleBlock) heroTitleBlock.style.transform = '';
    });
  }

  // ============================================
  // MODE SWITCH — manual toggle only
  // ============================================
  const modeToggle = document.getElementById('toggle-track');
  if (modeToggle) {
    const setMode = (on) => {
      document.body.classList.toggle('mode-create', on);
      modeToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      const zeus = document.getElementById('zeus-glitch');
      if (zeus) glitchBurst(zeus);
    };
    modeToggle.addEventListener('click', () => {
      setMode(!document.body.classList.contains('mode-create'));
    });
  }
});