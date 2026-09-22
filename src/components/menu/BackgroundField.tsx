"use client";

/**
 * The atmosphere behind the whole menu: a warm porcelain gradient, a few large,
 * soft, out-of-focus colour pools that drift on scroll (cheap parallax depth,
 * no 3D assets required), and a faint paper grain. Purely decorative.
 */
export default function BackgroundField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, var(--color-cream) 0%, var(--color-porcelain) 46%, var(--color-porcelain-deep) 100%)",
        }}
      />

      {/* Drifting colour pools — translate with the shared --sy scroll variable */}
      <div
        className="absolute -left-[12vw] top-[6vh] h-[52vh] w-[52vh] rounded-full opacity-70 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, color-mix(in srgb, var(--color-saffron) 42%, transparent), transparent 68%)",
          transform: "translateY(calc(var(--sy, 0) * -0.06px))",
        }}
      />
      <div
        className="absolute right-[-10vw] top-[38vh] h-[46vh] w-[46vh] rounded-full opacity-60 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-clay) 38%, transparent), transparent 66%)",
          transform: "translateY(calc(var(--sy, 0) * 0.05px))",
        }}
      />
      <div
        className="absolute left-[30vw] top-[78vh] h-[40vh] w-[40vh] rounded-full opacity-50 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-sage) 40%, transparent), transparent 68%)",
          transform: "translateY(calc(var(--sy, 0) * -0.04px))",
        }}
      />

      {/* Top and bottom vignettes to seat the floating content */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-cream) 80%, transparent), transparent)",
        }}
      />

      {/* Paper grain */}
      <div className="paper-grain" />
    </div>
  );
}
