"use client";

import type { MenuCategory } from "@/lib/types";
import { useLang } from "./LanguageContext";

const NUM_AR = ["٠١", "٠٢", "٠٣", "٠٤", "٠٥", "٠٦", "٠٧", "٠٨", "٠٩", "١٠"];
const pad = (n: number) => String(n).padStart(2, "0");

/** The course index: a numbered list of categories that doubles as navigation. */
export default function CourseIndex({
  categories,
  active,
  onJump,
}: {
  categories: MenuCategory[];
  active: number;
  onJump: (i: number) => void;
}) {
  const { pick, rtl } = useLang();
  if (categories.length < 2) return null;

  return (
    <nav className="mt-9 flex flex-col gap-2" aria-label="Courses">
      {categories.map((c, i) => {
        const on = i === active;
        return (
          <button
            key={c.id}
            onClick={() => onJump(i)}
            aria-current={on}
            className={`focus-ring group flex items-center gap-3.5 text-start transition-opacity duration-300 ${
              on ? "opacity-100" : "opacity-55 hover:opacity-80"
            }`}
          >
            <span
              className={`font-mono text-[0.7rem] tabular-nums ${on ? "text-saffron" : "text-ink-faint"}`}
              style={{ minWidth: "1.4rem" }}
            >
              {rtl ? NUM_AR[i] ?? pad(i + 1) : pad(i + 1)}
            </span>
            <span
              className={`text-[0.8rem] ${
                rtl
                  ? "text-[0.95rem]"
                  : "uppercase tracking-[0.16em]"
              } ${on ? "text-ink" : "text-ink-soft"}`}
            >
              {pick(c.name, c.nameAr)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
