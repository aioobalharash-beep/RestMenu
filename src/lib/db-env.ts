/**
 * Normalizes the various env-var names that a hosted Postgres integration may
 * provide, so the rest of the app only has to look at DATABASE_URL / DIRECT_URL.
 *
 * Vercel's first-party Postgres sets POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING;
 * the Neon marketplace integration sets DATABASE_URL / DATABASE_URL_UNPOOLED;
 * a plain connection string sets DATABASE_URL. We accept all of them.
 *
 * Importing this module backfills process.env.DATABASE_URL / DIRECT_URL as a
 * side effect, so Prisma (which reads them from the schema) resolves correctly.
 */
const pooled =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

const direct =
  process.env.DIRECT_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  pooled;

if (pooled && !process.env.DATABASE_URL) process.env.DATABASE_URL = pooled;
if (direct && !process.env.DIRECT_URL) process.env.DIRECT_URL = direct;

/** True when a Postgres connection string is available (production). */
export const hasDatabase = Boolean(pooled);
