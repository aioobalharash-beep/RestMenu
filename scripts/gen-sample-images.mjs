/*
 * Generates the placeholder dish images that ship with the template.
 * They are transparent top-down "plated dish" illustrations in the Muscat
 * Gallery palette, so they float correctly in the free-floating menu layout.
 * Real clients replace these by uploading transparent PNG photos in the admin.
 *
 *   node scripts/gen-sample-images.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sample");

// Deterministic PRNG so re-running yields identical files.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Per-dish palettes: [food tones...]. Plate stays limestone.
const DISHES = {
  "item-burrata": ["#f3ede2", "#c0472f", "#7d8f52", "#e8dcc6"],
  "item-scallops": ["#efe6d3", "#d99a4e", "#c8b48f"],
  "item-beetroot": ["#8f2f43", "#c9963f", "#e3d7c2"],
  "item-ribeye": ["#6d3a2a", "#43241b", "#c99a5b"],
  "item-seabass": ["#e9e0d0", "#d9b25a", "#9db08a"],
  "item-risotto": ["#e7dcc4", "#8a6a45", "#cbb98f"],
  "item-biryani": ["#d79a3f", "#6d3a24", "#e6d4a8", "#7d8f52"],
  "item-machboos": ["#c56a34", "#d98f79", "#e6d4a8"],
  "item-cardamom-coffee": ["#3c2216", "#6b4327", "#e9dfce"],
  "item-saffron-latte": ["#ece1cd", "#d9a94e", "#c98f6a"],
  "item-mint-tea": ["#9db08a", "#c7d1a6", "#e7dcc4"],
};

function blob(cx, cy, r, fill, rand) {
  // An organic lump: a few overlapping circles.
  const parts = [];
  const n = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const d = rand() * r * 0.5;
    const rr = r * (0.5 + rand() * 0.5);
    parts.push(
      `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${rr.toFixed(1)}" fill="${fill}"/>`,
    );
  }
  return parts.join("");
}

function svg(name, tones) {
  const rand = rng([...name].reduce((a, c) => a + c.charCodeAt(0), 7));
  const food = [];
  const count = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const d = rand() * 120;
    const cx = 300 + Math.cos(a) * d;
    const cy = 296 + Math.sin(a) * d;
    const r = 34 + rand() * 40;
    const fill = tones[Math.floor(rand() * tones.length)];
    food.push(`<g opacity="${(0.86 + rand() * 0.14).toFixed(2)}">${blob(cx, cy, r, fill, rand)}</g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <radialGradient id="plate" cx="50%" cy="44%" r="58%">
      <stop offset="0%" stop-color="#f8f2e7"/>
      <stop offset="78%" stop-color="#f0e7d6"/>
      <stop offset="100%" stop-color="#e6dcc8"/>
    </radialGradient>
    <radialGradient id="well" cx="50%" cy="46%" r="50%">
      <stop offset="0%" stop-color="#fbf6ec"/>
      <stop offset="100%" stop-color="#f1e8d8"/>
    </radialGradient>
  </defs>
  <!-- transparent background: only the plate is drawn, so it floats -->
  <circle cx="300" cy="300" r="252" fill="url(#plate)"/>
  <circle cx="300" cy="300" r="252" fill="none" stroke="rgba(26,25,22,0.10)" stroke-width="2"/>
  <circle cx="300" cy="298" r="196" fill="url(#well)"/>
  <circle cx="300" cy="298" r="196" fill="none" stroke="rgba(26,25,22,0.06)" stroke-width="2"/>
  <g>${food.join("")}</g>
</svg>`;
}

for (const [name, tones] of Object.entries(DISHES)) {
  writeFileSync(join(OUT, `${name}.svg`), svg(name, tones));
  console.log("wrote", `${name}.svg`);
}
console.log("done");
