"use client";

import { useLang } from "./LanguageContext";

/** Floating controls opposite the logo: language switch + evening (dark) toggle. */
export default function TopControls({
  theme,
  onToggleTheme,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const { lang, toggle } = useLang();
  const btn =
    "focus-ring pointer-events-auto inline-flex items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-ink-soft hover:text-ink";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl justify-end gap-2 px-6 pt-[max(1.1rem,env(safe-area-inset-top))] sm:px-12">
        <button
          onClick={onToggleTheme}
          className={`${btn} h-[36px] w-[36px]`}
          aria-label={theme === "dark" ? "Switch to light" : "Switch to evening"}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button
          onClick={toggle}
          className={`${btn} h-[36px] gap-1.5 px-3.5 font-mono text-[0.72rem]`}
          aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
        >
          <span className={lang === "en" ? "text-ink" : ""}>EN</span>
          <span className="text-ink-faint">/</span>
          <span className={`font-display text-base leading-none ${lang === "ar" ? "text-ink" : ""}`}>ع</span>
        </button>
      </div>
    </div>
  );
}
