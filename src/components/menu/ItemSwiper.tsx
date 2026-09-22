"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { MenuItem } from "@/lib/types";
import DishImage, { DishDisc } from "./DishImage";

const SWIPE_CONFIDENCE = 8000;
const power = (offset: number, velocity: number) => Math.abs(offset) * velocity;

/**
 * A coverflow of dishes for one category: the focused dish sits sharp in the
 * centre while the previous and next dishes peek in from the sides, blurred and
 * scaled down, so the scene reads as full. Controlled — the parent owns the
 * active index so the name/description/price stay in lockstep. Supports touch
 * swipe on the centre dish, clicking a side dish, arrows, and keyboard.
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
  const count = items.length;

  const go = (dir: number) => {
    if (count <= 1) return;
    onIndexChange((index + dir + count) % count);
  };

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

  return (
    <div className="relative w-full select-none">
      {count > 1 && (
        <>
          <SwipeArrow side="left" onClick={() => go(-1)} label="Previous dish" />
          <SwipeArrow side="right" onClick={() => go(1)} label="Next dish" />
        </>
      )}

      {/* Coverflow stage — overflow visible so neighbours peek at the edges */}
      <div className="relative mx-auto flex aspect-square w-[min(62vw,30dvh,17rem)] items-center justify-center [overflow:visible]">
        {items.map((item, i) => {
          // Shortest signed distance (wraps around for a full stage).
          let d = i - index;
          if (d > count / 2) d -= count;
          if (d < -count / 2) d += count;
          if (Math.abs(d) > 2) return null;

          const isCenter = d === 0;
          const near = Math.abs(d) <= 1;

          const style: React.CSSProperties = {
            transform: `translate(-50%, -50%) translateX(${d * 64}%) scale(${isCenter ? 1 : 0.64})`,
            filter: isCenter ? "none" : "blur(3px)",
            opacity: near ? (isCenter ? 1 : 0.5) : 0,
            zIndex: isCenter ? 20 : 10 - Math.abs(d),
            pointerEvents: near ? "auto" : "none",
            transition: reduce
              ? "none"
              : "transform 600ms var(--ease-out-expo), filter 450ms ease, opacity 450ms ease",
          };

          return (
            <div
              key={item.id}
              className="absolute left-1/2 top-1/2 aspect-square w-full"
              style={style}
            >
              {isCenter ? (
                <motion.div
                  className="h-full w-full"
                  style={{ cursor: count > 1 ? "grab" : "default", touchAction: "pan-y" }}
                  drag={count > 1 ? "x" : false}
                  dragSnapToOrigin
                  dragElastic={0.16}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    const swipe = power(info.offset.x, info.velocity.x);
                    if (swipe < -SWIPE_CONFIDENCE || info.offset.x < -70) go(1);
                    else if (swipe > SWIPE_CONFIDENCE || info.offset.x > 70) go(-1);
                  }}
                  whileTap={count > 1 ? { cursor: "grabbing" } : undefined}
                >
                  <DishImage src={item.imageUrl} alt={item.name} active={active} />
                </motion.div>
              ) : (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`Show ${item.name}`}
                  onClick={() => onIndexChange(i)}
                  className="h-full w-full"
                >
                  <DishDisc src={item.imageUrl} alt="" />
                </button>
              )}
            </div>
          );
        })}
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
      className={`focus-ring absolute top-1/2 z-30 hidden -translate-y-1/2 place-items-center rounded-full border border-hairline bg-shell/60 text-ink-soft shadow-soft backdrop-blur-md transition-all hover:scale-105 hover:bg-shell hover:text-ink md:grid ${
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
