import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { brand } from "@/brand.config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — The Menu`,
  description:
    "A quiet, beautiful menu. Scroll through each course; swipe between dishes.",
};

export const viewport: Viewport = {
  themeColor: "#f6f1e9",
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
  // Per-client accent, injected as CSS variables so the whole palette follows.
  const brandVars = {
    "--color-saffron": brand.accent,
    "--color-saffron-deep": brand.accentDeep,
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
      style={brandVars}
    >
      <body>{children}</body>
    </html>
  );
}
