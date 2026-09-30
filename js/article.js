// Gangolli News – article page behaviour
document.addEventListener('DOMContentLoaded', () => {
  const pageUrl = window.location.href;
  const pageTitle = document.title;

  // Live timestamp in the header (IST, Kannada)
  const timestamps = document.querySelectorAll('[data-live-time]');
  if (timestamps.length) {
    const updateTimestamp = () => {
      const now = new Date();
      const tz = { timeZone: 'Asia/Kolkata' };
      const date = now.toLocaleDateString('kn-IN', { ...tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const time = now.toLocaleTimeString('kn-IN', { ...tz, hour: '2-digit', minute: '2-digit', hour12: true });
      timestamps.forEach((el) => { el.textContent = `${date} | ${time} IST`; });
    };
    updateTimestamp();
    setInterval(updateTimestamp, 60 * 1000);
  }

  // Share buttons
  const flash = (button, label) => {
    const original = button.getAttribute('title');
    button.setAttribute('title', label);
    button.classList.add('ring-2', 'ring-green-500');
    setTimeout(() => {
      if (original === null) button.removeAttribute('title');
      else button.setAttribute('title', original);
      button.classList.remove('ring-2', 'ring-green-500');
    }, 1500);
  };
  const copyLink = async (button) => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      flash(button, 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ');
    } catch (err) {
      window.prompt('ಈ ಲಿಂಕ್ ನಕಲಿಸಿ:', pageUrl);
    }
  };
  document.querySelectorAll('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = encodeURIComponent(`${pageTitle} ${pageUrl}`);
      switch (button.dataset.share) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
          break;
        case 'x':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank', 'noopener');
          break;
        case 'copy':
          copyLink(button);
          break;
        default:
          if (navigator.share) {
            try { await navigator.share({ title: pageTitle, url: pageUrl }); } catch (err) { /* dismissed */ }
          } else {
            copyLink(button);
          }
      }
    });
  });

  // Jump to comments (scrolls to whichever comments section is visible)
  document.querySelectorAll('[data-jump-comments]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = [...document.querySelectorAll('[data-comments]')].find((el) => el.offsetParent !== null);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Bookmark / Save (remembered per browser)
  const bookmarkKey = `gn-bookmark:${window.location.pathname}`;
  const bookmarks = document.querySelectorAll('[data-bookmark]');
  const setBookmarked = (on) => bookmarks.forEach((b) => b.setAttribute('aria-pressed', String(on)));
  try { setBookmarked(localStorage.getItem(bookmarkKey) === '1'); } catch (err) { /* storage unavailable */ }
  bookmarks.forEach((button) => {
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true';
      setBookmarked(on);
      try { on ? localStorage.setItem(bookmarkKey, '1') : localStorage.removeItem(bookmarkKey); } catch (err) { /* storage unavailable */ }
    });
  });

  // Rate this article (thumbs up / down, one choice at a time)
  document.querySelectorAll('[data-rate]').forEach((button) => {
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true';
      document.querySelectorAll('[data-rate]').forEach((b) => {
        b.setAttribute('aria-pressed', String(on && b.dataset.rate === button.dataset.rate));
      });
    });
  });

  // Text size controls: drag or click the slider, use the -T/+T buttons,
  // or focus the slider and use the arrow keys. Every slider stays in sync.
  const MIN_SCALE = 0.85;
  const MAX_SCALE = 1.5;
  const STEP = 0.05;
  const scaleKey = 'gn-article-text-scale';
  const bodies = document.querySelectorAll('[data-article-body]');
  const tracks = document.querySelectorAll('[data-font-track]');
  const clampScale = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  let scale = 1;
  try {
    const saved = Number(localStorage.getItem(scaleKey));
    if (saved) scale = clampScale(saved);
  } catch (err) { /* storage unavailable */ }

  const applyScale = (save = true) => {
    const ratio = (scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE);
    bodies.forEach((el) => {
      el.style.fontSize = `${(Number(el.dataset.baseSize) * scale).toFixed(2)}px`;
    });
    tracks.forEach((track) => {
      const knob = track.querySelector('[data-font-knob]');
      const fill = track.querySelector('[data-font-fill]');
      const x = ratio * track.clientWidth;
      knob.style.left = `${x - knob.offsetWidth / 2}px`;
      if (fill) fill.style.width = `${x}px`;
      track.setAttribute('aria-valuemin', String(Math.round(MIN_SCALE * 100)));
      track.setAttribute('aria-valuemax', String(Math.round(MAX_SCALE * 100)));
      track.setAttribute('aria-valuenow', String(Math.round(scale * 100)));
      track.setAttribute('aria-valuetext', `${Math.round(scale * 100)}%`);
    });
    if (save) {
      try { localStorage.setItem(scaleKey, String(scale)); } catch (err) { /* storage unavailable */ }
    }
  };

  const scaleFromPointer = (track, clientX) => {
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    scale = clampScale(MIN_SCALE + ratio * (MAX_SCALE - MIN_SCALE));
    applyScale();
  };

  tracks.forEach((track) => {
    track.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      track.setPointerCapture(event.pointerId);
      track.focus();
      scaleFromPointer(track, event.clientX);
    });
    track.addEventListener('pointermove', (event) => {
      if (track.hasPointerCapture(event.pointerId)) scaleFromPointer(track, event.clientX);
    });
    track.addEventListener('keydown', (event) => {
      const keys = { ArrowRight: STEP, ArrowUp: STEP, ArrowLeft: -STEP, ArrowDown: -STEP };
      if (event.key in keys) {
        scale = clampScale(scale + keys[event.key]);
      } else if (event.key === 'Home') {
        scale = MIN_SCALE;
      } else if (event.key === 'End') {
        scale = MAX_SCALE;
      } else {
        return;
      }
      event.preventDefault();
      applyScale();
    });
  });
  document.querySelectorAll('[data-font-step]').forEach((button) => {
    button.addEventListener('click', () => {
      scale = clampScale(scale + Number(button.dataset.fontStep) * STEP * 2);
      applyScale();
    });
  });
  // Place the knobs once layout is known, and again if the layout switches
  applyScale(false);
  window.addEventListener('resize', () => applyScale(false));

  // Comment forms (moderated - no public posting yet)
  document.querySelectorAll('[data-comment-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.parentElement.querySelector('[data-comment-status]');
      if (status) status.textContent = 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಸಲ್ಲಿಕೆಯಾಗಿದೆ, ಪರಿಶೀಲನೆಯ ಬಳಿಕ ಪ್ರಕಟವಾಗುತ್ತದೆ.';
      form.reset();
    });
  });

  // Mobile menu
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'ಮೆನು ಮುಚ್ಚಿ' : 'ಮೆನು ತೆರೆಯಿರಿ');
    });
  }

  // Most viewed tabs (mobile)
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.setAttribute('aria-selected', String(active));
        t.classList.toggle('text-gray-900', active);
        t.classList.toggle('border-[#C51A1A]', active);
        t.classList.toggle('text-gray-500', !active);
        t.classList.toggle('border-transparent', !active);
        document.getElementById(t.dataset.tab).classList.toggle('hidden', !active);
      });
    });
  });

  // Footer accordion (mobile)
  document.querySelectorAll('[data-accordion]').forEach((item) => {
    const toggle = item.querySelector('[data-accordion-toggle]');
    const panel = item.querySelector('[data-accordion-panel]');
    const icon = item.querySelector('[data-accordion-icon]');
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
      icon.textContent = open ? '-' : '+';
    });
  });

  // Back-to-top buttons
  document.querySelectorAll('[data-back-to-top]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
