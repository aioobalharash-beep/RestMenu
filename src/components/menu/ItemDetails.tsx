"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { MenuItem } from "@/lib/types";
import { brand } from "@/brand.config";
import PriceTag from "./PriceTag";
import AddControl from "./AddControl";
import { useLang } from "./LanguageContext";

/** Name, description, and price for the active dish. Crossfades on swipe. */
export default function ItemDetails({ item }: { item: MenuItem }) {
  const reduce = useReducedMotion();
  const { pick, rtl } = useLang();
  const dy = reduce ? 0 : 12;
  const desc = pick(item.description, item.descriptionAr);

  return (
    <div className="relative min-h-[13rem] w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: dy }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -dy }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className={`font-display leading-[0.98] text-ink ${
              rtl
                ? "text-[clamp(3rem,7vw,5.2rem)]"
                : "italic text-[clamp(2.6rem,6vw,4.9rem)] tracking-[-0.01em]"
            }`}
          >
            {pick(item.name, item.nameAr)}
          </h1>

          {desc && (
            <p className="text-pretty mt-5 max-w-md text-[1rem] leading-relaxed text-ink-soft">
              {desc}
            </p>
          )}

          <div className="mt-7">
            <PriceTag priceBaisa={item.priceBaisa} />
          </div>

          {brand.features.ordering && (
            <div className="mt-6">
              <AddControl item={item} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
