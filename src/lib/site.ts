import { brand } from "@/brand.config";

// Footer contact links. Priority: brand.config.ts values, then NEXT_PUBLIC_* env
// overrides (handy for the one-repo / per-Vercel-project model). NEXT_PUBLIC_*
// values are inlined at build time, so a rebuild is required after changing them.

function firstSet(...vals: (string | undefined)[]): string {
  for (const v of vals) if (v && v.trim()) return v.trim();
  return "";
}

/** Ensure an external link has a scheme, so it isn't treated as a relative path. */
function normalizeUrl(v: string): string {
  if (!v) return "";
  if (/^https?:\/\//i.test(v) || v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  return `https://${v}`;
}

/** Turn a phone number (or a wa.me URL) into a WhatsApp link. */
function toWhatsapp(v: string): string {
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  const digits = v.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export const social = {
  map: normalizeUrl(
    firstSet(
      brand.contact.map,
      process.env.NEXT_PUBLIC_MAP_URL,
      process.env.NEXT_PUBLIC_LOCATION_URL,
      process.env.NEXT_PUBLIC_LOCATION,
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
    ),
  ),

  instagram: normalizeUrl(
    firstSet(
      brand.contact.instagram,
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_INSTAGRAM,
    ),
  ),

  whatsapp: toWhatsapp(
    firstSet(
      brand.contact.whatsapp,
      process.env.NEXT_PUBLIC_WHATSAPP_URL,
      process.env.NEXT_PUBLIC_WHATSAPP,
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
      process.env.NEXT_PUBLIC_PHONE,
    ),
  ),
};
