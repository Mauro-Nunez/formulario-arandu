FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY prisma/schema.prisma prisma/schema.prisma

RUN npm ci --omit=dev --legacy-peer-deps

RUN npm run generate

RUN apk add --no-cache openssl3

COPY . .

CMD ["node", "index.js"]
