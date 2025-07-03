/**
 * routes > userRouter.js
 * 사용자 관련 라우트 처리 (/users/:id)
 */
const utils = require('@utils');

module.exports = function(app) {

    // ==============================
    // GET ROUTES
    // ==============================

    // 동적 URL 파라미터 처리
    app.route('GET', '/users/:id', (req, res) => {
        const userId = req.params.id
        utils.response.sendJson(res, 200, 'User Found', { userId });
    });

}

