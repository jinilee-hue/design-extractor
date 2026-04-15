# Puppeteer가 설치된 공식 이미지를 사용합니다.
FROM ghcr.io/puppeteer/puppeteer:21.5.0

USER root
WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 서버 실행
CMD ["node", "server.js"]
