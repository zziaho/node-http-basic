/**
 * <server.js>
 * http.createServer로 서버 생성
 * 요청이 들어올 때마다 handleRoute 호출
 * 서버 실행과 요청 전달만 담당하는 진입점 역할
 */

const http = require('http'); // Node.js 내장 http 모듈
const { handleRoute } = require('./routes');

const PORT = 3000;  // 포트

// 서버 객체 생성 - 요청이 들어올 때마다 콜백 함수 실행
const server = http.createServer((req, res) => {
    handleRoute(req, res);
});

// 서버가 해당 포트에서 요청을 기다리게 함.
server.listen(PORT, () => {
    console.log(`서버 실행 : http://localhost:${PORT}`);
});