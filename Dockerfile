# 依存パッケージのインストール
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json  ./
RUN npm ci --prod

# ビルド環境
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json  ./
RUN npm ci
COPY . .
RUN npm run build

# Production image, copy all the files and run
FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/build ./build
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

# ENV NODE_ENV production
ENV PORT 3001

CMD ["node", "build"]