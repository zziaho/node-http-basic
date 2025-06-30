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
        if (!this.validateResponse(res)) return;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            statusCode,
            success,
            message,
            data,
        }));
    },

    /**
     * 응답 객체가 이미 종료되었는지 검사하는 유틸리티 함수
     * 
     * - res.writableEnded 값이 true인 경우, 이미 응답이 완료되어
     *   헤더나 본문을 더 이상 작성할 수 없음을 의미함.
     * - 중복 응답을 방지하기 위해 사용되며,
     *   상황에 따라 콘솔 경고를 출력하고 false를 반환함.
     * 
     * @param {ServerResponse} res - 응답 객체
     * @returns {boolean} 응답이 가능한 상태인지 여부 (true: 가능, false: 이미 끝남)
     */
    validateResponse(res) {
        if (res.writableEnded) {
            console.warn('[WARN] 응답이 이미 완료된 상태입니다.');
            return false;
        }
        return true;
    }

};

module.exports = responseUtil;