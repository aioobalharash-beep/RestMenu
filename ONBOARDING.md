# Client onboarding playbook

How to stand up a new restaurant on RestMenu. One client = one deployment
(its own repo, database, storage, domain, and admin password) — clean, isolated,
and fully free to host.

**Free stack:** GitHub (template) → Netlify (host) → Neon (Postgres) → Cloudflare R2 (images).

---

## 0. One-time setup (accounts)
Create free accounts: **GitHub**, **Netlify**, **Neon** (neon.tech), **Cloudflare** (for R2).
Mark this repo as a **GitHub Template**: repo → Settings → check **“Template repository.”**

## 1. Intake — collect from the client
- **Brand:** restaurant name, tagline (optional), logo (SVG or transparent PNG), brand colour (hex).
- **Menu:** dish photos (ideally transparent PNGs) + who writes the copy/prices.
- **Contact:** Google Maps link, Instagram URL, WhatsApp number.
- **Domain:** e.g. `menu.theircafe.com` (or use the free `*.netlify.app` to start).

## 2. Create the client repo
On this repo → **Use this template** → create `restmenu-<client>`.

## 3. Brand it (Claude Code session)
Open a Claude Code session on the new repo and paste a prompt like:

> Update the branding for this client. In `src/brand.config.ts` set
> **name** = "Client Name", **tagline** = "…", **accent** = "#RRGGBB",
> **accentDeep** = "#RRGGBB" (a darker shade). I'm adding their logo at
> `public/brand/logo.svg` — set **logo** to "/brand/logo.svg". Set the
> **contact** links: map, instagram, whatsapp. Then commit and push.

Also drop their favicon at `src/app/icon.png` (optional). That's the whole
white-label — one file plus two assets.

## 4. Provision data + images (free)
- **Neon:** new project → copy the connection string (pooled) → this is `DATABASE_URL`.
  Also grab the **non-pooling** string for `DIRECT_URL`.
- **Cloudflare R2:** create a bucket → enable public access (r2.dev or a custom
  domain) → create an API token (Access Key + Secret). Note the account endpoint.

## 5. Create the Netlify site
Netlify → **Add new site → Import from GitHub** → pick the client repo.
Add **Environment variables** (Site settings → Environment):

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | the client's admin password |
| `SESSION_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URL` | Neon pooled string |
| `DIRECT_URL` | Neon non-pooling string |
| `S3_BUCKET` | R2 bucket name |
| `S3_ACCESS_KEY_ID` | R2 access key |
| `S3_SECRET_ACCESS_KEY` | R2 secret |
| `S3_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `S3_REGION` | `auto` |
| `S3_PUBLIC_BASE_URL` | the bucket's public URL (e.g. `https://pub-xxx.r2.dev`) |

Deploy. The build auto-creates the tables and seeds the sample menu.

## 6. Load the real menu
- **Fastest:** the client (or you) adds dishes in the **admin panel** (`/admin`).
- **Bulk replace:** put the real menu in `src/lib/store/sample-menu.ts` (names,
  descriptions, prices, image paths), set `IMPORT_MENU=1` in Netlify env, redeploy
  once (this **wipes** the sample and loads the real menu), then **remove** the flag.

## 6b. Optional: table ordering + POS
- **Enable ordering:** set `features.ordering: true` in `src/brand.config.ts`.
  Diners get an "Add" control on each dish, a cart, and can place orders; staff
  see them live at `/admin/orders`. Works with no POS.
- **Table QR codes:** print them from `/admin/tables` (each opens the menu with
  that table pre-selected, so orders arrive tagged with the table).
- **POS connector:** implement a `PosAdapter` in `src/lib/pos` (e.g. Foodics),
  register it, and set `POS_PROVIDER` + credentials in env. The webhook endpoint
  is `/api/pos/webhook`. Bilingual + RTL apply to ordering too.

## 7. Domain + handover
- Add the custom domain in Netlify (free SSL).
- Give the client: the menu URL, `/admin` URL, their admin password, and a short how-to.
- Store their secrets in your password manager. Never commit secrets.

---

## Notes
- **Secrets:** every client gets a unique `ADMIN_PASSWORD` and `SESSION_SECRET`.
- **Backups:** Neon keeps history; you can also export via the admin later.
- **Updates:** client repos are template copies — core fixes don't auto-propagate.
  Re-pull from the template when needed (fine for a handful of clients).
- **Costs:** all tiers here are free for a menu's traffic; upgrade a single layer
  only if a client outgrows it.
