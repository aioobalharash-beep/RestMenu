import BackgroundField from "./BackgroundField";
import FloatingLogo from "./FloatingLogo";

/** Shown when there are no categories yet — points the owner to the admin panel. */
export default function EmptyMenu() {
  return (
    <div className="relative grid h-[100dvh] place-items-center overflow-hidden px-6 text-ink paper-grain">
      <BackgroundField />
      <FloatingLogo />
      <div className="relative z-10 max-w-md text-center">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-saffron-deep">
          The menu
        </span>
        <h1 className="mt-3 font-display text-4xl font-light text-ink sm:text-5xl">
          Nothing plated yet
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-ink-soft">
          The menu is empty. Add your first course and its dishes from the admin
          panel, and they’ll appear here instantly.
        </p>
        <a
          href="/admin"
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-lift transition-transform hover:-translate-y-0.5"
        >
          Open the admin panel
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
