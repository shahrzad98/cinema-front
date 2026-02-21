# syntax=docker/dockerfile:1.6

############################
# 1) deps - install node_modules with cache
############################
FROM node:24.13.1-alpine AS deps
WORKDIR /app

# pnpm via corepack
RUN corepack enable

# Copy only manifests first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (frozen lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile

############################
# 2) builder - build Next.js
############################
FROM node:24.13.1-alpine AS builder
WORKDIR /app
RUN corepack enable

# Reuse deps
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY . .

# Build
ENV NODE_ENV=production
RUN pnpm build

############################
# 3) runner - minimal runtime image
############################
FROM node:24.13.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only what we need to run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

# ... runner stage ...
EXPOSE 3000
CMD ["sh", "-c", "node node_modules/next/dist/bin/next start -p $PORT"]
