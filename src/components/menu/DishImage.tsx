"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

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
 * The focused dish: a light pool behind, a contact shadow beneath, a gentle idle
 * drift, a pointer-driven 3D tilt with a moving highlight, and rising steam for
 * hot items. The tilt only responds to a mouse (not touch), so it never fights
 * the swipe gesture.
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
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 16 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 16 });
  const hlX = useTransform(px, [-0.5, 0.5], ["32%", "68%"]);
  const hlY = useTransform(py, [-0.5, 0.5], ["30%", "70%"]);
  const highlight = useMotionTemplate`radial-gradient(circle at ${hlX} ${hlY}, rgba(255,255,255,0.35), transparent 45%)`;

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
      style={{ perspective: 900 }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reset}
    >
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

      {/* Contact shadow (fixed dark tone so it reads on light and dark themes) */}
      <motion.div
        aria-hidden
        className="absolute bottom-[2%] h-[8%] w-[64%] rounded-[50%] blur-xl"
        style={{ background: "rgba(35,25,12,0.32)" }}
        animate={reduce ? undefined : { scaleX: [1, 0.9, 1], opacity: [0.32, 0.22, 0.32] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Steam for hot items */}
      {hot && !reduce && (
        <div className="pointer-events-none absolute left-1/2 top-[4%] z-10 -translate-x-1/2" aria-hidden>
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
        className="relative aspect-square w-full"
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
        animate={reduce ? { y: 0 } : { y: active ? [0, -12, 0] : 0 }}
        transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
      >
        <DishDisc src={src} alt={alt} />
        {/* Moving specular highlight (mouse only; subtle) */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: highlight, mixBlendMode: "soft-light" }}
          />
        )}
      </motion.div>
    </div>
  );
}
