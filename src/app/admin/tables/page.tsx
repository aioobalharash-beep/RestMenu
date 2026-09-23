"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

type Tag = { label: string; url: string; dataUrl: string };

export default function TablesPage() {
  const [count, setCount] = useState(12);
  const [origin, setOrigin] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const labels = useMemo(
    () => Array.from({ length: Math.max(1, Math.min(60, count)) }, (_, i) => String(i + 1)),
    [count],
  );

  useEffect(() => {
    if (!origin) return;
    let cancelled = false;
    (async () => {
      const out: Tag[] = [];
      for (const label of labels) {
        const url = `${origin}/?table=${encodeURIComponent(label)}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 480,
          margin: 1,
          color: { dark: "#23201b", light: "#00000000" },
        });
        out.push({ label, url, dataUrl });
      }
      if (!cancelled) setTags(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [labels, origin]);

  return (
    <div className="min-h-[100dvh] bg-porcelain text-ink">
      <header className="sticky top-0 z-30 border-b border-hairline bg-cream/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <a href="/admin" className="focus-ring text-sm font-medium text-ink-soft hover:text-ink">
              ← Menu
            </a>
            <span className="font-display text-lg">Table QR codes</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-ink-soft" htmlFor="count">
              Tables
            </label>
            <input
              id="count"
              type="number"
              min={1}
              max={60}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className="input w-20 py-1.5"
            />
            <button
              onClick={() => window.print()}
              className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-medium text-cream"
            >
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-5">
        <p className="mb-5 text-sm text-ink-soft print:hidden">
          Each QR opens the menu with that table pre-selected, so orders arrive tagged
          with the table. Print, or download any single code.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {tags.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-hairline bg-cream p-4 shadow-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.dataUrl} alt={`Table ${t.label}`} className="h-32 w-32" />
              <span className="font-display text-lg">Table {t.label}</span>
              <a
                href={t.dataUrl}
                download={`table-${t.label}.png`}
                className="focus-ring text-xs font-medium text-saffron-deep hover:underline print:hidden"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
