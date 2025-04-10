FROM oven/bun:alpine
WORKDIR /usr/src/app

ENV TZ="America/Montevideo"
ENV PORT=3000

EXPOSE 3000/tcp

COPY package*.json ./

RUN apk add --no-cache tzdata
RUN bun install # --production

COPY . .

ENTRYPOINT [ "bun", "index.mjs" ]
