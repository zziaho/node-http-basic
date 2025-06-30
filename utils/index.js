/**
 * utils/index.js
 * 역할별 유틸리티 모듈 통합 진입점
 * - route: 라우팅 관련 도구 (pathToRegex 등)
 * - body: 요청 바디 파싱 관련 도구
 * - response: JSON 응답 포맷 등 응답 처리 도구
 */
module.exports = {
  route: require('./routeUtil'),
  body: require('./bodyUtil'),
  response: require('./responseUtil'),
};