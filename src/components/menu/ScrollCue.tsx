"use client";

import { motion, useReducedMotion } from "framer-motion";
import SocialLinks from "./SocialLinks";
import { useLang } from "./LanguageContext";

/**
 * A quiet scroll affordance at the bottom of a scene. Scrolling is continuous,
 * so the next course flows up into view on its own. The last scene ends with
 * the contact footer instead.
 */
export default function ScrollCue({
  isLast,
  onJump,
}: {
  isLast: boolean;
  onJump: () => void;
}) {
  const reduce = useReducedMotion();
  const { rtl } = useLang();

  if (isLast) {
    return <SocialLinks />;
  }

  return (
    <button
      onClick={onJump}
      aria-label={rtl ? "الطبق التالي" : "Next course"}
      className="focus-ring group inline-flex items-center gap-2.5 text-ink-faint transition-colors hover:text-ink-soft"
    >
      <span
        className={`${rtl ? "text-[0.85rem]" : "font-mono text-[0.68rem] uppercase tracking-[0.2em]"}`}
      >
        {rtl ? "الطبق التالي" : "Next course"}
      </span>
      <motion.span
        aria-hidden
        className="text-saffron"
        animate={reduce ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
      >
        ↓
      </motion.span>
    </button>
  );
}
