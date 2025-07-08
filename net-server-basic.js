/**
 * <net-server-basic>
 */
const net = require('net');
const readLine = require('readline');

// client 고유 식별을 위한 ID 카운터 (1부터 순차적으로 증가)
let clientId = 0;

// TCP 서버 생성 및 클라이언트 연결 이벤트 처리
const server = net.createServer((soket) => {
    const id = ++clientId;
    console.log(`[Clinet ${id}] Connected!`);

    // 클라이언트로부터 수신되는 soket stream을 줄 단위로 처리
    const rl = readLine.createInterface({
        input: soket,
        output: soket,
        terminal: false
    });

    // 데이터 수신
    rl.on('line', (line) => {
        console.log(`[Client ${id}] ${line}`);
        soket.write(`[Echo ${id}]: ${line}\n`); // 클라이언트로 응답 전송
    });

    // 클라이언트 연결 종료
    soket.on('end', () => {
        console.log(`[Client ${id}] Disconnected`);
    });

    // error 처리
    soket.on('error', (err) => {
        console.log(`[Client ${id}] Error: `, err.message);
    })
});

// 서버 포트 바인딩 및 시작
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`TCP Server listening on PORT: ${PORT}`);
})