"use client";

import { brand } from "@/brand.config";

/**
 * The only fixed chrome on the menu: a small, glassy floating logo, top-left.
 * Content comes from brand.config.ts — either the client's logo image, or the
 * built-in mark + wordmark.
 */
export default function FloatingLogo() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
        <a
          href="/"
          className="pointer-events-auto group inline-flex items-center gap-2.5 rounded-full border border-hairline-soft bg-shell/55 px-4 py-2 shadow-soft backdrop-blur-xl transition-colors hover:bg-shell/75"
          style={{ WebkitBackdropFilter: "blur(16px)" }}
          aria-label={`${brand.name} — home`}
        >
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-7 w-auto max-w-[160px] object-contain"
              draggable={false}
            />
          ) : (
            <>
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-shell"
                style={{
                  background:
                    "linear-gradient(140deg, var(--color-saffron), var(--color-saffron-deep))",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 3v7a3 3 0 0 0 6 0V3M10 10v11M18 3c-1.6 0-2.5 2-2.5 5.5S16.4 14 18 14v7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-[15px] leading-none tracking-tight text-ink">
                {brand.name}
                {brand.tagline && (
                  <>
                    <span className="text-ink-faint"> · </span>
                    <span className="italic text-saffron-deep">{brand.tagline}</span>
                  </>
                )}
              </span>
            </>
          )}
        </a>
      </div>
    </header>
  );
}
