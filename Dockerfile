FROM node:16-alpine

WORKDIR /opt/app

ENV PORT=8080
EXPOSE 8080

RUN apk add --no-cache tzdata
ENV TZ="America/Montevideo"

COPY package*.json ./

RUN npm install -g pm2
RUN npm ci --production

COPY . .

CMD [ "npm", "run", "pm2" ]
