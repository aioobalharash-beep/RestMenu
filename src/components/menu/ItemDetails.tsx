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
  const { pick } = useLang();
  const dy = reduce ? 0 : 14;

  return (
    <div className="relative mx-auto min-h-[8.5rem] w-full max-w-md text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: dy }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -dy }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="font-display text-2xl italic text-ink sm:text-[1.7rem]">
            {pick(item.name, item.nameAr)}
          </h3>
          {pick(item.description, item.descriptionAr) && (
            <p className="text-pretty mx-auto mt-2.5 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
              {pick(item.description, item.descriptionAr)}
            </p>
          )}
          <div className="mt-5">
            <PriceTag priceBaisa={item.priceBaisa} />
          </div>
          {brand.features.ordering && (
            <div className="mt-4">
              <AddControl item={item} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
