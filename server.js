const express = require('express');
const cors = require('cors');
const path = require('path'); // 파일 경로 처리를 위한 모듈 추가
const { extractDesignTokens } = require('./extract');
const app = express();

app.use(cors());
app.use(express.json());

// [중요] 정적 파일 서비스 설정: 현재 폴더의 파일들을 브라우저에서 접근 가능하게 함
app.use(express.static(path.join(__dirname, '/')));

// 루트 주소(/) 접속 시 index.html 파일을 전송
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 기존 분석 API 엔드포인트
app.post('/analyze', async (req, res) => {
    console.log(`[START] Analyzing URL: ${req.body.url}`);
    try {
        const data = await extractDesignTokens(req.body.url);
        res.json({ success: true, data });
    } catch (e) {
        console.error(`[ERROR] Analysis failed: ${e.message}`);
        res.status(500).json({ success: false, error: e.message });
    }
});

// Render 환경에서는 process.env.PORT를 사용해야 하며, 0.0.0.0으로 바인딩해야 접속이 원활합니다.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ 서버 가동 중: http://localhost:${PORT}`);
    console.log(`✅ 배포 환경 포트: ${process.env.PORT || 'Local 3000'}`);
});