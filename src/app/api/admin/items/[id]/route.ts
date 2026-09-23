import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import type { ItemInput } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/items/[id]
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: Partial<ItemInput> = {};

  if (typeof body?.name === "string") {
    const name = body.name.trim();
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    patch.name = name;
  }
  if ("nameAr" in body) {
    patch.nameAr = typeof body.nameAr === "string" && body.nameAr.trim() ? body.nameAr.trim() : null;
  }
  if (typeof body?.description === "string") patch.description = body.description;
  if ("descriptionAr" in body) {
    patch.descriptionAr = typeof body.descriptionAr === "string" ? body.descriptionAr : null;
  }
  if (Number.isFinite(body?.priceBaisa)) patch.priceBaisa = Math.max(0, Math.round(body.priceBaisa));
  if ("imageUrl" in body) {
    patch.imageUrl = typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl : null;
  }

  try {
    const item = await getStore().updateItem(id, patch);
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
}

// DELETE /api/admin/items/[id]
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await getStore().deleteItem(id);
  return NextResponse.json({ ok: true });
}
