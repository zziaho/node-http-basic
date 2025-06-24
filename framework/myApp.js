const http = require('http');
const { util } = require('../util');

/**
 * MyApp 클래스는 기본 HTTP 서버를 기반으로 
 * 미들웨어 및 라우팅 시스템을 구현한 간단한 프레임워크 역할을 한다.
 */
class MyApp {

    constructor() {
        this.middlewares = [];  // 미들웨어 목록
        this.routes = [];       // 라우팅 정보 목록
    }

    /**
     * 미들웨어 등록 메서드
     * @param {Function} middleware - (req, res, next) 형태의 함수
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * 라우트 등록 메서드
     * @param {string} method - HTTP 메서드 ('GET', 'POST' 등)
     * @param {string} path - 요청 경로 ('/', '/about' 등)
     * @param {Function} handler - (req, res) 형태의 요청 처리 함수
     */
    route(method, path, handler) {
        if (path.includes(':')) {
            const { regex, paramNames } = util.pathToRegex(path);
            this.routes.push({ method, regex, paramNames, handler});        
        } else {
            this.routes.push({ method, path, handler});
        }
    }

    /**
     * 서버 실행 메서드
     * @param {number} port - 서버가 listen할 포트 번호
     */
    listen(port) {
        const server = http.createServer((req, res) => {
            // 요청이 들어오면 먼저 모든 미들웨어를 실행
            this.#runMiddlewares(req, res, () => {
                // 미들웨어 실행 후 라우팅 핸들링
                this.#handleRoute(req, res);
            });
        });

        server.listen(port, () => {
            console.log(`서버 실행: http://localhost:${port}`);
        });
    }

    /**
     * (private) 등록된 미들웨어 순차 실행
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {Function} done - 모든 미들웨어 실행 완료 시 호출될 콜백
     */
    #runMiddlewares(req, res, done) {
        let i = 0;
        const next = () => {
            if (i < this.middlewares.length) {
                this.middlewares[i++](req, res, next);
            } else {
                done(); // 모든 미들웨어 실행 이후 route 처리
            }
        };
        next();
    }

    /**
     * (private) URL과 메서드에 맞는 라우트 처리
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    #handleRoute(req, res) {
        const { method, url } = req;

        // 정규식이 존재하는 route 우선 처리
        for (const route of this.routes) {
            if (route.regex && route.method === method) {
                const match = url.match(route.regex);
                if (match) {
                    // 파라미터 추출
                    const params = {};
                    route.paramNames.forEach((name, idx) => {
                        params[name]  = match[idx + 1];
                    });
                    req.params = params;

                    return route.handler(req, res);
                }
            }
        }

        // 정규식 없는 route 처리
        // 등록된 라우트 중 method와 path가 모두 일치하는 항목 찾기
        const matched = this.routes.find(route => route.method == method && route.path === url);
        if (matched) {
            return matched.handler(req, res);
        }

        res.writeHead(404, { 'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }

}

module.exports = MyApp;