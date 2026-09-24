"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { splitOmr } from "@/lib/money";
import { useLang } from "./LanguageContext";

/** The large, confident price. Counts up when the dish changes. */
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
    <div className="inline-flex items-baseline gap-1.5" dir="ltr">
      <span className="font-display text-5xl leading-none text-ink sm:text-6xl">
        {whole}
        <span className="text-ink-faint">.</span>
        <span className="text-3xl text-ink-soft sm:text-4xl">{fraction}</span>
      </span>
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-saffron-deep">
        {unit}
      </span>
    </div>
  );
}
