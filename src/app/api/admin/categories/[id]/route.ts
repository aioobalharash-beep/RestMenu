import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/categories/[id] — rename / edit kicker
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: { name?: string; kicker?: string | null } = {};
  if (typeof body?.name === "string") {
    const name = body.name.trim();
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    patch.name = name;
  }
  if ("kicker" in body) {
    patch.kicker =
      typeof body.kicker === "string" && body.kicker.trim()
        ? body.kicker.trim()
        : null;
  }
  try {
    const category = await getStore().updateCategory(id, patch);
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await getStore().deleteCategory(id);
  return NextResponse.json({ ok: true });
}
