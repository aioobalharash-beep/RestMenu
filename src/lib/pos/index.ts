import type { Order } from "@/lib/types";

/**
 * POS integration foundation.
 *
 * The app is POS-agnostic: placed orders are handed to a PosAdapter, and a POS
 * can push updates back via /api/pos/webhook. The default adapter is a no-op, so
 * ordering works with no POS at all. To integrate a specific POS (e.g. Foodics),
 * implement this interface and register it below keyed by POS_PROVIDER — no other
 * part of the app needs to change.
 */
export interface PosAdapter {
  readonly name: string;
  /** Called after an order is placed. Return a POS order id if one is created. */
  pushOrder(order: Order): Promise<{ posOrderId?: string } | void>;
  /** Optional: verify + handle an inbound webhook from the POS. */
  handleWebhook?(req: Request): Promise<Response>;
}

class NoopPosAdapter implements PosAdapter {
  readonly name = "none";
  async pushOrder(): Promise<void> {
    /* no POS configured — orders live in this app only */
  }
}

/**
 * Register concrete connectors here, keyed by the POS_PROVIDER env value.
 * Example:
 *   import { FoodicsAdapter } from "./foodics";
 *   const registry = { foodics: () => new FoodicsAdapter() };
 */
const registry: Record<string, () => PosAdapter> = {
  // foodics: () => new FoodicsAdapter(),
};

let cached: PosAdapter | null = null;

export function getPosAdapter(): PosAdapter {
  if (cached) return cached;
  const provider = (process.env.POS_PROVIDER || "").toLowerCase();
  const factory = registry[provider];
  cached = factory ? factory() : new NoopPosAdapter();
  return cached;
}
