"use client";

import { forwardRef, useState } from "react";
import type { MenuCategory } from "@/lib/types";
import CategoryTitle from "./CategoryTitle";
import ItemSwiper from "./ItemSwiper";
import ItemDetails from "./ItemDetails";
import ScrollCue from "./ScrollCue";

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
  const [index, setIndex] = useState(0);
  const items = category.items;
  const item = items[index] ?? items[0];

  return (
    <section
      ref={ref}
      data-scene={sceneIndex}
      className="flex min-h-[100dvh] snap-start snap-always flex-col items-center px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-24 sm:pt-28"
      aria-label={category.name}
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 sm:gap-7">
        <CategoryTitle name={category.name} kicker={category.kicker} active={active} />

        {item ? (
          <>
            <ItemSwiper
              items={items}
              index={Math.min(index, items.length - 1)}
              onIndexChange={setIndex}
              active={active}
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
        <ScrollCue next={next} onJump={onJumpNext} />
      </div>
    </section>
  );
});

export default CategoryScene;
