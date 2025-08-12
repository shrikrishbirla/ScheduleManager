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
