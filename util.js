/**
 * <utils.js>
 * 공통 유틸 함수 묶음
 */

const util = {
    
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
    },

    /**
     * 통일된 JSON 형식 응답 전송
     * @param {ServerResponse} res - 응답 객체
     * @param {number} statusCode - HTTP 상태 코드
     * @param {string} message - 클라이언트에게 보낼 메시지
     * @param {Object} [data={}] - 전송할 데이터 객체
     * @param {boolean} [success=true] - 요청 성공 여부
     */
    sendJson(res, statusCode, message, data = {}, success = true) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            statusCode,
            success,
            message,
            data,
        }));
    },

    /**
     * 동적 URL 경로를 정규표현식(RegExp)으로 변환하고,
     * URL에 포함된 파라미터 이름 목록을 추출함
     * 
     * 예: "/users/:id" -> {
     *        regex: /^\/users\/([^/]+)$/,
     *        paramNames: ['id']
     *     }
     * 
     * @param {string} path - 정의된 라우트 경로 (예: '/users/:id')
     * @returns {{ regex: RegExp, paramNames: string[] }}
     */
    pathToRegex(path) {
        const paramNames = [];
        const regexStr = path.replace(/:([^/]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });

        return {
            regex: new RegExp(`^${regexStr}$`),
            paramNames
        }
    }
}

module.exports = { util };
