const MyApp = require('./myApp');
const middlewares = require('../middleware');
const { util } = require('../util');

/**
 * <app.js>
 * MyApp 클래스 기반으로 라우터 및 미들웨어 설정 후 서버 실행
 * 프레임워크처럼 앱 객체를 구성해, 라우팅 및 미들웨어를 선언형으로 정의
 */

const app = new MyApp();
const PORT = 3000;

// 미들웨어 등록
middlewares.forEach(middleware => app.use(middleware));

// 라우터 등록
app.route('GET', '/', (req, res) => {
    util.sendJson(res, 200, 'Root Page');
});

app.route('GET', '/about', (req, res) => {
    util.sendJson(res, 200, 'About Page');
});

// 동적 URL 파라미터 처리
app.route('GET', '/users/:id', (req, res) => {
    const userId = req.params.id
    util.sendJson(res, 200, 'User Found', { userId });
});

// GET /search 쿼리 스트링 처리
app.route('GET', '/search', (req, res) => {
    const { keyword } = req.query;

    // keyword 유효성 검사
    if (!keyword || keyword.trim() === '') {
        return util.sendJson(res, 400, '검색어(keyword)가 누락되었거나 비어 있습니다.', {}, false);
    }

    // 정상 응답
    util.sendJson(res, 200, 'Search Result', { keyword });
})

// 오류 강제 발생 라우트
app.route('GET', '/error', (req, res) => {
    throw new Error('Forced error occurs!');
})
// 비동기 오류 강제 발생 라우트 
app.route('GET', '/asyncError', async (req, res) => {
    throw new Error('Forced Async Error occurs!'); // == Promise.reject()
})

// 중복 응답 강제 발생 라우트
app.route('GET', '/double-response', (req, res) => {
    util.sendJson(res, 200, '1st Response', { step: 1 });
    util.sendJson(res, 200, '2nd Response', { step: 2 });
});
// 중복 응답 async
app.route('GET', '/double-async', async (req, res) => {
    util.sendJson(res, 200, '1st Response');
    await new Promise(resolve => setTimeout(resolve, 100));
    util.sendJson(res, 200, '2nd Response');
});

app.route('POST', '/contact', async (req, res) => {
    const body = await util.parseRequestBody(req);
    util.sendJson(res, 200, 'Contact Received', body);
});

// 에러 미들웨어 등록
app.use((err, req, res, next) => {
    console.log('ERROR:', err.message);
    util.sendJson(res, 500, 'Error Middleware Response', { message: err.message }, false);
})

// 서버 실행
app.listen(PORT);