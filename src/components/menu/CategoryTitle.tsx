"use client";

import { motion, useReducedMotion } from "framer-motion";

/** The floating category header: a large serif title. */
export default function CategoryTitle({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="text-center"
      initial={false}
      animate={{
        opacity: active ? 1 : 0.5,
        y: active || reduce ? 0 : 6,
        filter: active || reduce ? "blur(0px)" : "blur(3px)",
        letterSpacing: active || reduce ? "0em" : "0.04em",
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="font-display text-[clamp(2.4rem,8vw,4.25rem)] font-light leading-[0.95] tracking-tight text-ink">
        {name}
      </h2>
    </motion.div>
  );
}
