import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  Schibsted_Grotesk,
  Space_Mono,
  Aref_Ruqaa,
  Tajawal,
} from "next/font/google";
import { brand } from "@/brand.config";
import "./globals.css";

// Editorial serif for dish names + the giant course numerals.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Body / UI grotesk.
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

// Monospace for prices, paging, eyebrows — the "gallery label" voice.
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-face",
  display: "swap",
});

// Arabic pairing: Aref Ruqaa (calligraphic display) + Tajawal (clean body).
const arDisplay = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-ar-display",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — The Menu`,
  description:
    "A quiet, beautiful menu. Scroll through each course; swipe between dishes.",
};

export const viewport: Viewport = {
  themeColor: "#efece7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // White-label accent: only override the palette default when a client sets one.
  const brandVars = (
    brand.accent
      ? { "--color-saffron": brand.accent, "--color-saffron-deep": brand.accentDeep || brand.accent }
      : {}
  ) as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${serif.variable} ${grotesk.variable} ${mono.variable} ${arDisplay.variable} ${tajawal.variable}`}
      style={brandVars}
    >
      <body>{children}</body>
    </html>
  );
}
