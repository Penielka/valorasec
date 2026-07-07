# ─── Base Stage ──────────────────────────────────────────────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY tsconfig.base.json ./
COPY turbo.json ./

# ─── Installer ───────────────────────────────────────────────────────
FROM base AS installer
RUN apk add --no-cache libc6-compat python3 make g++
COPY . .

ENV CI=true
RUN pnpm install --frozen-lockfile

# Build shared packages first
RUN pnpm build --filter=@valorasec/shared --filter=@valorasec/analyzer

# Generate Prisma client and build API
RUN pnpm --filter=@valorasec/api run db:generate
RUN pnpm build --filter=@valorasec/api

# Build web
RUN pnpm build --filter=@valorasec/web

# ─── API Deploy ───────────────────────────────────────────────────────
FROM installer AS api-deploy
RUN pnpm --filter=@valorasec/api deploy --legacy /deploy
# Regenerate Prisma client in the deploy output
RUN cd /deploy && pnpm exec prisma generate

# ─── API Runner ──────────────────────────────────────────────────────
FROM node:20-alpine AS api-runner
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=api-deploy /deploy ./
EXPOSE 4000
CMD ["node", "dist/src/main.js"]

# ─── Web Deploy ───────────────────────────────────────────────────────
FROM installer AS web-deploy
RUN pnpm --filter=@valorasec/web deploy --prod --legacy /deploy

# ─── Web Runner ──────────────────────────────────────────────────────
FROM node:20-alpine AS web-runner
WORKDIR /app
COPY --from=web-deploy /deploy ./
EXPOSE 3000
CMD ["node_modules/next/dist/bin/next", "start"]
