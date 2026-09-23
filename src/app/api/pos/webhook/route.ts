import { NextResponse } from "next/server";
import { getPosAdapter } from "@/lib/pos";

// POST /api/pos/webhook — inbound updates from the connected POS.
// Delegates to the active adapter; no-op (200) when no POS is configured.
export async function POST(req: Request) {
  const adapter = getPosAdapter();
  if (adapter.handleWebhook) {
    return adapter.handleWebhook(req);
  }
  return NextResponse.json({ ok: true, pos: adapter.name });
}
