const http = require('http'); // Node.js 내장 http 모듈

const PORT = 3000;  // 포트

// 서버 객체 생성 - 요청이 들어올 때마다 콜백 함수 실행
const server = http.createServer(async (req, res) => {
    /**
     * 응답 헤더 설정
     * 방법 1. writeHead => 호출과 동시에 헤더 전송
     * res.writeHead(200, { 'Content-Type': 'text/plain'});

     * 방법 2. setHeader => 개별 헤더를 설정. end() 호출 전까진 실제로 전송되지 않음.
     * res.statusCode = 200;
     * res.setHeader('Content-Type', 'text/plain');
     **/

    // 클라이언트에게 실제 데이터를 보내고, 응답을 끝냄
    // res.end("Hello, Node.js World");

    const { method, url } = req;

    /**
     * 라우팅: 요청 경로(URL)에 따라 어떤 동작을 할지 결정하는 것
     */
    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Root page');
    }

    else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('About page.');
    }

    else if (method === 'POST' && url === '/contact') {
        const body = await parseRequestBody(req); // 바디 파싱 함수 호출
        console.log('POST Request:', body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Contact received', data: body }));
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// 서버가 해당 포트에서 요청을 기다리게 함.
server.listen(PORT, () => {
    console.log(`서버 실행 : http://localhost:${PORT}`);
});

// POST 요청의 JSON 바디를 수신하고 파싱하는 함수
function parseRequestBody(req) {
    return new Promise((resolve) => {
        let body = '';

        // 요청 데이터 수신 시마다 chunk 단위로 모음
        req.on('data', (chunk) => {
            body += chunk;
        });

        // 수신이 끝나면 JSON 파싱 시도
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                resolve(parsed); // 성공 시 객체로 반환
            } catch {
                resolve({}); // 파싱 실패 시 빈 객체 반환
            }
        });
    });
}