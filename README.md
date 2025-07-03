# Node-HTTP-Basic

Node.js의 기본 `http` 모듈을 사용하여 Express 없이 직접 HTTP 서버를 구현하며,  
프레임워크 구조, 라우팅, 미들웨어, 유틸 구조 등을 학습하는 프로젝트입니다.

---

## 🛠 주요 기능

- `http.createServer()` 기반 서버 직접 구현
- `GET`, `POST` 요청 라우팅 처리 (`MyApp.route()`)
- 동적 URL 파라미터, 쿼리스트링 파싱
- `application/json` 형식의 요청 바디 파싱
- Express-like 방식의 미들웨어 체인 구현
- 에러 핸들링 미들웨어 직접 정의
- `dotenv`를 통한 환경변수 설정
- `module-alias`를 활용한 절대경로 import
- 구조화된 유틸/미들웨어/라우터 디렉터리 구성

---

## 📁 프로젝트 구조

```text
node-http-basic/
├── app.js                    # 서버 진입점 (MyApp 인스턴스 실행)
├── .env                      # 환경 변수 (예: PORT)
├── .env.example              # 샘플 환경 변수 파일
├── package.json              # 의존성 및 alias 설정
├── config/
│   └── index.js              # 환경변수 래퍼 모듈
├── core/
│   └── myApp.js              # MyApp 클래스 (라우팅 & 미들웨어 처리)
├── middleware/
│   ├── index.js              # 미들웨어 묶음
│   └── logger.js             # 요청 로깅 미들웨어
├── routes/
│   └── index.js              # 모든 라우터 정의
└── utils/
    ├── index.js              # 유틸리티 모듈 엔트리
    ├── bodyUtil.js           # 바디 파서 유틸
    ├── responseUtil.js       # JSON 응답 포맷터
    └── routeUtil.js          # URL 매칭 유틸
```

---

## ⚙️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일 생성

```env
PORT=3000
```

또는 `.env.example` 복사

```bash
cp .env.example .env
```

### 3. 서버 실행

```bash
node app.js
```

---

## 테스트 명령어 예시

```bash
curl http://localhost:3000/
curl http://localhost:3000/users/42
curl http://localhost:3000/search?keyword=node
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "Node", "message": "Hello"}'
```

---

## 🧩 핵심 소스 예시

### core/myApp.js

```js
const http = require('http');
const utils = require('@utils');

class MyApp {

    constructor() {
        this.middlewares = [];
        this.errorMiddlewares = [];
        this.routes = []; 
    }

    use(middleware) {
        if (middleware.length === 4) {
            this.errorMiddlewares.push(middleware);
        } else {
            this.middlewares.push(middleware);
        }
    }

    route(method, path, handler) {
        if (path.includes(':')) {
            const { regex, paramNames } = utils.route.pathToRegex(path);
            this.routes.push({ method, regex, paramNames, handler});        
        } else {
            this.routes.push({ method, path, handler});
        }
    }

    listen(port) {
        const server = http.createServer((req, res) => {
            this.#runMiddlewares(req, res, () => {
                this.#handleRoute(req, res);
            });
        });

        server.listen(port, () => {
            console.log(`서버 실행: http://localhost:${port}`);
        });
    }

    // ...
}
```