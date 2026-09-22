"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MenuCategory } from "@/lib/types";

/**
 * The bottom-of-scene preview. It shows the NEXT category — its first dish and
 * its title, blurred and depth-faded — so as you reach the end of a course the
 * next one is already visible below, and the scroll transition feels continuous
 * (the "stacked layers" from the sketch). On the last scene it closes out.
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
        <span className="text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint">Fin</span>
        <span className="font-display text-base italic text-ink-soft">Bon appétit</span>
      </div>
    );
  }

  const firstDish = next.items[0]?.imageUrl ?? null;

  return (
    <button
      onClick={onJump}
      className="focus-ring group flex flex-col items-center gap-2.5"
      aria-label={`Next course: ${next.name}`}
    >
      <motion.span
        aria-hidden
        className="text-ink-faint transition-colors group-hover:text-ink-soft"
        animate={reduce ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>

      {/* Blurred preview of the next category */}
      <span className="flex items-center gap-3 opacity-55 blur-[2.5px] transition-all duration-500 group-hover:opacity-85 group-hover:blur-[1.5px]">
        {firstDish && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstDish}
            alt=""
            aria-hidden
            className="h-11 w-11 rounded-full object-cover shadow-soft"
            draggable={false}
          />
        )}
        <span className="text-left">
          <span className="block text-[0.6rem] uppercase tracking-[0.24em] text-ink-faint">
            Next course
          </span>
          <span className="font-display text-2xl leading-tight text-ink-soft">
            {next.name}
          </span>
        </span>
      </span>
    </button>
  );
}
