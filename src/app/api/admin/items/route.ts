import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// POST /api/admin/items — create an item in a category
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!categoryId) return NextResponse.json({ error: "categoryId is required." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  try {
    const item = await getStore().createItem(categoryId, {
      name,
      nameAr: typeof body?.nameAr === "string" && body.nameAr.trim() ? body.nameAr.trim() : null,
      description: typeof body?.description === "string" ? body.description : "",
      descriptionAr: typeof body?.descriptionAr === "string" ? body.descriptionAr : null,
      priceBaisa: Number.isFinite(body?.priceBaisa) ? Math.max(0, Math.round(body.priceBaisa)) : 0,
      imageUrl: typeof body?.imageUrl === "string" && body.imageUrl ? body.imageUrl : null,
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }
}
