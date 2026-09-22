import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Image upload, provider-agnostic. Chosen at runtime by which env vars are set:
 *   1. S3-compatible (Cloudflare R2 / Supabase / Backblaze / AWS) — S3_* vars
 *   2. Vercel Blob — BLOB_READ_WRITE_TOKEN
 *   3. Local filesystem — dev only (/public/uploads)
 *
 * Returns a public URL to the stored image.
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export class UploadError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function s3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_PUBLIC_BASE_URL,
  );
}

export async function uploadImage(file: File): Promise<string> {
  const ext = ALLOWED[file.type];
  if (!ext) {
    throw new UploadError("Unsupported type. Use PNG, JPG, WEBP, AVIF, or SVG.", 415);
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("File is larger than 8 MB.", 413);
  }

  const key = `dishes/${randomUUID()}.${ext}`;

  // 1. S3-compatible (Cloudflare R2 et al.)
  if (s3Configured()) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
    const body = Buffer.from(await file.arrayBuffer());
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: body,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    const base = process.env.S3_PUBLIC_BASE_URL!.replace(/\/+$/, "");
    return `${base}/${key}`;
  }

  // 2. Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  // 3. Local filesystem (development only)
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const localName = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(dir, localName), bytes);
  return `/uploads/${localName}`;
}
