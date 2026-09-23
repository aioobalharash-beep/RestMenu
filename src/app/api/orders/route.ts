import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getPosAdapter } from "@/lib/pos";
import { brand } from "@/brand.config";
import type { OrderLine } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/orders — a customer places an order (public).
 * Totals and prices are computed server-side from the live menu, so the client
 * can't tamper with them. Requires the ordering feature to be enabled.
 */
export async function POST(req: Request) {
  if (!brand.features.ordering) {
    return NextResponse.json({ error: "Ordering is disabled." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const rawLines = Array.isArray(body?.lines) ? body.lines : [];
  const table =
    typeof body?.table === "string" && body.table.trim() ? body.table.trim().slice(0, 40) : null;
  const note =
    typeof body?.note === "string" && body.note.trim() ? body.note.trim().slice(0, 500) : null;

  const store = getStore();
  const menu = await store.getMenu();
  const byId = new Map(menu.flatMap((c) => c.items).map((i) => [i.id, i]));

  const lines: OrderLine[] = [];
  for (const raw of rawLines) {
    const item = byId.get(raw?.itemId);
    const qty = Math.max(1, Math.min(99, Math.round(Number(raw?.quantity) || 0)));
    if (!item || qty < 1) continue;
    lines.push({
      itemId: item.id,
      name: item.name,
      nameAr: item.nameAr,
      priceBaisa: item.priceBaisa,
      quantity: qty,
    });
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: "No valid items in the order." }, { status: 400 });
  }

  const totalBaisa = lines.reduce((sum, l) => sum + l.priceBaisa * l.quantity, 0);
  const order = await store.createOrder({ table, note, lines, totalBaisa });

  // Hand off to the POS (no-op unless a connector is configured). Never fail the
  // customer's order because of a POS hiccup.
  try {
    await getPosAdapter().pushOrder(order);
  } catch (err) {
    console.error("[pos] pushOrder failed:", err);
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}
