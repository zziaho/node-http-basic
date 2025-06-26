function logger(req, res, next)  {
    const now = new Date();
    const timestamp = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}

module.exports = logger; 