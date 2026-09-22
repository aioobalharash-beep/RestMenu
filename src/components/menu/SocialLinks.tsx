"use client";

import { social } from "@/lib/site";

/** Footer contact buttons at the end of the menu: location, Instagram, WhatsApp. */
export default function SocialLinks() {
  return (
    <nav aria-label="Contact" className="flex items-center gap-3">
      <IconLink href={social.map} label="Find us on the map">
        {/* Location pin */}
        <path
          d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </IconLink>

      <IconLink href={social.instagram} label="Instagram">
        {/* Instagram */}
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="7" r="1.1" fill="currentColor" />
      </IconLink>

      <IconLink href={social.whatsapp} label="WhatsApp">
        {/* WhatsApp */}
        <path
          d="M4 20l1.2-3.9A7.5 7.5 0 1 1 8 19l-4 1z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 9c-.2 0-.5.1-.7.4-.2.3-.7.8-.7 1.8s.8 2.1 1 2.3c.1.2 1.5 2.3 3.6 3.1 1.8.7 2.1.6 2.5.5.4 0 1.2-.5 1.3-.9.2-.5.2-.9.1-1-.1-.1-.2-.1-.5-.3-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.6.8-.1.1-.2.2-.4.1-.3-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.3.2-.4 0-.2 0-.3 0-.4 0-.1-.5-1.2-.6-1.7-.2-.4-.3-.4-.5-.4h-.4z"
          fill="currentColor"
          stroke="none"
        />
      </IconLink>
    </nav>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const active = Boolean(href);
  const className =
    "focus-ring grid h-11 w-11 place-items-center rounded-full border border-hairline bg-shell/60 text-ink-soft shadow-soft backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-shell hover:text-ink";

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      {children}
    </svg>
  );

  if (!active) {
    // Unconfigured link — same look, but not yet interactive.
    return (
      <span className={className} aria-label={`${label} (not set)`} title={`${label} — set its link`}>
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={className}
      style={{ WebkitBackdropFilter: "blur(12px)" }}
    >
      {icon}
    </a>
  );
}
