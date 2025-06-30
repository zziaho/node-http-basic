/**
 * <bodyUtil.js>
 * request/response Body 관련 공통 유틸
 */
const bodyUtil = {

    /**
     * JSON 형식의 POST 요청 바디 파싱
     * @param {IncomingMessage} req - 요청 객체
     * @returns {Promise<Object>} 파싱된 JSON 객체
     */
    parseRequestBody(req) {
        return new Promise((resolve) => {
            let body = '';

            // 요청 데이터 수신 시마다 chunk 단위로 모음
            req.on('data', (chunk) => {
                body += chunk;
            });

            // 수신이 끝나면 JSON 파싱 시도
            req.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed); // 성공 시 객체로 반환
                } catch {
                    resolve({}); // 파싱 실패 시 빈 객체 반환
                }
            });
        });
    }

};

module.exports = bodyUtil;