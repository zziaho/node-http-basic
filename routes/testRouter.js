/**
 * routes > testRouter.js
 * 오류 상황 테스트를 위한 라우트 정의 (/error, /asyncError 등)
 */
const utils = require('@utils');

module.exports = function (app) {

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

}

