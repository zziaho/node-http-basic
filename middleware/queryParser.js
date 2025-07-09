/**
 * <queryParser.js>
 *
 * 요청 URL의 쿼리스트링을 파싱하여 req.query 객체에 주입하는 미들웨어
 * ex: /search?keyword=node → req.query = { keyword: 'node' }
 */

module.exports = function queryParser(req, res, next) {
    // URL 객체의 searchParams를 반복 가능한 entries로 변환한 후 객체로 만듦
    // ex: ?foo=bar&x=1 → { foo: 'bar', x: '1' }
    req.query = Object.fromEntries(req.parsedUrl.searchParams.entries());

    next();
};