"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MenuItem } from "@/lib/types";

export type CartLine = {
  id: string;
  name: string;
  nameAr: string | null;
  priceBaisa: number;
  imageUrl: string | null;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  totalBaisa: number;
  table: string | null;
  qtyOf: (id: string) => number;
  add: (item: MenuItem) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  placeOrder: (note: string) => Promise<boolean>;
  submitting: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "rm_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [table, setTable] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Table from the QR link (?table=12) + restore any saved cart.
  useEffect(() => {
    try {
      const t = new URLSearchParams(window.location.search).get("table");
      if (t) setTable(t.trim().slice(0, 40));
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === item.id);
      if (found) return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          nameAr: item.nameAr,
          priceBaisa: item.priceBaisa,
          imageUrl: item.imageUrl,
          qty: 1,
        },
      ];
    });
  }, []);

  const inc = useCallback((id: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const placeOrder = useCallback(
    async (note: string) => {
      if (lines.length === 0) return false;
      setSubmitting(true);
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table,
            note,
            lines: lines.map((l) => ({ itemId: l.id, quantity: l.qty })),
          }),
        });
        if (!res.ok) return false;
        clear();
        return true;
      } catch {
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [lines, table, clear],
  );

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const totalBaisa = lines.reduce((s, l) => s + l.priceBaisa * l.qty, 0);
    return {
      lines,
      count,
      totalBaisa,
      table,
      qtyOf: (id) => lines.find((l) => l.id === id)?.qty ?? 0,
      add,
      inc,
      dec,
      remove,
      clear,
      placeOrder,
      submitting,
    };
  }, [lines, table, add, inc, dec, remove, clear, placeOrder, submitting]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
