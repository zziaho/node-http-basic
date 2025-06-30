/**
 * <routeUtil.js>
 * route 관련 공통 유틸 
 */
const routeUtil = {

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

};

module.exports = routeUtil;