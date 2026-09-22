import { hasDatabase } from "@/lib/db-env";
import type { MenuStore } from "./types";
import { JsonMenuStore } from "./json-store";

/**
 * Selects the storage backend once per process:
 *   - DATABASE_URL present  → Postgres via Prisma (production)
 *   - otherwise             → local JSON file (development, zero-setup)
 *
 * The Prisma store is imported lazily so the JSON path never loads the Prisma
 * client (and never needs a generated client) during local development.
 */
let cached: MenuStore | null = null;

export function getStore(): MenuStore {
  if (cached) return cached;

  if (hasDatabase) {
    // Lazy require keeps @prisma/client out of the dev bundle path.
    const { PrismaMenuStore } = require("./prisma-store") as typeof import("./prisma-store");
    cached = new PrismaMenuStore();
  } else {
    cached = new JsonMenuStore();
  }
  return cached;
}

export type { MenuStore } from "./types";
