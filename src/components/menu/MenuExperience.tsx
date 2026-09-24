"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Menu } from "@/lib/types";
import BackgroundField from "./BackgroundField";
import FloatingLogo from "./FloatingLogo";
import CategoryScene from "./CategoryScene";
import TopControls from "./TopControls";
import IntroOverlay from "./IntroOverlay";
import CartWidget from "./CartWidget";
import { LanguageProvider, useLang } from "./LanguageContext";
import { CartProvider } from "./CartContext";
import { brand } from "@/brand.config";

// Each course gets its own ambient hue, cross-faded as you scroll — kept faint
// so the spotlight behind each dish stays the star. Warm tones only.
const HUES = [
  "var(--color-saffron)",
  "#a9772f",
  "var(--color-sage)",
  "#9c5a44",
  "#7a6a5c",
];

/** Public entry: provides language (and, when enabled, cart) context. */
export default function MenuExperience({ menu }: { menu: Menu }) {
  const shell = <MenuShell menu={menu} />;
  return (
    <LanguageProvider>
      {brand.features.ordering ? <CartProvider>{shell}</CartProvider> : shell}
    </LanguageProvider>
  );
}

function MenuShell({ menu }: { menu: Menu }) {
  const { rtl } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const ratios = useRef<number[]>(menu.map(() => 0));
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Restore / detect theme.
  useEffect(() => {
    try {
      const s = localStorage.getItem("rm_theme");
      if (s === "light" || s === "dark") {
        setTheme(s);
        return;
      }
    } catch {
      /* ignore */
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((p) => {
      const n = p === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("rm_theme", n);
      } catch {
        /* ignore */
      }
      return n;
    });
  }, []);

  const jumpTo = useCallback((i: number) => {
    sceneRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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

  const hue = HUES[active % HUES.length];

  return (
    <div
      data-theme={theme}
      dir={rtl ? "rtl" : "ltr"}
      className={`relative h-[100dvh] overflow-hidden text-ink paper-grain ${rtl ? "lang-ar" : ""}`}
      style={{ backgroundColor: "var(--color-porcelain)" }}
    >
      <BackgroundField />

      {/* Per-course ambiance tint, cross-faded on scroll */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={hue}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: theme === "dark" ? 0.34 : 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(120% 80% at 50% 12%, color-mix(in srgb, ${hue} 55%, transparent), transparent 60%)`,
            }}
          />
        </AnimatePresence>
      </div>

      <IntroOverlay />
      <FloatingLogo />
      <TopControls theme={theme} onToggleTheme={toggleTheme} />
      {brand.features.ordering && <CartWidget />}

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
            categories={menu}
            next={i < menu.length - 1 ? menu[i + 1] : null}
            active={active === i}
            onJumpNext={() => jumpTo(i + 1)}
            onJumpTo={jumpTo}
          />
        ))}
      </div>
    </div>
  );
}
