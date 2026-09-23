"use client";

import { useLang } from "./LanguageContext";

/** Floating EN ⇄ ع switch, mirrored opposite the logo. */
export default function LanguageToggle() {
  const { lang, toggle } = useLang();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl justify-end px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
        <button
          onClick={toggle}
          className="focus-ring pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-hairline-soft bg-shell/55 px-3.5 py-2 text-sm font-medium text-ink-soft shadow-soft backdrop-blur-xl transition-colors hover:bg-shell/75 hover:text-ink"
          style={{ WebkitBackdropFilter: "blur(16px)" }}
          aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
        >
          <span className={lang === "en" ? "text-ink" : ""}>EN</span>
          <span className="text-ink-faint">/</span>
          <span className={`font-display ${lang === "ar" ? "text-ink" : ""}`}>ع</span>
        </button>
      </div>
    </div>
  );
}
