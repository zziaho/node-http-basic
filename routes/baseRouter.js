/**
 * routes > baseRouter.js
 * 기본 페이지 및 공통 라우트 처리 (/, /about, /contact 등)
 */
const utils = require('@utils');

module.exports = function(app) {

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



    // ==============================
    // POST ROUTES
    // ==============================

    // Contact 폼 데이터 수신
    app.route('POST', '/contact', async (req, res) => {
        try {
            const body = await utils.body.parseRequestBody(req);
            utils.response.sendJson(res, 200, 'Contact Received', body);
        } catch(err) {
            utils.response.sendJson(res, 400, err.message, {}, false);
        }
    });

}

