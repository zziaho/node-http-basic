const logger = require('./logger');
const queryParser = require('./queryParser');

const middleware = [logger, queryParser];

module.exports = middleware;