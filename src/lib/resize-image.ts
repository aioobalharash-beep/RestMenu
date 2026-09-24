/**
 * Downscale + re-encode an image in the browser before upload, so it stays well
 * under serverless request-body limits and loads fast on the menu. Transparency
 * is preserved (exports WebP). SVG/GIF and tiny files pass through untouched.
 */
export async function resizeImage(
  file: File,
  maxDim = 1600,
  quality = 0.85,
): Promise<File> {
  const passthrough =
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif";
  if (passthrough) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    // If anything goes wrong, fall back to the original file.
    return file;
  }
}
