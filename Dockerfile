FROM node:14-alpine

WORKDIR /opt/app

ENV PORT=3000
EXPOSE 3000

COPY package*.json ./

RUN npm install -g pm2
RUN npm ci --production

COPY . .

CMD [ "npm", "run", "pm2" ]
