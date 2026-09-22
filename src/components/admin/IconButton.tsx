"use client";

const PATHS: Record<string, string> = {
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  edit: "M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3z M13.5 6.5l3 3",
  trash: "M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13",
};

/** Small square icon button used throughout the admin. */
export default function IconButton({
  label,
  icon,
  onClick,
  disabled,
  danger,
  small,
}: {
  label: string;
  icon: keyof typeof PATHS | string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  small?: boolean;
}) {
  const size = small ? "h-6 w-6" : "h-9 w-9";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`focus-ring grid ${size} place-items-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        danger
          ? "text-ink-faint hover:bg-clay/10 hover:text-clay"
          : "text-ink-faint hover:bg-porcelain-deep hover:text-ink"
      }`}
    >
      <svg width={small ? 14 : 18} height={small ? 14 : 18} viewBox="0 0 24 24" fill="none">
        <path
          d={PATHS[icon] ?? ""}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
