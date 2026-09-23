"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Menu } from "@/lib/types";
import BackgroundField from "./BackgroundField";
import FloatingLogo from "./FloatingLogo";
import CategoryScene from "./CategoryScene";
import ProgressRail from "./ProgressRail";
import LanguageToggle from "./LanguageToggle";
import { LanguageProvider, useLang } from "./LanguageContext";

/** Public entry: provides language context around the scrolling menu. */
export default function MenuExperience({ menu }: { menu: Menu }) {
  return (
    <LanguageProvider>
      <MenuShell menu={menu} />
    </LanguageProvider>
  );
}

/**
 * The scrolling menu. A single scroll container holds one full-height scene per
 * category; an IntersectionObserver tracks the active scene for the progress
 * rail, and scroll position feeds a shared --sy variable for background parallax.
 * Direction (LTR/RTL) follows the selected language.
 */
function MenuShell({ menu }: { menu: Menu }) {
  const { rtl } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const ratios = useRef<number[]>(menu.map(() => 0));
  const [active, setActive] = useState(0);

  const jumpTo = useCallback((i: number) => {
    sceneRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Track which scene is most visible.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.scene);
          if (!Number.isNaN(idx)) ratios.current[idx] = entry.intersectionRatio;
        }
        let best = 0;
        let bestRatio = -1;
        ratios.current.forEach((r, i) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setActive(best);
      },
      { root, threshold: [0.25, 0.5, 0.75, 0.9] },
    );
    sceneRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [menu.length]);

  // Feed scroll position into --sy for parallax (rAF-throttled).
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--sy", String(root.scrollTop));
        frame = 0;
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`relative h-[100dvh] overflow-hidden text-ink paper-grain ${rtl ? "lang-ar" : ""}`}
    >
      <BackgroundField />
      <FloatingLogo />
      <LanguageToggle />
      <ProgressRail categories={menu} active={active} onJump={jumpTo} rtl={rtl} />

      <div
        ref={scrollRef}
        className="hide-scrollbar relative z-10 h-[100dvh] overflow-y-auto overflow-x-hidden [scroll-behavior:smooth]"
      >
        {menu.map((category, i) => (
          <CategoryScene
            key={category.id}
            ref={(el) => { sceneRefs.current[i] = el; }}
            sceneIndex={i}
            category={category}
            next={i < menu.length - 1 ? menu[i + 1] : null}
            active={active === i}
            onJumpNext={() => jumpTo(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
