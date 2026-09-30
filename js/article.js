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

  // Text size controls
  const scales = [0.88, 0.94, 1, 1.12, 1.25];
  let scaleIndex = 2;
  const bodies = document.querySelectorAll('[data-article-body]');
  const knobs = document.querySelectorAll('[data-font-knob]');
  const applyScale = () => {
    bodies.forEach((el) => {
      el.style.fontSize = `${(Number(el.dataset.baseSize) * scales[scaleIndex]).toFixed(2)}px`;
    });
    knobs.forEach((knob) => {
      const track = knob.parentElement.clientWidth - knob.offsetWidth;
      knob.style.left = `${(track * scaleIndex) / (scales.length - 1)}px`;
      knob.style.marginLeft = '0';
    });
  };
  document.querySelectorAll('[data-font-step]').forEach((button) => {
    button.addEventListener('click', () => {
      scaleIndex = Math.min(scales.length - 1, Math.max(0, scaleIndex + Number(button.dataset.fontStep)));
      applyScale();
    });
  });

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
