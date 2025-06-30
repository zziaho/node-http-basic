/**
 * <routes.js>
 * URL과 method 기반의 라우팅 처리 담당
 * 라우팅: 요청 경로(URL)에 따라 어떤 동작을 할지 결정하는 것
 */

const { util } = require('./utils/util');

async function handleRoute(req, res) {
    /**
     * 응답 헤더 설정 방법
     * 방법 1. writeHead => 호출과 동시에 헤더 전송
     * res.writeHead(200, { 'Content-Type': 'text/plain'});

     * 방법 2. setHeader => 개별 헤더를 설정. end() 호출 전까진 실제로 전송되지 않음.
     * res.statusCode = 200;
     * res.setHeader('Content-Type', 'text/plain');
     **/

    // res.end("Hello, Node.js World"); // 클라이언트에게 실제 데이터를 보내고, 응답을 끝냄

    const { method, url } = req;

    // === 기본 페이지 라우팅 ===
    if (method === 'GET' && url === '/') {
        util.sendJson(res, 200, 'Root page');
    }

    else if (method === 'GET' && url === '/about') {
        util.sendJson(res, 200, 'About page');
    }

    // === 동적 URL 파라미터 (/users/:id) ===
    else if (method === 'GET' && url.startsWith('/users')) {
        const parsed = url.split('/'); // "/users/ABC" -> ["", "users", "ABC"]
        const userId = parsed[2]; 

        if (!userId) {
            util.sendJson(res, 400, 'User ID is Missing');
            return;
        }

        util.sendJson(res, 200, 'User ID Recevied', {userId});
    }

    // === 쿼리 스트링 파싱 (/search?keyword=...) ===
    else if (method === 'GET' && url.startsWith('/search')) {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const keyword = parsedUrl.searchParams.get('keyword');

        util.sendJson(res, 200, 'Search Result', {keyword});
    }

    // === POST 요청 바디 처리 (/contact) ===
    else if (method === 'POST' && url === '/contact') {
        const body = await util.parseRequestBody(req);
        util.sendJson(res, 200, 'Contact received', body);
    }

    // === 404 처리 ===
    else {
        util.sendJson(res, 404, 'Not Found', {}, false);
    }
}

module.exports = { handleRoute };