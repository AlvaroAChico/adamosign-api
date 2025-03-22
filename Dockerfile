FROM node:20-alpine AS builder

LABEL stage="builder"
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY ./src ./src
COPY .env .env

RUN npm run build

FROM node:20-alpine AS runner

LABEL maintainer="Alvaro Chico"
LABEL stage="production"
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env

EXPOSE 3000

CMD ["node", "dist/index.js"]
