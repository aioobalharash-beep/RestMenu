import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["new", "preparing", "served", "cancelled"];

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/orders/[id] — update an order's status.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status as OrderStatus;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  try {
    const order = await getStore().updateOrderStatus(id, status);
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
