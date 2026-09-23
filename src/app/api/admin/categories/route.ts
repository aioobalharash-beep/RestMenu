import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// POST /api/admin/categories — create a category
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  const kicker =
    typeof body?.kicker === "string" && body.kicker.trim()
      ? body.kicker.trim()
      : null;
  const nameAr =
    typeof body?.nameAr === "string" && body.nameAr.trim() ? body.nameAr.trim() : null;
  const category = await getStore().createCategory({ name, nameAr, kicker });
  return NextResponse.json({ category });
}
