"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * A dish photographed free on the paper — no plate, no disc. `object-contain`
 * plus a `drop-shadow` traces the food itself (ideal for transparent PNGs, and
 * still reading as a floating print for opaque photos). Used, dimmed and small,
 * for the coverflow neighbours.
 */
export function DishFloat({
  src,
  alt,
  shadow = true,
}: {
  src: string | null;
  alt: string;
  shadow?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = src && !failed;

  if (!showImage) {
    return (
      <div className="grid h-full w-full place-items-center text-ink-faint">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`h-full w-full object-contain ${shadow ? "dish-shadow" : ""}`}
      draggable={false}
    />
  );
}

/**
 * The focused dish: a soft pool of light behind it (the approved "spotlight"),
 * a contact shadow beneath, a gentle idle drift, a mouse-only 3D tilt, and
 * rising steam for hot items. The tilt ignores touch so it never fights swipe.
 */
export default function DishImage({
  src,
  alt,
  active,
  hot = false,
}: {
  src: string | null;
  alt: string;
  active: boolean;
  hot?: boolean;
}) {
  const reduce = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 16 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 16 });

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      className="relative grid h-full w-full place-items-center"
      style={{ perspective: 1000 }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reset}
    >
      {/* Spotlight — the pool of light the dish sits in */}
      <div
        className="pointer-events-none absolute h-[108%] w-[108%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, color-mix(in srgb, var(--color-saffron) 30%, transparent), transparent 64%)",
          opacity: active ? 1 : 0.5,
          transition: "opacity 800ms var(--ease-out-expo)",
        }}
      />

      {/* Contact shadow (fixed dark tone so it reads on light and dark themes) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[3%] h-[7%] w-[58%] rounded-[50%] blur-xl"
        style={{ background: "rgba(20,12,4,0.34)" }}
        animate={reduce ? undefined : { scaleX: [1, 0.92, 1], opacity: [0.34, 0.24, 0.34] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Steam for hot items */}
      {hot && !reduce && (
        <div className="pointer-events-none absolute left-1/2 top-[6%] z-10 -translate-x-1/2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute block rounded-full"
              style={{
                left: `${(i - 1) * 16}px`,
                bottom: 0,
                width: 12,
                height: 42,
                background:
                  "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.6), transparent 70%)",
                filter: "blur(6px)",
                animation: `steamRise 3.6s ${i * 0.8}s infinite ease-out`,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="relative flex aspect-square w-full items-center justify-center"
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
        animate={reduce ? { y: 0 } : { y: active ? [0, -12, 0] : 0 }}
        transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
      >
        <DishFloat src={src} alt={alt} />
      </motion.div>
    </div>
  );
}
