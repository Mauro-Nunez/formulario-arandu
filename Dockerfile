FROM node:22-alpine AS builder

WORKDIR /usr/src/builder

COPY package.json package-lock.json ./
COPY prisma/schema.prisma prisma/schema.prisma

RUN npm ci --omit=dev --legacy-peer-deps

RUN npm run generate

FROM node:22-alpine AS runner

WORKDIR /usr/src/app

RUN apk add --no-cache openssl3

COPY --from=builder /usr/src/builder/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /usr/src/builder/node_modules/@prisma/client ./node_modules/@prisma/client

COPY . .

CMD ["node", "index.js"]
