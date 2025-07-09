const urlParser = require('./urlParser');
const logger = require('./logger');
const queryParser = require('./queryParser');

const middleware = [urlParser, queryParser, logger];

module.exports = middleware;