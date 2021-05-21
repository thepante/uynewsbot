FROM node:14-alpine

WORKDIR /opt/app

ENV PORT=3000
EXPOSE 3000

RUN apk --update add make python gcc g++

COPY package*.json ./

RUN npm install -g pm2
RUN npm ci

COPY . .

RUN mkdir -p logs

CMD pm2 --log logs/out.log --time start index.mjs
