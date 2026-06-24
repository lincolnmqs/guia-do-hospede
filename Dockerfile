# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:20-alpine

# ─── Stage 1: full deps (for building) ───────────────────────────────────────
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ─── Stage 2: build ──────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# A dummy DATABASE_URL satisfies prisma.config.ts and the db client module
# initialiser at build time — no real connection is made during the build.
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN --mount=type=cache,target=/app/.next/cache npm run build

# ─── Stage 3: boot tools (migrate + seed) ────────────────────────────────────
# Next bundles app dependencies into the server chunks, so packages like
# @prisma/adapter-pg and zod are NOT present as resolvable modules in the
# standalone output — but the seed runs as a separate `tsx` process and needs
# them. We install exactly the seed's runtime deps plus the two CLIs (prisma,
# tsx) here and generate the client. This stays lean: no next/react/openai/etc.
FROM ${NODE_IMAGE} AS boot-tools
WORKDIR /tools
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN --mount=type=cache,target=/root/.npm \
    npm i --no-save --prefix /tools \
      prisma@^7.8.0 tsx@^4.22.4 \
      @prisma/client@^7.8.0 @prisma/adapter-pg@^7.8.0 pg@^8.22.0 zod@^4.4.3 && \
    npx prisma generate

# ─── Stage 4: runtime ────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# tini as PID 1 → proper signal forwarding and zombie reaping.
RUN apk add --no-cache tini

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Next.js standalone server output (server.js + lean traced node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma artefacts for the boot-time migrate + seed.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Overlay only the boot tools (prisma CLI + tsx) onto the standalone modules.
COPY --from=boot-tools --chown=nextjs:nodejs /tools/node_modules ./node_modules

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./docker-entrypoint.sh"]
