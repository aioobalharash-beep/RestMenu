"use client";

import { motion, useReducedMotion } from "framer-motion";

/** The floating category header: a small kicker over a large serif title. */
export default function CategoryTitle({
  name,
  kicker,
  active,
}: {
  name: string;
  kicker: string | null;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="text-center"
      initial={false}
      animate={{
        opacity: active ? 1 : 0.35,
        y: active || reduce ? 0 : 8,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {kicker && (
        <span className="mb-2 inline-block text-[0.7rem] font-medium uppercase tracking-[0.32em] text-saffron-deep">
          {kicker}
        </span>
      )}
      <h2 className="font-display text-[clamp(2.4rem,8vw,4.25rem)] font-light leading-[0.95] tracking-tight text-ink">
        {name}
      </h2>
    </motion.div>
  );
}
