import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// POST /api/admin/items/reorder — body: { categoryId, orderedIds: string[] }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : "";
  const orderedIds = Array.isArray(body?.orderedIds) ? body.orderedIds : null;
  if (!categoryId) return NextResponse.json({ error: "categoryId is required." }, { status: 400 });
  if (!orderedIds || !orderedIds.every((x: unknown) => typeof x === "string")) {
    return NextResponse.json({ error: "orderedIds must be strings." }, { status: 400 });
  }
  await getStore().reorderItems(categoryId, orderedIds);
  return NextResponse.json({ ok: true });
}
