import { SignJWT, jwtVerify } from "jose";

/**
 * Single-password admin auth. The owner logs in with ADMIN_PASSWORD; we issue a
 * signed session cookie (HS256 JWT) verified by middleware on every /admin and
 * /api/admin request. Edge-safe (jose only, no Node APIs) so middleware can use it.
 */
export const SESSION_COOKIE = "rm_session";
const SESSION_TTL = "30d";

function secretKey(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    // Dev fallback so the app runs out of the box. Set SESSION_SECRET in prod.
    "restmenu-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

/** The configured admin password (dev fallback: "admin"). */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Timing-safe-ish password comparison. */
export function passwordMatches(input: string): boolean {
  const expected = adminPassword();
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < input.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
