FROM node:18

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:gateway

CMD ["node", "dist/apps/gateway/main.js"]