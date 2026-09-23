"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { formatOmr } from "@/lib/money";
import { useCart } from "./CartContext";
import { useLang } from "./LanguageContext";

/** Floating order button + slide-up cart sheet with a place-order flow. */
export default function CartWidget() {
  const { lines, count, totalBaisa, table, inc, dec, remove, placeOrder, submitting } = useCart();
  const { rtl, unit, pick } = useLang();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const t = (en: string, ar: string) => (rtl ? ar : en);

  async function submit() {
    const ok = await placeOrder(note);
    if (ok) {
      setSent(true);
      setNote("");
    }
  }

  function close() {
    setOpen(false);
    // Reset the confirmation shortly after the sheet closes.
    setTimeout(() => setSent(false), 300);
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setOpen(true)}
            className="focus-ring fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium text-cream shadow-lift end-5"
            style={{ background: "linear-gradient(140deg, var(--color-saffron), var(--color-saffron-deep))" }}
          >
            <span className="grid h-5 w-5 place-items-center" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6h15l-1.5 9h-12z M6 6L5 3H3M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{t("View order", "عرض الطلب")}</span>
            <span className="rounded-full bg-cream/25 px-2 py-0.5 text-xs tabular-nums" dir="ltr">
              {count}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
            dir={rtl ? "rtl" : "ltr"}
          >
            <motion.div
              className={`flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-cream shadow-float sm:rounded-3xl ${rtl ? "lang-ar" : ""}`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              {sent ? (
                <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-full text-cream"
                    style={{ background: "linear-gradient(140deg, var(--color-saffron), var(--color-saffron-deep))" }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2 className="font-display text-2xl text-ink">
                    {t("Order sent", "تم إرسال الطلب")}
                  </h2>
                  <p className="max-w-xs text-sm text-ink-soft">
                    {table
                      ? t(`We'll bring it to table ${table}.`, `سنحضره إلى الطاولة ${table}.`)
                      : t("It's on its way to the kitchen.", "طلبك في طريقه إلى المطبخ.")}
                  </p>
                  <button
                    onClick={close}
                    className="focus-ring mt-3 rounded-xl bg-ink px-6 py-2.5 text-sm font-medium text-cream"
                  >
                    {t("Done", "تم")}
                  </button>
                </div>
              ) : (
                <>
                  <header className="flex items-center justify-between border-b border-hairline-soft px-5 py-4">
                    <h2 className="font-display text-2xl text-ink">
                      {t("Your order", "طلبك")}
                      {table && (
                        <span className="ms-2 align-middle text-sm text-ink-faint">
                          · {t("Table", "طاولة")} {table}
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={close}
                      aria-label={t("Close", "إغلاق")}
                      className="focus-ring grid h-9 w-9 place-items-center rounded-full text-ink-faint hover:bg-porcelain-deep hover:text-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    </button>
                  </header>

                  <div className="flex-1 overflow-y-auto px-5 py-3">
                    {lines.length === 0 ? (
                      <p className="py-10 text-center text-sm text-ink-faint">
                        {t("Your order is empty.", "طلبك فارغ.")}
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {lines.map((l) => (
                          <li key={l.id} className="flex items-center gap-3">
                            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-hairline bg-shell">
                              {l.imageUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-ink">{pick(l.name, l.nameAr)}</p>
                              <p className="text-xs text-ink-faint" dir="ltr">
                                {formatOmr(l.priceBaisa)} {unit}
                              </p>
                            </div>
                            <div className="inline-flex items-center gap-2" dir="ltr">
                              <StepBtn label="−" onClick={() => dec(l.id)} d="M5 12h14" />
                              <span className="min-w-5 text-center text-sm tabular-nums">{l.qty}</span>
                              <StepBtn label="+" onClick={() => inc(l.id)} d="M12 5v14M5 12h14" />
                            </div>
                            <button
                              onClick={() => remove(l.id)}
                              aria-label={t("Remove", "إزالة")}
                              className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:text-clay"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {lines.length > 0 && (
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        placeholder={t("Add a note (optional)…", "أضف ملاحظة (اختياري)…")}
                        className="input mt-4 resize-none"
                      />
                    )}
                  </div>

                  {lines.length > 0 && (
                    <footer className="border-t border-hairline-soft px-5 py-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-ink-soft">{t("Total", "الإجمالي")}</span>
                        <span className="font-display text-xl text-ink" dir="ltr">
                          {formatOmr(totalBaisa)} <span className="text-xs text-saffron-deep">{unit}</span>
                        </span>
                      </div>
                      <button
                        onClick={submit}
                        disabled={submitting}
                        className="focus-ring w-full rounded-xl px-5 py-3 text-sm font-medium text-cream shadow-lift transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                        style={{ background: "linear-gradient(140deg, var(--color-saffron), var(--color-saffron-deep))" }}
                      >
                        {submitting ? t("Sending…", "جارٍ الإرسال…") : t("Place order", "إرسال الطلب")}
                      </button>
                    </footer>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StepBtn({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="focus-ring grid h-7 w-7 place-items-center rounded-full border border-hairline text-ink-soft transition-colors hover:bg-porcelain-deep hover:text-ink"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d={d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    </button>
  );
}
