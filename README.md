# RestMenu

A high-end, single-scroll restaurant menu web app. Each course is a full-screen
"scene": a floating category title, a swipeable dish, its name, description, and a
large **OMR** price — with the next course pre-visible and blurred beneath, so
scrolling feels like moving through layers of glass. An owner-facing admin panel
manages everything: add courses, add dishes (name, image, description, price),
reorder, and edit — changes go live on the menu instantly.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, with a data
layer that runs on a **local JSON file** for zero-setup development and on
**Postgres + S3-compatible storage** in production — no code changes, just env vars.

**White-label:** all branding (name, logo, accent colour, contact links) lives in
one file — [`src/brand.config.ts`](./src/brand.config.ts). To spin up a new client,
see **[ONBOARDING.md](./ONBOARDING.md)**.

**Free hosting stack:** Netlify (host) + Neon (Postgres) + Cloudflare R2 (images).
Also deployable to Vercel (Postgres + Blob). The image uploader auto-detects the
provider from env vars (S3/R2 → Vercel Blob → local files).

**Bilingual (EN/AR + RTL):** every dish carries English + Arabic; a toggle flips
the whole menu to right-to-left with Arabic fonts. **Optional ordering:** enable
`features.ordering` for table-QR ordering — cart → order → live `/admin/orders`
board, a `/admin/tables` QR generator, and a POS adapter interface (`src/lib/pos`)
ready for connectors like Foodics.

---

## Quick start (local)

```bash
npm install
npm run dev
```

Open **http://localhost:3000** for the menu and **http://localhost:3000/admin**
for the admin panel. With no `DATABASE_URL` set, the app seeds a sample menu into
`data/menu.local.json` on first load, and image uploads are written to
`public/uploads/`. The default admin password is **`admin`** (override with
`ADMIN_PASSWORD`).

---

## How it works

### The experience (`/`)
- One scroll container with vertical **scroll-snap**; one full-height scene per course.
- Dishes are **swipeable** left/right (touch, drag, arrow keys, or on-screen arrows).
- Each dish floats on a plated "stage" with a soft shadow and a gentle idle drift —
  the premium, 3D-ish feel comes from depth, blur, and parallax, so **no 3D assets
  are needed**. Real dishes look best as **transparent PNGs**.
- Fully responsive, `prefers-reduced-motion` aware, and keyboard/screen-reader friendly.

### The admin (`/admin`)
- Single shared password (`ADMIN_PASSWORD`), a signed session cookie, and middleware
  that guards every `/admin` page and `/api/admin` route.
- Add / edit / delete / reorder **courses** and **dishes**; upload dish images;
  set prices in OMR. Edits reflect on the menu immediately.

### Data layer
A single `MenuStore` interface (`src/lib/store`) has two implementations chosen at
runtime:

| Condition | Store | Images |
| --- | --- | --- |
| `DATABASE_URL` **set** | Postgres (Prisma) | Vercel Blob (`BLOB_READ_WRITE_TOKEN`) |
| `DATABASE_URL` **unset** | Local JSON file | `public/uploads/` |

Prices are stored as integer **baisa** (1 OMR = 1000 baisa) to avoid float rounding.

---

## Deploy to Vercel

1. **Push this repo** and import it into Vercel.
2. **Add storage** in the project's **Storage** tab:
   - a **Postgres** database → provides `DATABASE_URL` (and `DIRECT_URL`),
   - a **Blob** store → provides `BLOB_READ_WRITE_TOKEN`.
3. **Set env vars** (Settings → Environment Variables):
   - `ADMIN_PASSWORD` — the owner's password,
   - `SESSION_SECRET` — a long random string (`openssl rand -base64 32`).
4. **Deploy.** The build runs `prisma generate`, then `scripts/db-setup.mjs`
   (creates/updates tables via `prisma db push` and seeds the sample menu once —
   both idempotent), then `next build`. No manual database step is needed; the
   setup script no-ops automatically when no database is configured.

The provider's connection-string env vars are auto-detected: `DATABASE_URL`,
or Vercel Postgres' `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`, or Neon's
`DATABASE_URL_UNPOOLED`.

The menu is at `/`, the admin at `/admin`.

---

## Configuration

See [`.env.example`](./.env.example) for every variable. Summary:

| Variable | Purpose | Default (dev) |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Admin login password | `admin` |
| `SESSION_SECRET` | Signs the admin session cookie | dev fallback |
| `DATABASE_URL` | Enables Postgres store | unset → JSON |
| `DIRECT_URL` | Direct Postgres URL (migrations) | optional |
| `BLOB_READ_WRITE_TOKEN` | Enables Vercel Blob uploads | unset → local files |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm start` | Run the production build |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:seed` | Seed the sample menu (Postgres) |

---

## Project structure

```
src/
  app/
    page.tsx                 # the public scrolling menu
    admin/                   # admin dashboard + login
    api/admin/               # auth + CRUD + upload routes
    globals.css              # design tokens (light & airy system)
  components/
    menu/                    # the scroll experience (scenes, swiper, dish, bg)
    admin/                   # dashboard, category card, item editor
  lib/
    store/                   # MenuStore: JSON + Prisma implementations
    money.ts                 # OMR / baisa helpers
    auth.ts                  # single-password session auth
  middleware.ts              # protects /admin and /api/admin
prisma/
  schema.prisma              # Category + Item models
  seed.ts                    # sample-menu seeder
public/sample/               # placeholder dish art (replace via admin)
```

## Branding

The logo/wordmark in the header and the sample dish art are placeholders — swap
them for the restaurant's real branding and transparent-PNG dish photos.
