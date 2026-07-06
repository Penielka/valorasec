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

# Install dependencies and build all packages
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@valorasec/shared --filter=@valorasec/analyzer

# ─── API Builder ─────────────────────────────────────────────────────
FROM installer AS api-builder
RUN pnpm build --filter=@valorasec/api

# ─── API Runner ──────────────────────────────────────────────────────
FROM node:20-alpine AS api-runner
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

COPY --from=api-builder /app/apps/api/dist ./dist
COPY --from=api-builder /app/apps/api/prisma ./prisma
COPY --from=api-builder /app/apps/api/package.json ./
COPY --from=api-builder /app/apps/api/nest-cli.json ./
COPY --from=api-builder /app/node_modules ./node_modules

RUN pnpm prisma generate

EXPOSE 4000
CMD ["node", "dist/main.js"]

# ─── Web Builder ─────────────────────────────────────────────────────
FROM installer AS web-builder
RUN pnpm build --filter=@valorasec/web

# ─── Web Runner ──────────────────────────────────────────────────────
FROM node:20-alpine AS web-runner
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

COPY --from=web-builder /app/apps/web/.next ./.next
COPY --from=web-builder /app/apps/web/package.json ./
COPY --from=web-builder /app/apps/web/next.config.js ./
COPY --from=web-builder /app/apps/web/public ./public
COPY --from=web-builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
