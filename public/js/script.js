document.addEventListener('DOMContentLoaded', () => {
  const profile = document.getElementById('user-profile');
  const panel = document.querySelector('.over-panel');
  const overlay = document.querySelector('.overlay');

  profile.addEventListener('mouseenter', () => {
    panel.classList.add('visible');
    overlay?.classList.add('visible');
  });

  profile.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!panel.matches(':hover')) {
        panel.classList.remove('visible');
        overlay?.classList.remove('visible');
      }
    }, 100);
  });

  panel.addEventListener('mouseleave', () => {
    panel.classList.remove('visible');
    overlay?.classList.remove('visible');
  });

  // Optional: close popup when clicking overlay
  overlay?.addEventListener('click', () => {
    panel.classList.remove('visible');
    overlay.classList.remove('visible');
  });
});

function updateClock() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const formatted = now.toLocaleString('en-IN', options);
    document.getElementById('live-clock').textContent = formatted;
}
updateClock();
setInterval(updateClock, 1000);
