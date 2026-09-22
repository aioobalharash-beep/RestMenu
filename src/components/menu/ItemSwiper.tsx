"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { MenuItem } from "@/lib/types";
import DishImage from "./DishImage";

const SWIPE_CONFIDENCE = 8000;

function power(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

/**
 * Horizontal, swipeable stack of dishes for one category. Controlled: the parent
 * owns the active index so the name/description/price stay in lockstep with the
 * visible dish. Supports touch swipe, click arrows, and keyboard when active.
 */
export default function ItemSwiper({
  items,
  index,
  onIndexChange,
  active,
}: {
  items: MenuItem[];
  index: number;
  onIndexChange: (next: number) => void;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const prevIndex = useRef(index);
  const direction = index >= prevIndex.current ? 1 : -1;

  useEffect(() => {
    prevIndex.current = index;
  }, [index]);

  const count = items.length;
  const go = (dir: number) => {
    const next = (index + dir + count) % count;
    onIndexChange(next);
  };

  // Keyboard navigation while this category is the active scene.
  useEffect(() => {
    if (!active || count <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index, count]);

  const item = items[index];
  const slide = reduce ? 0 : 60;

  return (
    <div className="relative w-full select-none">
      {/* Arrows — desktop only, do not intercept touch swipes */}
      {count > 1 && (
        <>
          <SwipeArrow
            side="left"
            onClick={() => go(-1)}
            label="Previous dish"
          />
          <SwipeArrow
            side="right"
            onClick={() => go(1)}
            label="Next dish"
          />
        </>
      )}

      <div className="relative mx-auto grid aspect-square w-[min(72vw,38dvh,23rem)] place-items-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={item.id}
            custom={direction}
            className="absolute inset-0 grid place-items-center"
            drag={count > 1 ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.18}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              const swipe = power(info.offset.x, info.velocity.x);
              if (swipe < -SWIPE_CONFIDENCE || info.offset.x < -80) go(1);
              else if (swipe > SWIPE_CONFIDENCE || info.offset.x > 80) go(-1);
            }}
            initial={{ opacity: 0, x: direction * slide, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -slide, scale: 0.92 }}
            transition={{
              opacity: { duration: 0.45 },
              x: { type: "spring", stiffness: 260, damping: 30 },
              scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{ touchAction: "pan-y", cursor: count > 1 ? "grab" : "default" }}
            whileTap={count > 1 ? { cursor: "grabbing" } : undefined}
          >
            <DishImage src={item.imageUrl} alt={item.name} active={active} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => onIndexChange(i)}
              aria-label={`Go to ${it.name}`}
              aria-current={i === index}
              className="focus-ring group grid place-items-center py-1"
            >
              <span
                className="block h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === index ? 26 : 7,
                  background:
                    i === index
                      ? "var(--color-saffron-deep)"
                      : "color-mix(in srgb, var(--color-ink) 22%, transparent)",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SwipeArrow({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`focus-ring absolute top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-hairline bg-shell/60 text-ink-soft shadow-soft backdrop-blur-md transition-all hover:scale-105 hover:bg-shell hover:text-ink md:grid ${
        side === "left" ? "left-0 -translate-x-2" : "right-0 translate-x-2"
      } h-12 w-12`}
      style={{ WebkitBackdropFilter: "blur(12px)" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
