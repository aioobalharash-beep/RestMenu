import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

/**
 * POST /api/admin/upload — multipart form with `file`.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production); otherwise
 * writes to /public/uploads so local development needs no cloud storage.
 * Returns { url }.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported type. Use PNG, JPG, WEBP, AVIF, or SVG." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 8 MB." }, { status: 413 });
  }

  const filename = `dishes/${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local fallback.
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const localName = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(dir, localName), bytes);
  return NextResponse.json({ url: `/uploads/${localName}` });
}
