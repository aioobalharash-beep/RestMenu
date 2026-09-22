import { PrismaClient } from "@prisma/client";
// Side effect: backfills DATABASE_URL / DIRECT_URL from provider-specific names.
import "@/lib/db-env";

// Reuse a single PrismaClient across hot-reloads / serverless invocations.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
