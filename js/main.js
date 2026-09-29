// Gangolli News – page behaviour
document.addEventListener('DOMContentLoaded', () => {
  // Live timestamp in the top utility bar (IST)
  const timestamp = document.getElementById('site-timestamp');
  if (timestamp) {
    const updateTimestamp = () => {
      const now = new Date();
      const tz = { timeZone: 'Asia/Kolkata' };
      const date = now.toLocaleDateString('en-GB', { ...tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const time = now.toLocaleTimeString('en-US', { ...tz, hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '').toLowerCase();
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
