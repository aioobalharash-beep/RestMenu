"use client";

import { forwardRef, useState } from "react";
import type { MenuCategory } from "@/lib/types";
import ItemSwiper from "./ItemSwiper";
import ItemDetails from "./ItemDetails";
import CourseIndex from "./CourseIndex";
import ScrollCue from "./ScrollCue";
import { useLang } from "./LanguageContext";

const NUM_AR = ["٠١", "٠٢", "٠٣", "٠٤", "٠٥", "٠٦", "٠٧", "٠٨", "٠٩", "١٠"];
const pad = (n: number) => String(n).padStart(2, "0");

/** One full-height editorial spread: a course, its copy, and its floating dishes. */
const CategoryScene = forwardRef<
  HTMLElement,
  {
    category: MenuCategory;
    categories: MenuCategory[];
    next: MenuCategory | null;
    active: boolean;
    sceneIndex: number;
    total: number;
    onJumpNext: () => void;
    onJumpTo: (i: number) => void;
  }
>(function CategoryScene(
  { category, categories, next, active, sceneIndex, total, onJumpNext, onJumpTo },
  ref,
) {
  const { pick, rtl } = useLang();
  const [index, setIndex] = useState(0);
  const items = category.items;
  const item = items[index] ?? items[0];

  const num = rtl ? NUM_AR[sceneIndex] ?? pad(sceneIndex + 1) : pad(sceneIndex + 1);
  const totalNum = rtl ? NUM_AR[total - 1] ?? pad(total) : pad(total);
  const catName = pick(category.name, category.nameAr);

  // Heuristic: show steam for hot categories (drinks/soups), EN or AR.
  const hot = /hot|drink|coffee|tea|latte|soup|قهوة|شاي|ساخن|حساء|لاتيه|مشروب/i.test(
    `${category.name} ${category.nameAr ?? ""}`,
  );

  return (
    <section
      ref={ref}
      data-scene={sceneIndex}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.75rem))] sm:px-12"
      aria-label={catName}
    >
      {/* Giant ghost course numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-3%] z-0 select-none font-display leading-none text-ink opacity-[0.05]"
        style={{ insetInlineStart: "1.5%", fontSize: "34vh" }}
      >
        {num}
      </span>

      {/* Running header: course + paging (brand lives in the fixed logo) */}
      <div className="relative z-10 flex items-center justify-center gap-3 text-center">
        <span
          className={`text-ink-soft ${
            rtl ? "text-[0.9rem]" : "font-mono text-[0.7rem] uppercase tracking-[0.3em]"
          }`}
        >
          {catName}
        </span>
        <span className="text-saffron">·</span>
        <span className="font-mono text-[0.72rem] tabular-nums text-ink-faint">
          {num} / {totalNum}
        </span>
      </div>

      {/* Stage */}
      <div className="relative z-10 grid flex-1 items-center gap-x-8 gap-y-6 md:grid-cols-[1.02fr_1.12fr] lg:gap-x-14">
        {/* Copy */}
        <div className="order-2 md:order-1">
          <div className="mb-5 h-[2px] w-14 bg-saffron" />
          <div
            className={`mb-3.5 ${
              rtl ? "text-[0.95rem]" : "font-mono text-[0.72rem] uppercase tracking-[0.12em]"
            }`}
            style={{ color: "var(--color-indigo)" }}
          >
            {rtl ? `الطبق ${num} — ${catName}` : `Course ${num} — ${catName}`}
          </div>

          {item ? (
            <>
              <ItemDetails item={item} />
              <CourseIndex categories={categories} active={sceneIndex} onJump={onJumpTo} />
            </>
          ) : (
            <p className="font-display text-lg italic text-ink-faint">
              {rtl ? "لا أطباق في هذا الطبق بعد." : "No dishes in this course yet."}
            </p>
          )}
        </div>

        {/* Dish */}
        <div className="order-1 flex items-center justify-center md:order-2">
          {item && (
            <ItemSwiper
              items={items}
              index={Math.min(index, items.length - 1)}
              onIndexChange={setIndex}
              active={active}
              hot={hot}
            />
          )}
        </div>
      </div>

      {/* Scroll affordance / footer */}
      <div className="relative z-10 mt-4 flex shrink-0 items-center justify-center">
        <ScrollCue isLast={!next} onJump={onJumpNext} />
      </div>
    </section>
  );
});

export default CategoryScene;
