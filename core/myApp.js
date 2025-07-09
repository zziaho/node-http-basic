const http = require('http');
const utils = require('@utils');

/**
 * MyApp 클래스는 기본 HTTP 서버를 기반으로 
 * 미들웨어 및 라우팅 시스템을 구현한 간단한 프레임워크 역할을 한다.
 */
class MyApp {

    constructor() {
        this.middlewares = [];      // 미들웨어 목록
        this.errorMiddlewares = []; // 에러 핸들링 미들웨어
        this.routes = [];           // 라우팅 정보 목록
    }

    /**
     * 미들웨어 등록 메서드
     * @param {Function} middleware - (req, res, next) 형태의 함수
     */
    use(middleware) {
        if (middleware.length === 4) {
            this.errorMiddlewares.push(middleware); // (err, req, res, next)
        } else {
            this.middlewares.push(middleware);
        }
    }

    /**
     * 라우트 등록 메서드
     * @param {string} method - HTTP 메서드 ('GET', 'POST' 등)
     * @param {string} path - 요청 경로 ('/', '/about' 등)
     * @param {Function} handler - (req, res) 형태의 요청 처리 함수
     */
    route(method, path, handler) {
        if (path.includes(':')) {
            const { regex, paramNames } = utils.route.pathToRegex(path);
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
        const next = (err) => {
            if (err) {
                return this.#runErrorMiddlewares(err, req, res);
            }

            if (i >= this.middlewares.length) {
                return done(); // 모든 미들웨어 실행 완료
            }
            
            try {
                this.middlewares[i++](req, res, next);
            } catch (e) {
                next(e);
            }

        };
        next();
    }

    /**
     * (private) URL과 메서드에 맞는 라우트 처리
     * - 동적 라우팅(:id 등)은 정규식으로 매칭하여 req.params에 주입
     * - 쿼리스트링 파싱 후 req.query로 주입
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    #handleRoute(req, res) {
        const { method, url } = req;
        const pathName = req.parsedUrl.pathname;
        
        // 동적 route 처리 (정규식 기반)
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

                    this.#runHandler(route.handler, req, res);
                    return;
                }
            }
        }

        // 정적 route 처리
        const matched = this.routes.find(route => route.method == method && route.path === pathName);
        if (matched) {
            this.#runHandler(matched.handler, req, res);
            return;
        }

        // 404 Not Found
        if (!utils.response.validateResponse(res)) return;
        res.writeHead(404, { 'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }

    /**
     * 
     */
    #runErrorMiddlewares(err, req, res) {
        let i = 0;
        const next = (err) => {
            if (i < this.errorMiddlewares.length) {
                this.errorMiddlewares[i++](err, req, res, next);
            } else {
                if (!utils.response.validateResponse(res)) return;
                
                // 마지막까지 처리 못하면 기본 응답
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Internal Server Error',
                    error: err.message,
                }));
            }
        };
        next(err);
    }

    /**
     * (private) 라우트 핸들러 실행 및 예외 처리
     * - 동기 예외는 try/catch로 즉시 처리
     * - 비동기 함수(async)인 경우, Promise.catch로 예외 전파
     * - 에러 발생 시 에러 미들웨어 실행
     * @param {Function} handler - 등록된 라우트 핸들러 함수
     * @param {IncomingMessage} req - 요청 객체
     * @param {ServerResponse} res - 응답 객체
     */
    #runHandler(handler, req, res) {
        try {
            const isPromise = handler(req, res);
            if (isPromise instanceof Promise) {
                isPromise.catch(err => this.#runErrorMiddlewares(err, req, res));
            }
        } catch (err) {
            this.#runErrorMiddlewares(err, req, res);
        }
    }

}

module.exports = MyApp;