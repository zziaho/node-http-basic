/**
 * <responseUtil.js>
 * response 응답 관련 공통 유틸
 */
const responseUtil = {

    /**
     * 통일된 JSON 형식 응답 전송
     * @param {ServerResponse} res - 응답 객체
     * @param {number} statusCode - HTTP 상태 코드
     * @param {string} message - 클라이언트에게 보낼 메시지
     * @param {Object} [data={}] - 전송할 데이터 객체
     * @param {boolean} [success=true] - 요청 성공 여부
     */
    sendJson(res, statusCode, message, data = {}, success = true) {
        // 1. 중복 응답 전송 확인
        if (!this.validateResponse(res)) return;

        // 2. 기본 응답 형식 구성
        const responseBody = {
            statusCode,
            success: success !== undefined ? success : statusCode < 400,
            message,
            data
        };
        const json = JSON.stringify(responseBody);

        // 3. 헤더 설정
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');

        // 4. 본문 전송 및 스트림 종료
        res.end(json);
    },

    /**
     * 응답 객체가 응답 가능한 상태인지 검사하는 유틸리티 함수
     *
     * - res.headersSent가 true인 경우:
     *   이미 응답 헤더가 전송되어, 상태 코드나 헤더를 더 이상 설정할 수 없음.
     *
     * - res.writableEnded가 true인 경우:
     *   응답 본문까지 모두 전송되어 스트림이 종료된 상태로,
     *   더 이상 데이터를 전송할 수 없음.
     *
     * - 이 함수는 중복 응답이나 예기치 않은 오류를 방지하기 위해 사용.
     *   응답이 불가능한 경우 콘솔 경고를 출력하고 false를 반환.
     *
     * @param {ServerResponse} res - 응답 객체
     * @returns {boolean} 응답이 가능한 상태: true / 불가능 상태: false
     */
    validateResponse(res) {
        if (res.headersSent) {
            console.warn('[WARN] 응답 헤더가 이미 전송되었습니다.');
            return false;
        }

        if (res.writableEnded) {
            console.warn('[WARN] 응답이 이미 완료된 상태입니다.');
            return false;
        }
        return true;
    }

};

module.exports = responseUtil;