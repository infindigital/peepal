// Gangolli News – page behaviour
document.addEventListener('DOMContentLoaded', () => {
  // Live timestamp in the top utility bar (IST)
  const timestamp = document.getElementById('site-timestamp');
  if (timestamp) {
    const updateTimestamp = () => {
      const now = new Date();
      const tz = { timeZone: 'Asia/Kolkata' };
      const date = now.toLocaleDateString('kn-IN', { ...tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const time = now.toLocaleTimeString('kn-IN', { ...tz, hour: '2-digit', minute: '2-digit', hour12: true });
      timestamp.textContent = `${date} | ${time} IST`;
    };
    updateTimestamp();
    setInterval(updateTimestamp, 60 * 1000);
  }

  // Back-to-top button in the footer
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
