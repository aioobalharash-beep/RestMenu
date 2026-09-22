// Contact / social links shown in the menu footer. Set these in the environment
// (Vercel → Settings → Environment Variables) — they're safe to expose (NEXT_PUBLIC_).
// Any left unset simply renders as a non-linking placeholder icon.

function waFromPhone(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export const social = {
  /** A Google Maps (or any) URL to the restaurant's location. */
  map: process.env.NEXT_PUBLIC_MAP_URL || "",
  /** Instagram profile URL, e.g. https://instagram.com/yourhandle */
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  /** A full wa.me URL, or set NEXT_PUBLIC_WHATSAPP_PHONE and we build it. */
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_URL ||
    waFromPhone(process.env.NEXT_PUBLIC_WHATSAPP_PHONE),
};
