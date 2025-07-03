/**
 * routes > searchRouter.js
 * 검색 관련 라우트 처리 (/search)
 */
const utils = require('@utils');

module.exports = function (app) {

    // GET /search 쿼리 스트링 처리
    app.route('GET', '/search', (req, res) => {
        const { keyword } = req.query;

        // keyword 유효성 검사
        if (!keyword || keyword.trim() === '') {
            return utils.response.sendJson(res, 400, '검색어(keyword)가 누락되었거나 비어 있습니다.', {}, false);
        }

        // 정상 응답
        utils.response.sendJson(res, 200, 'Search Result', { keyword });
    });

}