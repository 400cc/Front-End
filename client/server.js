import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 정적 파일을 build 폴더에서 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 요청에 대해 index.html을 반환
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 서버 실행
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
