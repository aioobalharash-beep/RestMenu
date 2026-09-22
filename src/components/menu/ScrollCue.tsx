"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MenuCategory } from "@/lib/types";

/**
 * The bottom-of-scene affordance. When a next category exists it shows a blurred,
 * depth-faded preview of that category's name + first dish (the "stacked layers"
 * feel from the sketch) with a soft scroll cue. On the last scene it closes out.
 */
export default function ScrollCue({
  next,
  onJump,
}: {
  next: MenuCategory | null;
  onJump: () => void;
}) {
  const reduce = useReducedMotion();

  if (!next) {
    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint">
          Fin
        </span>
        <span className="font-display text-sm italic text-ink-soft">
          Bon appétit
        </span>
      </div>
    );
  }

  const firstDish = next.items[0]?.imageUrl ?? null;

  return (
    <button
      onClick={onJump}
      className="focus-ring group flex flex-col items-center gap-3"
      aria-label={`Next: ${next.name}`}
    >
      <span className="text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint transition-colors group-hover:text-ink-soft">
        Next course
      </span>

      {/* Blurred peek of the next category */}
      <span className="flex items-center gap-3 opacity-60 blur-[2px] transition-all duration-500 group-hover:opacity-90 group-hover:blur-[1px]">
        {firstDish && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstDish}
            alt=""
            aria-hidden
            className="h-9 w-9 rounded-full object-cover shadow-soft"
            draggable={false}
          />
        )}
        <span className="font-display text-lg text-ink-soft">{next.name}</span>
      </span>

      <motion.span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-shell/60 text-ink-soft shadow-soft backdrop-blur-md"
        style={{ WebkitBackdropFilter: "blur(10px)" }}
        animate={reduce ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </button>
  );
}
