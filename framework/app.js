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

app.route('POST', '/contact', async (req, res) => {
    const body = await util.parseRequestBody(req);
    util.sendJson(res, 200, 'Contact Received', body);
});

// 서버 실행
app.listen(PORT);