"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { brand } from "@/brand.config";

/** A one-time cinematic brand reveal on first load (per session). */
export default function IntroOverlay() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("rm_intro") === "1";
    } catch {
      /* ignore */
    }
    if (seen || reduce) return;
    setShow(true);
    try {
      sessionStorage.setItem("rm_intro", "1");
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center"
          style={{ background: "var(--color-porcelain)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShow(false)}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3"
            >
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logo} alt={brand.name} className="h-14 w-auto max-w-[220px] object-contain" />
              ) : (
                <span
                  className="grid h-14 w-14 place-items-center rounded-full text-shell"
                  style={{ background: "linear-gradient(140deg, var(--color-saffron), var(--color-saffron-deep))" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M7 3v7a3 3 0 0 0 6 0V3M10 10v11M18 3c-1.6 0-2.5 2-2.5 5.5S16.4 14 18 14v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <span className="font-display text-3xl tracking-tight text-ink">
                {brand.name}
                {brand.tagline && <span className="italic text-saffron-deep"> · {brand.tagline}</span>}
              </span>
            </motion.div>

            <motion.span
              className="block h-px w-24 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, var(--color-saffron-deep), transparent)" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
