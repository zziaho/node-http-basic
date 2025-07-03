/**
 * routes > index.js
 * 모든 라우터 모듈 통합
 */
const utils = require('@utils');

module.exports = function (app) {

    require('./baseRouter')(app);
    require('./userRouter')(app);
    require('./searchRouter')(app);
    require('./testRouter')(app);

};
