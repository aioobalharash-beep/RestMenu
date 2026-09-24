"use client";

/*
 * DESIGN MOCKUP — not part of the app. A single "Main Dishes" scene in the
 * proposed "Muscat Gallery" direction (editorial layout + Omani palette +
 * Arabic-led type). Visit /mockup?theme=dark&lang=ar to preview states.
 * This file is deleted once the direction is approved and rolled into the app.
 */
import { useEffect, useState } from "react";
import {
  Instrument_Serif,
  Schibsted_Grotesk,
  Space_Mono,
  Aref_Ruqaa,
  Tajawal,
} from "next/font/google";

const serif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--f-serif" });
const grotesk = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-grotesk" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-mono" });
const arDisplay = Aref_Ruqaa({ subsets: ["arabic"], weight: ["400", "700"], variable: "--f-ar" });
const arBody = Tajawal({ subsets: ["arabic"], weight: ["400", "500"], variable: "--f-arbody" });

const STAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='54' height='54'%3E%3Cg fill='none' stroke='%2327356a' stroke-width='1'%3E%3Crect x='15' y='15' width='24' height='24'/%3E%3Crect x='15' y='15' width='24' height='24' transform='rotate(45 27 27)'/%3E%3C/g%3E%3C/svg%3E";

export default function Mockup() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("theme") === "dark") setTheme("dark");
    if (p.get("lang") === "ar") setLang("ar");
  }, []);

  const rtl = lang === "ar";
  const t = (en: string, ar: string) => (rtl ? ar : en);

  return (
    <div
      data-theme={theme}
      dir={rtl ? "rtl" : "ltr"}
      className={`mk ${serif.variable} ${grotesk.variable} ${mono.variable} ${arDisplay.variable} ${arBody.variable} ${rtl ? "ar" : ""}`}
    >
      <style>{css}</style>

      <div className="scene">
        <div className="pattern" />
        <div className="index-numeral">{rtl ? "٠٢" : "02"}</div>

        {/* running header */}
        <header className="topbar">
          <div className="brand">Maison<span className="dot">·</span><em>{t("the menu", "القائمة")}</em></div>
          <div className="run">{t("Main Dishes", "الأطباق الرئيسية")}</div>
          <div className="paging">{rtl ? "٠٢ / ٠٤" : "02 / 04"}</div>
        </header>

        <div className="stage">
          {/* text block */}
          <div className="copy">
            <div className="rule" />
            <div className="eyebrow">{t("Course 02 — Main Dishes", "الطبق ٠٢ — الأطباق الرئيسية")}</div>

            {rtl ? (
              <>
                <h1 className="name-ar">كبسة اللحم</h1>
                <div className="name-en">Beef Kabsa</div>
              </>
            ) : (
              <>
                <h1 className="name-en-lead">Beef Kabsa</h1>
                <div className="name-ar-sub">كبسة اللحم</div>
              </>
            )}

            <p className="desc">
              {t(
                "Fragrant spiced rice slow-cooked with tender beef, dried lime, and Gulf baharat, finished with fresh coriander.",
                "أرز متبّل مطهو ببطء مع قطع اللحم الطرية، اللومي، وبهارات خليجية، ويُزيّن بالكزبرة الطازجة.",
              )}
            </p>

            <div className="price-row">
              <span className="price">3<span className="frac">.900</span></span>
              <span className="unit">{t("OMR", "ر.ع.")}</span>
            </div>

            <div className="courses">
              {[
                [t("Appetisers", "المقبّلات"), "01"],
                [t("Main Dishes", "الأطباق الرئيسية"), "02"],
                [t("Rice Meals", "أطباق الأرز"), "03"],
                [t("Hot Drinks", "المشروبات الساخنة"), "04"],
              ].map(([label, n], i) => (
                <div key={n} className={`course ${i === 1 ? "on" : ""}`}>
                  <span className="cn">{rtl ? ["٠١", "٠٢", "٠٣", "٠٤"][i] : n}</span>
                  <span className="cl">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* dish block */}
          <div className="dishwrap">
            {/* eslint-disable @next/next/no-img-element */}
            <img className="neighbor left" src="/mockup/kofta.webp" alt="" />
            <img className="neighbor right" src="/mockup/biryani.webp" alt="" />
            <div className="shadow" />
            <img className="dish" src="/mockup/kabsa.webp" alt="Beef Kabsa" />
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </div>

        <div className="scrollcue">
          <span>{t("Next course", "الطبق التالي")}</span>
          <span className="arrow">↓</span>
        </div>
      </div>
    </div>
  );
}

const css = `
.mk {
  --paper:#f2ece1; --paper-2:#e7dfd0; --ink:#1a1916; --ink-soft:#57514a;
  --line:rgba(26,25,22,0.14); --indigo:#27356a; --clay:#a24a34;
  --f-serif-s: var(--f-serif), Georgia, serif;
  --f-g: var(--f-grotesk), system-ui, sans-serif;
  --f-m: var(--f-mono), monospace;
  --f-a: var(--f-ar), serif;
  --f-ab: var(--f-arbody), sans-serif;
}
.mk[data-theme="dark"] {
  --paper:#111119; --paper-2:#191922; --ink:#efe7d8; --ink-soft:#ada493;
  --line:rgba(255,255,255,0.14); --indigo:#8ea1e0; --clay:#cf6d4f;
}
.mk { min-height:100vh; background:var(--paper); color:var(--ink); font-family:var(--f-g); }
.mk.ar { font-family:var(--f-ab); }
.scene { position:relative; min-height:100vh; padding:40px 64px 32px; overflow:hidden; display:flex; flex-direction:column; }
.pattern { position:absolute; inset:0; background-image:url("${STAR}"); background-size:54px 54px; opacity:.05; pointer-events:none; }
.mk[data-theme="dark"] .pattern { opacity:.08; filter:invert(1); }

.index-numeral { position:absolute; top:-4%; inset-inline-start:2%; font-family:var(--f-serif-s); font-size:34vh; line-height:1; color:var(--ink); opacity:.045; pointer-events:none; }

.topbar { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.brand { font-family:var(--f-serif-s); font-size:20px; letter-spacing:.01em; }
.brand .dot { color:var(--clay); margin:0 6px; }
.brand em { color:var(--clay); }
.run { font-family:var(--f-g); font-size:11px; letter-spacing:.34em; text-transform:uppercase; color:var(--ink-soft); }
.mk.ar .run { letter-spacing:normal; font-family:var(--f-ab); }
.paging { font-family:var(--f-m); font-size:13px; color:var(--ink-soft); }

.stage { position:relative; z-index:2; flex:1; display:grid; grid-template-columns:1.05fr 1.2fr; align-items:center; gap:32px; }

.copy { max-width:30rem; }
.rule { width:56px; height:2px; background:var(--clay); margin-bottom:22px; }
.eyebrow { font-family:var(--f-m); font-size:12px; letter-spacing:.12em; color:var(--indigo); text-transform:uppercase; margin-bottom:14px; }
.mk.ar .eyebrow { font-family:var(--f-ab); letter-spacing:normal; }

.name-en-lead { font-family:var(--f-serif-s); font-style:italic; font-weight:400; font-size:76px; line-height:.98; margin:0 0 6px; letter-spacing:-.01em; }
.name-ar-sub { font-family:var(--f-a); font-size:34px; color:var(--ink-soft); line-height:1; }
.name-ar { font-family:var(--f-a); font-size:82px; line-height:1.02; margin:0 0 4px; }
.name-en { font-family:var(--f-serif-s); font-style:italic; font-size:30px; color:var(--ink-soft); }

.desc { font-size:16.5px; line-height:1.7; color:var(--ink-soft); margin:22px 0 26px; max-width:26rem; }
.mk.ar .desc { font-size:17.5px; }

.price-row { display:inline-flex; align-items:baseline; gap:10px; padding-bottom:6px; border-bottom:1px solid var(--line); }
.price { font-family:var(--f-m); font-weight:700; font-size:44px; color:var(--ink); letter-spacing:-.02em; }
.price .frac { font-size:30px; color:var(--ink-soft); }
.unit { font-family:var(--f-m); font-size:13px; letter-spacing:.1em; color:var(--clay); }

.courses { margin-top:48px; display:flex; flex-direction:column; gap:10px; }
.course { display:flex; align-items:center; gap:14px; color:var(--ink-soft); opacity:.55; }
.course .cn { font-family:var(--f-m); font-size:12px; min-width:22px; }
.course .cl { font-family:var(--f-g); font-size:13px; letter-spacing:.16em; text-transform:uppercase; }
.mk.ar .course .cl { font-family:var(--f-ab); letter-spacing:normal; font-size:15px; }
.course.on { opacity:1; color:var(--ink); }
.course.on .cl { color:var(--ink); }
.course.on .cn { color:var(--clay); }

.dishwrap { position:relative; height:70vh; display:grid; place-items:center; }
.dish { width:min(42vw,560px); max-height:66vh; object-fit:contain; filter:drop-shadow(0 38px 42px rgba(20,12,4,.42)); }
.mk[data-theme="dark"] .dish { filter:drop-shadow(0 40px 48px rgba(0,0,0,.6)); }
.shadow { position:absolute; bottom:10%; width:44%; height:5%; border-radius:50%; background:rgba(20,12,4,.28); filter:blur(22px); }
.mk[data-theme="dark"] .shadow { background:rgba(0,0,0,.5); }
.neighbor { position:absolute; width:min(20vw,240px); object-fit:contain; opacity:.28; filter:grayscale(.15) drop-shadow(0 20px 24px rgba(20,12,4,.3)); top:52%; }
.neighbor.left { inset-inline-start:-6%; transform:translateY(-50%) scale(.9); }
.neighbor.right { inset-inline-end:-6%; transform:translateY(-50%) scale(.9); }

.scrollcue { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; gap:12px; color:var(--ink-soft); font-family:var(--f-m); font-size:12px; letter-spacing:.14em; text-transform:uppercase; }
.mk.ar .scrollcue { font-family:var(--f-ab); letter-spacing:normal; }
.scrollcue .arrow { color:var(--clay); }

@media (max-width:820px){
  .scene { padding:28px 22px; }
  .stage { grid-template-columns:1fr; gap:8px; text-align:center; }
  .copy { max-width:none; margin:0 auto; order:2; }
  .rule { margin-inline:auto; }
  .price-row { justify-content:center; }
  .courses { align-items:center; }
  .dishwrap { order:1; height:44vh; }
  .dish { width:74vw; max-height:42vh; }
  .neighbor { display:none; }
  .name-en-lead { font-size:52px; }
  .name-ar { font-size:60px; }
  .index-numeral { font-size:22vh; }
}
`;
