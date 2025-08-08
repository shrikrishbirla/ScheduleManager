module.exports = (req, res, next) => {
    const currentDateTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    res.locals.currentDateTime = currentDateTime;
    next();
}