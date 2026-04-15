FROM ghcr.io/puppeteer/puppeteer:21.5.0

USER root
WORKDIR /app

COPY package*.json ./
# Puppeteer 설치 시 브라우저가 같이 설치되도록 함
RUN npm install

COPY . .

# 실행 권한 부여
RUN chmod -R 777 /app

EXPOSE 10000

CMD ["node", "server.js"]
