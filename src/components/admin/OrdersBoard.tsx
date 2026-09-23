"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatOmr } from "@/lib/money";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  served: "Served",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  new: "var(--color-saffron-deep)",
  preparing: "var(--color-clay)",
  served: "var(--color-sage)",
  cancelled: "var(--color-ink-faint)",
};

export default function OrdersBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [showAll, setShowAll] = useState(false);
  const seenIds = useRef(new Set(initialOrders.map((o) => o.id)));
  const [newCount, setNewCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const next: Order[] = data.orders ?? [];
      let fresh = 0;
      for (const o of next) if (!seenIds.current.has(o.id)) fresh++;
      if (fresh > 0) setNewCount((n) => n + fresh);
      seenIds.current = new Set(next.map((o) => o.id));
      setOrders(next);
    } catch {
      /* ignore */
    }
  }, []);

  // Poll for incoming orders.
  useEffect(() => {
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [refresh]);

  async function setStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      refresh();
    }
  }

  const visible = showAll
    ? orders
    : orders.filter((o) => o.status === "new" || o.status === "preparing");

  return (
    <div className="min-h-[100dvh] bg-porcelain text-ink">
      <header className="sticky top-0 z-30 border-b border-hairline bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <a href="/admin" className="focus-ring text-sm font-medium text-ink-soft hover:text-ink">
              ← Menu
            </a>
            <span className="font-display text-lg">Orders</span>
          </div>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-porcelain-deep hover:text-ink"
          >
            {showAll ? "Show active" : "Show all"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-5">
        {newCount > 0 && (
          <button
            onClick={() => setNewCount(0)}
            className="mb-4 w-full rounded-xl border border-saffron-deep/30 bg-shell px-4 py-2 text-sm font-medium text-saffron-deep"
          >
            {newCount} new order{newCount > 1 ? "s" : ""} — tap to acknowledge
          </button>
        )}

        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-faint">
            No {showAll ? "" : "active "}orders.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((o) => (
              <OrderCard key={o.id} order={o} onStatus={setStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function OrderCard({
  order,
  onStatus,
}: {
  order: Order;
  onStatus: (id: string, status: OrderStatus) => void;
}) {
  const time = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dim = order.status === "served" || order.status === "cancelled";

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-hairline bg-cream shadow-soft ${dim ? "opacity-60" : ""}`}
    >
      <header className="flex items-center justify-between border-b border-hairline-soft px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl text-ink">
            {order.table ? `Table ${order.table}` : "Pickup"}
          </span>
          <span className="text-xs text-ink-faint">{time}</span>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-cream"
          style={{ background: STATUS_COLOR[order.status] }}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </header>

      <ul className="divide-y divide-hairline-soft px-4">
        {order.lines.map((l, i) => (
          <li key={i} className="flex items-center justify-between py-2 text-sm">
            <span className="text-ink">
              <span className="font-medium tabular-nums text-saffron-deep">{l.quantity}×</span> {l.name}
            </span>
            <span className="tabular-nums text-ink-faint">{formatOmr(l.priceBaisa * l.quantity)}</span>
          </li>
        ))}
      </ul>

      {order.note && (
        <p className="mx-4 my-2 rounded-lg bg-porcelain-deep px-3 py-2 text-sm text-ink-soft">
          “{order.note}”
        </p>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-hairline-soft px-4 py-3">
        <span className="font-display text-lg text-ink">
          {formatOmr(order.totalBaisa)}
          <span className="ml-1 text-[0.6rem] uppercase tracking-wider text-ink-faint">OMR</span>
        </span>
        <div className="flex gap-2">
          {order.status === "new" && (
            <Action onClick={() => onStatus(order.id, "preparing")}>Start</Action>
          )}
          {order.status === "preparing" && (
            <Action onClick={() => onStatus(order.id, "served")}>Served</Action>
          )}
          {(order.status === "new" || order.status === "preparing") && (
            <Action ghost onClick={() => onStatus(order.id, "cancelled")}>
              Cancel
            </Action>
          )}
          {dim && (
            <Action ghost onClick={() => onStatus(order.id, "new")}>
              Reopen
            </Action>
          )}
        </div>
      </div>
    </section>
  );
}

function Action({
  children,
  onClick,
  ghost,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ghost?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        ghost
          ? "text-ink-soft hover:bg-porcelain-deep hover:text-ink"
          : "bg-ink text-cream hover:-translate-y-0.5"
      }`}
    >
      {children}
    </button>
  );
}
