# Node HTTP Basic

Node.js의 기본 `http` 모듈을 사용하여 Express 없이 직접 HTTP 서버를 구현하며, 프레임워크의 개념을 학습하는 프로젝트입니다.

---

## 🛠 주요 기능

- `http.createServer()` 기반 서버 직접 구현
- `GET`, `POST` 요청 처리 라우팅
- `application/json` 형식의 POST 요청 바디 파싱
- 쿼리스트링 및 동적 URL 파라미터 처리
- 미들웨어 기능 직접 구현 (예: 요청 로깅)
- Express-like 방식의 프레임워크 모방 (`MyApp` 클래스)

---

## 📁 프로젝트 구조
node-http-basic/
├── framework/
│ ├── app.js    # MyApp 프레임워크를 사용하는 서버 진입점
│ └── myApp.js  # 프레임워크처럼 사용할 수 있는 클래스 설계
├── middleware/
│ ├── logger.js # 요청 로그 출력 미들웨어
│ └── index.js  # 미들웨어 모듈 묶음
├── routes.js   # 기존 http 서버 라우팅
├── server.js   # 기본 http 서버 실행 파일
├── util.js     # Body parser, 응답 포맷 등 공통 유틸 함수
└── README.md

---

## 🚀 실행 방법

```bash
# 프레임워크 형태로 실행 (추천)
$ node framework/app.js

# http.createServer 형태로 실행
$ node server.js

# 루트 페이지
curl http://localhost:3000/

# 동적 URL
curl http://localhost:3000/users/ABC

# 쿼리 스트링
curl http://localhost:3000/search?keyword=hello

# POST 요청
curl -X POST http://localhost:3000/contact \
     -H "Content-Type: application/json" \
     -d '{"name": "Node", "message": "Hello!"}'