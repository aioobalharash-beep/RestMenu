"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { splitOmr } from "@/lib/money";
import { useLang } from "./LanguageContext";

/** The price as a gallery label: monospace, understated, clay unit. Counts up. */
export default function PriceTag({ priceBaisa }: { priceBaisa: number }) {
  const { unit } = useLang();
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(priceBaisa);
  const prev = useRef(priceBaisa);

  useEffect(() => {
    if (reduce) {
      setDisplay(priceBaisa);
      prev.current = priceBaisa;
      return;
    }
    const controls = animate(prev.current, priceBaisa, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = priceBaisa;
    return () => controls.stop();
  }, [priceBaisa, reduce]);

  const { whole, fraction } = splitOmr(Math.round(display));
  return (
    <div
      className="inline-flex items-baseline gap-2.5 border-b border-hairline pb-1.5"
      dir="ltr"
    >
      <span className="font-mono text-4xl font-bold leading-none tracking-tight text-ink sm:text-5xl">
        {whole}
        <span className="text-ink-faint">.</span>
        <span className="text-2xl text-ink-soft sm:text-3xl">{fraction}</span>
      </span>
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-saffron">
        {unit}
      </span>
    </div>
  );
}
