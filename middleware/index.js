const urlParser = require('./urlParser');
const logger = require('./logger');
const queryParser = require('./queryParser');
const bodyParser = require('./bodyParser');

const middleware = [
    urlParser, 
    queryParser, 
    bodyParser, 
    logger
];

module.exports = middleware;