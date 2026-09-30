// Gangolli News – page behaviour
document.addEventListener('DOMContentLoaded', () => {
  // Live timestamp in the top utility bar (IST)
  const timestamp = document.getElementById('site-timestamp');
  if (timestamp) {
    const phone = window.matchMedia('(max-width: 767px)');
    const updateTimestamp = () => {
      const now = new Date();
      const tz = { timeZone: 'Asia/Kolkata' };
      // Phones get a shorter date so the top bar fits on one line
      const dateOptions = phone.matches
        ? { ...tz, weekday: 'short', day: 'numeric', month: 'short' }
        : { ...tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const date = now.toLocaleDateString('kn-IN', dateOptions);
      const time = now.toLocaleTimeString('kn-IN', { ...tz, hour: '2-digit', minute: '2-digit', hour12: true });
      timestamp.textContent = `${date} | ${time} IST`;
    };
    updateTimestamp();
    setInterval(updateTimestamp, 60 * 1000);
    phone.addEventListener('change', updateTimestamp);
  }

  // Phone menu in the masthead
  const menuToggle = document.querySelector('[data-site-menu-toggle]');
  const menu = document.getElementById('site-menu');
  if (menuToggle && menu) {
    const openIcon = menuToggle.querySelector('[data-site-menu-open]');
    const closeIcon = menuToggle.querySelector('[data-site-menu-close]');
    menuToggle.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'ಮೆನು ಮುಚ್ಚಿ' : 'ಮೆನು ತೆರೆಯಿರಿ');
      openIcon.classList.toggle('hidden', open);
      closeIcon.classList.toggle('hidden', !open);
    });
  }

  // Back-to-top button in the footer
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
