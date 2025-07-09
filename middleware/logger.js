/**
 * logger.js
 *
 * 요청이 들어올 때마다 콘솔에 로그를 출력하는 미들웨어
 * 로그 형식: [YYYY-MM-DD HH:mm:ss] METHOD URL
 * ex: [2025-07-08 15:32:01] GET /users?id=123
 */

module.exports = function logger(req, res, next)  {
    const now = new Date();
    const timestamp = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};