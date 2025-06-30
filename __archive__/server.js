/**
 * <server.js>
 * http.createServer로 서버 생성
 * 요청이 들어올 때마다 handleRoute 호출
 * 서버 실행과 요청 전달만 담당하는 진입점 역할
 */

const http = require('http'); // Node.js 내장 http 모듈
const { handleRoute } = require('./routes');
const middlewares = require('./middleware');

const PORT = 3000;  // 포트

// 서버 객체 생성 - 요청이 들어올 때마다 미들웨어 + 라우터 실행
const server = http.createServer((req, res) => {
    reunMiddlewares(req, res, middlewares, () => {
        handleRoute(req, res);
    });
});

// 서버가 해당 포트에서 요청을 기다리게 함.
server.listen(PORT, () => {
    console.log(`서버 실행 : http://localhost:${PORT}`);
});

/**
 * runMiddlewares
 * - 미들웨어 체인을 순차적으로 실행
 * - 각 미들웨어는 (req, res, next) 형식으로 호출됨
 * - 모든 미들웨어 실행 후 done() 콜백 호출
 */
function reunMiddlewares(req, res, middlewares, done) {
    let i = 0;
    function next() {
        if (i < middlewares.length) {
            middlewares[i++](req, res, next)
        } else {
            done(); // 모든 미들웨어 실행 후 라우터 처리
        }
    }
    next();
}