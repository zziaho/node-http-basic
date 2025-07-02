/**
 * routes > index.js
 * 모든 라우터를 정의
 */
const utils = require('@utils');

module.exports = function (app) {

    // ==============================
    // GET ROUTES
    // ==============================

    // Root 페이지
    app.route('GET', '/', (req, res) => {
        utils.response.sendJson(res, 200, 'Root Page');
    });

    // About 페이지
    app.route('GET', '/about', (req, res) => {
        utils.response.sendJson(res, 200, 'About Page');
    });

    // 동적 URL 파라미터 처리
    app.route('GET', '/users/:id', (req, res) => {
        const userId = req.params.id
        utils.response.sendJson(res, 200, 'User Found', { userId });
    });

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


    // ==============================
    // POST ROUTES
    // ==============================

    // Contact 폼 데이터 수신
    app.route('POST', '/contact', async (req, res) => {
        const body = await utils.body.parseRequestBody(req);
        utils.response.sendJson(res, 200, 'Contact Received', body);
    });


    // ==============================
    // ERROR TEST ROUTES
    // ==============================

    // 오류 강제 발생 라우트
    app.route('GET', '/error', (req, res) => {
        throw new Error('Forced error occurs!');
    });

    // 비동기 오류 강제 발생 라우트 
    app.route('GET', '/asyncError', async (req, res) => {
        throw new Error('Forced Async Error occurs!'); // == Promise.reject()
    });

    // 중복 응답 강제 발생 라우트
    app.route('GET', '/double-response', (req, res) => {
        utils.response.sendJson(res, 200, '1st Response', { step: 1 });
        utils.response.sendJson(res, 200, '2nd Response', { step: 2 });
    });

    // 중복 응답 async
    app.route('GET', '/double-async', async (req, res) => {
        utils.response.sendJson(res, 200, '1st Response');
        await new Promise(resolve => setTimeout(resolve, 100));
        utils.response.sendJson(res, 200, '2nd Response');
    });

};
