"use client";

import type { MenuCategory } from "@/lib/types";

/** Slim vertical index of categories (desktop). Click a node to jump. */
export default function ProgressRail({
  categories,
  active,
  onJump,
}: {
  categories: MenuCategory[];
  active: number;
  onJump: (i: number) => void;
}) {
  if (categories.length < 2) return null;
  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-label="Menu sections"
    >
      <ul className="flex flex-col items-end gap-4">
        {categories.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.id}>
              <button
                onClick={() => onJump(i)}
                className="focus-ring group flex items-center gap-2.5"
                aria-current={on}
                aria-label={c.name}
              >
                <span
                  className="whitespace-nowrap text-[0.72rem] uppercase tracking-[0.18em] transition-all duration-500"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "translateX(0)" : "translateX(6px)",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  {c.name}
                </span>
                <span
                  className="block rounded-full transition-all duration-500"
                  style={{
                    width: on ? 22 : 8,
                    height: 8,
                    background: on
                      ? "var(--color-saffron-deep)"
                      : "color-mix(in srgb, var(--color-ink) 22%, transparent)",
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
