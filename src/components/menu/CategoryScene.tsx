"use client";

import { forwardRef, useState } from "react";
import type { MenuCategory } from "@/lib/types";
import CategoryTitle from "./CategoryTitle";
import ItemSwiper from "./ItemSwiper";
import ItemDetails from "./ItemDetails";
import ScrollCue from "./ScrollCue";
import { useLang } from "./LanguageContext";

/** One full-height "scene": a category, its swipeable dishes, and details. */
const CategoryScene = forwardRef<
  HTMLElement,
  {
    category: MenuCategory;
    next: MenuCategory | null;
    active: boolean;
    sceneIndex: number;
    onJumpNext: () => void;
  }
>(function CategoryScene({ category, next, active, sceneIndex, onJumpNext }, ref) {
  const { pick } = useLang();
  const [index, setIndex] = useState(0);
  const items = category.items;
  const item = items[index] ?? items[0];

  // Heuristic: show steam for hot categories (drinks/soups), EN or AR.
  const hot = /hot|drink|coffee|tea|latte|soup|قهوة|شاي|ساخن|حساء|لاتيه|مشروب/i.test(
    `${category.name} ${category.nameAr ?? ""}`,
  );

  return (
    <section
      ref={ref}
      data-scene={sceneIndex}
      className="flex min-h-[84svh] flex-col items-center px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-20 sm:min-h-[88svh] sm:pt-24"
      aria-label={category.name}
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 sm:gap-7">
        <CategoryTitle name={pick(category.name, category.nameAr)} active={active} />

        {item ? (
          <>
            <ItemSwiper
              items={items}
              index={Math.min(index, items.length - 1)}
              onIndexChange={setIndex}
              active={active}
              hot={hot}
            />
            <ItemDetails item={item} />
          </>
        ) : (
          <p className="font-display text-lg italic text-ink-faint">
            No dishes in this course yet.
          </p>
        )}
      </div>

      <div className="mt-3 flex shrink-0 justify-center pt-1">
        <ScrollCue isLast={!next} onJump={onJumpNext} />
      </div>
    </section>
  );
});

export default CategoryScene;
