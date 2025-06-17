const http = require('http');

const PORT = 3000;  // 포트

const server = http.createServer((req, res) => {
    // 응답 헤더 설정
    // 방법 1. writeHead => 호출과 동시에 헤더 전송
    res.writeHead(200, { 'Content-Type': 'text/plain'});

    // 방법 2. setHeader => 개별 헤더를 설정. end() 호출 전까진 실제로 전송되지 않음.
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');

    // 클라이언트에게 실제 데이터를 보내고, 응답을 끝냄
    res.end("Hello, Node.js World");
});

// 서버가 해당 포트에서 요청을 기다리게 함.
server.listen(PORT, () => {
    console.log(`서버 실행 : http://localhost:${PORT}`);
});