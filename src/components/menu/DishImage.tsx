"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A single dish presented as a floating "plated" disc: a soft light pool behind,
 * a blurred contact shadow beneath, the image on a circular stage with a thin
 * ring, drifting gently. Works for both photographs and transparent-PNG dishes.
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
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = src && !failed;

  return (
    <div className="relative grid h-full w-full place-items-center">
      {/* Light pool */}
      <div
        className="absolute h-[92%] w-[92%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-saffron) 26%, transparent), transparent 62%)",
          opacity: active ? 0.9 : 0.4,
          transition: "opacity 700ms var(--ease-out-expo)",
        }}
      />

      {/* Contact shadow */}
      <motion.div
        aria-hidden
        className="absolute bottom-[3%] h-[9%] w-[62%] rounded-[50%] bg-ink/25 blur-xl"
        animate={
          reduce
            ? undefined
            : { scaleX: [1, 0.9, 1], opacity: [0.28, 0.2, 0.28] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The plated disc */}
      <motion.figure
        className="relative aspect-square w-full overflow-hidden rounded-full"
        style={{
          boxShadow:
            "0 42px 80px -34px rgba(70,48,20,0.55), inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 0 42px rgba(255,255,255,0.25)",
        }}
        initial={false}
        animate={
          reduce
            ? { y: 0, scale: active ? 1 : 0.94, opacity: active ? 1 : 0.6 }
            : {
                y: active ? [0, -12, 0] : 0,
                scale: active ? 1 : 0.9,
                opacity: active ? 1 : 0.5,
              }
        }
        transition={{
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.7 },
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
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      </motion.figure>
    </div>
  );
}
