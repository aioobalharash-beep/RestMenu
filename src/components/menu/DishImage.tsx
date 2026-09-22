"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The circular "plated" disc itself — image on a ring with a soft sheen. Static
 * and presentational, so it can be reused for the focused dish and for the
 * blurred neighbours in the coverflow.
 */
export function DishDisc({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = src && !failed;

  return (
    <figure
      className="relative aspect-square w-full overflow-hidden rounded-full"
      style={{
        boxShadow:
          "0 42px 80px -34px rgba(70,48,20,0.55), inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 0 42px rgba(255,255,255,0.25)",
      }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center text-ink-faint"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, var(--color-cream), var(--color-porcelain-deep))",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      )}
      {/* Soft top sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.28), transparent 34%)",
        }}
      />
    </figure>
  );
}

/**
 * The focused dish: a light pool behind, a blurred contact shadow beneath, and
 * a gentle idle drift. Used for the centre item of the coverflow.
 */
export default function DishImage({
  src,
  alt,
  active,
}: {
  src: string | null;
  alt: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative grid h-full w-full place-items-center">
      {/* Light pool */}
      <div
        className="absolute h-[94%] w-[94%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-saffron) 28%, transparent), transparent 62%)",
          opacity: active ? 0.95 : 0.5,
          transition: "opacity 700ms var(--ease-out-expo)",
        }}
      />

      {/* Contact shadow */}
      <motion.div
        aria-hidden
        className="absolute bottom-[2%] h-[8%] w-[64%] rounded-[50%] bg-ink/25 blur-xl"
        animate={reduce ? undefined : { scaleX: [1, 0.9, 1], opacity: [0.28, 0.2, 0.28] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative aspect-square w-full"
        animate={reduce ? { y: 0 } : { y: active ? [0, -12, 0] : 0 }}
        transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
      >
        <DishDisc src={src} alt={alt} />
      </motion.div>
    </div>
  );
}
