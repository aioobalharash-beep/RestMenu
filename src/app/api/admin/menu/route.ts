import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

// GET /api/admin/menu — current menu, used by the dashboard to resync.
export async function GET() {
  const menu = await getStore().getMenu();
  return NextResponse.json({ menu });
}
