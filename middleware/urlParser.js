/**
 * <urlParser.js>
 * 
 * 요청 URL을 파싱하여 URL 객체로 만든 뒤, req.parsedUrl에 주입하는 미들웨어
 * 
 * - URL 파싱을 여러 미들웨어 또는 라우터 핸들러에서 중복하지 않도록,
 *   한 번만 파싱한 결과를 req.parsedUrl로 공유
 * 
 * - 이후 미들웨어나 라우터에서는 다음과 같이 사용 가능:
 *     - req.parsedUrl.pathname → '/users'
 *     - req.parsedUrl.searchParams → URLSearchParams 객체
 *     - req.parsedUrl.searchParams.get('id') → '123'
 */

module.exports = function urlParser(req, res, next) {
    // 요청 URL 전체를 URL 객체로 파싱하여 req.parsedUrl에 저장
    req.parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    next();
};