import { NextResponse } from "next/server";
import { uploadImage, UploadError } from "@/lib/upload";

/**
 * POST /api/admin/upload — multipart form with `file`.
 * Stores the image via the configured provider (S3/R2, Vercel Blob, or local)
 * and returns { url }.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[upload] failed:", err);
    // Surface the real reason to the (authenticated) admin to aid setup debugging.
    const detail =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return NextResponse.json(
      { error: `Upload failed — ${detail}` },
      { status: 500 },
    );
  }
}
