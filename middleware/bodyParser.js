/**
 * <bodyParser.js>
 * 
 * application/json 형식의 요청 바디를 파싱하여 req.body에 주입하는 미들웨어
 *
 * - Content-Type이 application/json인 경우에만 동작
 * - bodyUtil.parseRequestBody()를 이용해 stream으로부터 바디를 읽고 JSON으로 파싱
 * - 파싱 성공 시: req.body에 객체 형태로 주입
 * - 파싱 실패 시: 400 Bad Request 응답 반환
 *
 * ex:
 * POST /api/user
 * Content-Type: application/json
 * Body: { "name": "node", "count": 30 }
 *
 * → req.body = { name: "node", count: 30 }
 */
const bodyUtil = require('@utils/bodyUtil');

module.exports = function bodyParser(req, res, next) {
    const contentType = req.headers['content-type'] || '';

    // JSON이 아닌 요청은 건너뜀 (req.body는 빈 객체로 초기화)
    if (!contentType || !contentType.includes('application/json')) {
        req.body = {};
        return next();
    }

    // JSON 형식의 요청 바디를 파싱하여 req.body에 주입
    bodyUtil.parseRequestBody(req)
        .then(parsed => {
            req.body = parsed;
            next();
        })
        .catch(err => {
            // JSON 파싱 실패 시 400 Bad Request 응답
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                statusCode: 400,
                success: false,
                message: err.message,
                data: null
            }));
        });
};