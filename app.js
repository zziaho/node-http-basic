/**
 * <app.js>
 * MyApp 클래스 기반으로 라우터 및 미들웨어 설정 후 서버 실행
 * 프레임워크처럼 앱 객체를 구성해, 라우팅 및 미들웨어를 선언형으로 정의
 */

require('module-alias/register');

const MyApp = require('@core/myApp');
const middlewares = require('@middleware');
const utils = require('@utils');
const registerRoutes = require('@routes');


const app = new MyApp();
const PORT = 3000;

// 미들웨어 등록
middlewares.forEach(middleware => app.use(middleware));

// 라우트 등록
registerRoutes(app);

// 에러 미들웨어 등록
app.use((err, req, res, next) => {
    console.log('ERROR:', err.message);
    utils.response.sendJson(res, 500, 'Error Middleware Response', { message: err.message }, false);
})

// 서버 실행
app.listen(PORT);