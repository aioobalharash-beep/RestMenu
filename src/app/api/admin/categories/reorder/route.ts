import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// POST /api/admin/categories/reorder — body: { orderedIds: string[] }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const orderedIds = Array.isArray(body?.orderedIds) ? body.orderedIds : null;
  if (!orderedIds || !orderedIds.every((x: unknown) => typeof x === "string")) {
    return NextResponse.json({ error: "orderedIds must be strings." }, { status: 400 });
  }
  await getStore().reorderCategories(orderedIds);
  return NextResponse.json({ ok: true });
}
