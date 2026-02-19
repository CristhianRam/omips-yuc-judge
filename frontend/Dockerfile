# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Build the app ----
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_API gets baked into the client bundle at build time.
# Override with --build-arg or in docker-compose build.args.
ARG NEXT_PUBLIC_API=http://localhost:8080
ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}

# Server-side env vars needed at build time for type checking.
# The real values are injected at runtime via env_file or environment.
ARG POSTGRES_URL=""
ARG AUTH_SECRET="build-placeholder"
ENV POSTGRES_URL=${POSTGRES_URL}
ENV AUTH_SECRET=${AUTH_SECRET}

RUN pnpm build

# ---- Stage 3: Production runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
