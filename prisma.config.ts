import { defineConfig, env } from "prisma/config";

// Prisma 7 no longer auto-loads `.env` when a prisma.config.ts is present, so
// the CLI (migrate/generate/seed) would not see DATABASE_URL during local dev.
// Load it explicitly. In Docker there is no `.env` (the var is injected by
// compose), so this throws and is safely ignored.
try {
  process.loadEnvFile();
} catch {
  // no .env file present — rely on the existing process environment
}

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
