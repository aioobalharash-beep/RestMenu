"use client";

import type { MenuItem } from "@/lib/types";
import { useCart } from "./CartContext";
import { useLang } from "./LanguageContext";

/** Add-to-order control for a dish: an "Add" pill that becomes a −/+ stepper. */
export default function AddControl({ item }: { item: MenuItem }) {
  const { qtyOf, add, inc, dec } = useCart();
  const { rtl } = useLang();
  const qty = qtyOf(item.id);

  function addWithHaptic() {
    try {
      navigator.vibrate?.(12);
    } catch {
      /* ignore */
    }
    add(item);
  }

  if (qty === 0) {
    return (
      <button
        onClick={addWithHaptic}
        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-saffron-deep/40 bg-shell/70 px-5 py-2 text-sm font-medium text-saffron-deep shadow-soft backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-shell"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        {rtl ? "أضف" : "Add"}
      </button>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-3 rounded-full border border-hairline bg-shell/70 px-2 py-1.5 shadow-soft backdrop-blur-md"
      dir="ltr"
    >
      <Step label={rtl ? "إنقاص" : "Decrease"} onClick={() => dec(item.id)} d="M5 12h14" />
      <span className="min-w-6 text-center font-display text-lg text-ink">{qty}</span>
      <Step label={rtl ? "زيادة" : "Increase"} onClick={() => inc(item.id)} d="M12 5v14M5 12h14" />
    </div>
  );
}

function Step({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="focus-ring grid h-8 w-8 place-items-center rounded-full text-saffron-deep transition-colors hover:bg-porcelain"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d={d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    </button>
  );
}
