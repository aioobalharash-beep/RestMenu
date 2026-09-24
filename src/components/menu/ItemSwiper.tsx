"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { MenuItem } from "@/lib/types";
import DishImage, { DishFloat } from "./DishImage";
import { useLang } from "./LanguageContext";

const SWIPE_CONFIDENCE = 8000;
const power = (offset: number, velocity: number) => Math.abs(offset) * velocity;

/**
 * A coverflow of free-floating dishes for one category: the focused dish sits
 * sharp in the centre while its neighbours peek in from the sides, dimmed and
 * scaled down, so the spread reads as full. Controlled — the parent owns the
 * active index so the name/description/price stay in lockstep. Supports touch
 * swipe on the centre dish, tapping a side dish, arrows, and keyboard.
 */
export default function ItemSwiper({
  items,
  index,
  onIndexChange,
  active,
  hot = false,
}: {
  items: MenuItem[];
  index: number;
  onIndexChange: (next: number) => void;
  active: boolean;
  hot?: boolean;
}) {
  const reduce = useReducedMotion();
  const { rtl } = useLang();
  const count = items.length;
  const dirFactor = rtl ? -1 : 1;

  const go = (dir: number) => {
    if (count <= 1) return;
    try {
      navigator.vibrate?.(8);
    } catch {
      /* ignore */
    }
    onIndexChange((index + dir + count) % count);
  };

  useEffect(() => {
    if (!active || count <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index, count, rtl]);

  return (
    <div className="relative w-full select-none">
      {count > 1 && (
        <>
          <SwipeArrow side="left" onClick={() => go(rtl ? 1 : -1)} label={rtl ? "Next dish" : "Previous dish"} />
          <SwipeArrow side="right" onClick={() => go(rtl ? -1 : 1)} label={rtl ? "Previous dish" : "Next dish"} />
        </>
      )}

      {/* Coverflow stage — overflow visible so neighbours peek at the edges */}
      <div className="relative mx-auto flex aspect-square w-[min(88vw,54dvh,34rem)] items-center justify-center [overflow:visible]">
        {items.map((item, i) => {
          // Shortest signed distance (wraps around for a full stage).
          let d = i - index;
          if (d > count / 2) d -= count;
          if (d < -count / 2) d += count;
          if (Math.abs(d) > 2) return null;

          const isCenter = d === 0;
          const near = Math.abs(d) <= 1;

          const style: React.CSSProperties = {
            transform: `translate(-50%, -50%) translateX(${d * 62 * dirFactor}%) scale(${isCenter ? 1 : 0.5})`,
            opacity: near ? (isCenter ? 1 : 0.16) : 0,
            zIndex: isCenter ? 20 : 10 - Math.abs(d),
            pointerEvents: near ? "auto" : "none",
            transition: reduce
              ? "none"
              : "transform 600ms var(--ease-out-expo), opacity 450ms ease",
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
                    if (swipe < -SWIPE_CONFIDENCE || info.offset.x < -70) go(rtl ? -1 : 1);
                    else if (swipe > SWIPE_CONFIDENCE || info.offset.x > 70) go(rtl ? 1 : -1);
                  }}
                  whileTap={count > 1 ? { cursor: "grabbing" } : undefined}
                >
                  <DishImage src={item.imageUrl} alt={item.name} active={active} hot={hot} />
                </motion.div>
              ) : (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`Show ${item.name}`}
                  onClick={() => onIndexChange(i)}
                  className="grid h-full w-full place-items-center"
                >
                  {/* Neighbours: faint hints so the centre dish leads */}
                  <div className="aspect-square w-[80%]">
                    <DishFloat src={item.imageUrl} alt="" shadow={false} />
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => onIndexChange(i)}
              aria-label={`Go to ${it.name}`}
              aria-current={i === index}
              className="focus-ring group grid place-items-center py-1"
            >
              <span
                className="block h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === index ? 28 : 10,
                  background:
                    i === index
                      ? "var(--color-saffron)"
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
      className={`focus-ring absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-hairline text-ink-soft transition-all hover:border-ink-soft hover:text-ink md:grid ${
        side === "left" ? "left-0 -translate-x-3" : "right-0 translate-x-3"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
