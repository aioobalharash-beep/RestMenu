// Contact / social links shown in the menu footer. Set these in the environment
// (Vercel → Settings → Environment Variables), then REDEPLOY — NEXT_PUBLIC_* values
// are baked in at build time, so a rebuild is required for changes to take effect.
// Any left unset render as a non-linking placeholder icon.
//
// NOTE: each variable is referenced statically below so Next.js can inline it.

function firstSet(...vals: (string | undefined)[]): string {
  for (const v of vals) if (v && v.trim()) return normalizeUrl(v.trim());
  return "";
}

/** Ensure an external link has a scheme, so it isn't treated as a relative path. */
function normalizeUrl(v: string): string {
  if (/^https?:\/\//i.test(v) || v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  return `https://${v}`;
}

function waFromPhone(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export const social = {
  /** Google Maps (or any) URL to the location. Primary: NEXT_PUBLIC_MAP_URL. */
  map: firstSet(
    process.env.NEXT_PUBLIC_MAP_URL,
    process.env.NEXT_PUBLIC_LOCATION_URL,
    process.env.NEXT_PUBLIC_LOCATION,
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
  ),

  /** Instagram profile URL. Primary: NEXT_PUBLIC_INSTAGRAM_URL. */
  instagram: firstSet(
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM,
  ),

  /** WhatsApp. A full URL, or a phone number we turn into a wa.me link. */
  whatsapp: firstSet(
    process.env.NEXT_PUBLIC_WHATSAPP_URL,
    process.env.NEXT_PUBLIC_WHATSAPP,
    waFromPhone(process.env.NEXT_PUBLIC_WHATSAPP_PHONE),
    waFromPhone(process.env.NEXT_PUBLIC_PHONE),
  ),
};
