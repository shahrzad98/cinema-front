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

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build (your script already applies env-cmd production)
RUN pnpm build-production

############################
# 3) runner - minimal runtime image (standalone)
############################
FROM node:24.13.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy standalone output (includes minimal server + traced deps)
COPY --from=builder /app/.next/standalone ./

# If you want the standalone server to serve these too (no CDN):
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Standalone runs with the generated server.js (instead of `next start`)
CMD ["node", "server.js"]