# syntax=docker/dockerfile:1

# ─── Stage 1: install all deps ───────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client (DATABASE_URL required by prisma.config.ts even for generate)
# then build Next.js (standalone output).
# DATABASE_URL must be present at build time to satisfy the module initialiser in
# lib/db/client.ts even though no actual DB connection is made during the build.
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npm run build

# ─── Stage 3: runtime ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy standalone Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma artefacts (schema, migrations, seed, config) so the entrypoint
# can run `prisma migrate deploy` and `tsx prisma/seed.ts` at container start.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy the full node_modules from the builder so we have:
#   - prisma CLI  (devDep, not in standalone trace)
#   - tsx         (devDep, not in standalone trace)
#   - @prisma/client with generated WASM artefacts
#   - @prisma/adapter-pg, pg (runtime deps, also needed here for the seed)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy entrypoint and make it executable
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./docker-entrypoint.sh"]
