FROM node:18

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:auth

CMD ["node", "dist/apps/auth/src/main.js"]