"use client";

import { splitOmr } from "@/lib/money";
import { useLang } from "./LanguageContext";

/** The large, confident price. Whole part leads; fraction and unit are quiet. */
export default function PriceTag({ priceBaisa }: { priceBaisa: number }) {
  const { whole, fraction } = splitOmr(priceBaisa);
  const { unit } = useLang();
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
