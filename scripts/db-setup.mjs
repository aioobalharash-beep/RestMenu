// Runs during the production build (see package.json "build").
// Creates/updates the database tables and seeds the sample menu once.
// No-ops when no database is configured, so local builds still work on JSON.
import { execSync } from "node:child_process";

const pooled =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

const direct =
  process.env.DIRECT_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  pooled;

if (!pooled) {
  console.log("[db-setup] No database URL found — skipping (using local JSON store).");
  process.exit(0);
}

const env = { ...process.env, DATABASE_URL: pooled, DIRECT_URL: direct };

try {
  console.log("[db-setup] Applying schema with `prisma db push`…");
  execSync("npx --no-install prisma db push --skip-generate", { stdio: "inherit", env });

  console.log("[db-setup] Seeding sample menu (skips if data already exists)…");
  execSync("npx --no-install tsx prisma/seed.ts", { stdio: "inherit", env });

  console.log("[db-setup] Database ready.");
} catch (err) {
  console.error("[db-setup] Failed:", err?.message || err);
  process.exit(1);
}
