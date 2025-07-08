/**
 * [debugRouter.js]
 * 
 * HTTP 요청(req) 및 응답(res) 객체의 구조를 디버깅 용도로 확인할 수 있는 라우트입니다.
 * /debug/req-res 경로로 접근하면 요청/응답의 주요 정보들을 JSON 형태로 반환합니다.
 */
const utils = require('@utils');

module.exports = function (app) {

    // [GET] /debug/req-res
    // 요청 및 응답 객체의 주요 속성을 JSON 형식으로 반환
    app.route('GET', '/debug/req-res', (req, res) => {
        const reqInfo = {
            method: req.method,                             // HTTP 메서드
            url: req.url,                                   // 요청 경로
            headers: req.headers,                           // 요청 해더 객체(Key-Value)
            httpVersion: req.httpVersion,                   // HTTP 버전
            socket: {                                       // socket 정보
                remoteAddress: req.socket.remoteAddress,    // 클라이언트 IP 주소
                remotePort: req.socket.remotePort,          // 클라이언트 포트
                localAddress: req.socket.localAddress,      // 서버 IP 주소
                localPort: req.socket.localPort             // 서버 포트
            }
        };

        const resInfo = {
            statusCode: res.statusCode,         // 응답 상태 코드
            headersSent: res.headersSent,       // 응답 헤더 전송 여부
            writableEnded: res.writableEnded    // 응답 스트림 종료 여부
        };

        utils.response.sendJson(res, 200, 'req/res 구조 정보', {
            request: reqInfo,
            response: resInfo
        });

    });

};