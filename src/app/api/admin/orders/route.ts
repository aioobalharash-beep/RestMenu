import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

// GET /api/admin/orders — list recent orders for the admin board.
export async function GET() {
  const orders = await getStore().listOrders();
  return NextResponse.json({ orders });
}
