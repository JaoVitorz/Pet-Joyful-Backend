FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build

# ----------------------------

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# 👇 mais moderno que --only=production
RUN npm install --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]