"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { brand } from "@/brand.config";

// Runs before the browser paints on the client (so a repeat visitor never sees
// a flash of the overlay), and falls back to useEffect during SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A one-time cinematic brand reveal on first load (per session). It starts
 * visible so it covers the very first paint — no flash of the menu underneath —
 * then decides synchronously whether to keep it (first visit) or drop it before
 * paint (already seen, or reduced motion).
 */
export default function IntroOverlay() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useIsoLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("rm_intro") === "1";
    } catch {
      /* ignore */
    }
    if (seen || reduce) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem("rm_intro", "1");
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center px-6 text-center"
          style={{ background: "var(--color-porcelain)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShow(false)}
        >
          <div className="flex max-w-[86vw] flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3"
            >
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logo} alt={brand.name} className="h-14 w-auto max-w-[220px] object-contain sm:h-16" />
              ) : (
                <span className="text-balance font-display text-[clamp(1.9rem,8vw,2.8rem)] leading-tight tracking-tight text-ink">
                  {brand.name}
                  {brand.tagline && <span className="italic text-saffron"> · {brand.tagline}</span>}
                </span>
              )}
            </motion.div>

            <motion.span
              className="block h-[2px] w-14 origin-center bg-saffron"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
