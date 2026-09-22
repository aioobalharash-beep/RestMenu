"use client";

import { motion, useReducedMotion } from "framer-motion";
import SocialLinks from "./SocialLinks";

/**
 * A quiet scroll affordance at the bottom of a scene. Scrolling is continuous,
 * so the real next category flows up into view on its own — no placeholder name.
 * The last scene ends with the contact footer.
 */
export default function ScrollCue({
  isLast,
  onJump,
}: {
  isLast: boolean;
  onJump: () => void;
}) {
  const reduce = useReducedMotion();

  if (isLast) {
    return <SocialLinks />;
  }

  return (
    <motion.button
      onClick={onJump}
      aria-label="Next course"
      className="focus-ring grid h-10 w-10 place-items-center rounded-full text-ink-faint transition-colors hover:text-ink-soft"
      animate={reduce ? undefined : { y: [0, 6, 0] }}
      transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}
