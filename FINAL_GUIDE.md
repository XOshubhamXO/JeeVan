# JeeVan — Final Guide

> **Current:** v1.0.0 | **Target:** v1.0.5 (100%)  
> **Budget:** $0 (free tiers only)  
> **Hosting:** Vercel (subdomain)

---

## Quick Deploy

```bash
# 1. Build & push to GitHub → Vercel auto-deploys
bash scripts/deploy.sh

# 2. If build fails, check the error and fix
bash scripts/build.sh
```

---

## Vercel Environment Variables (Required)

Go to **Vercel Dashboard → Project → Settings → Environment Variables** and add:

| Key | Status |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Done |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Done |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Done |
| `DEEPL_API_KEY` | ✅ Done |
| `GROQ_API_KEY` | ✅ Done |
| `GOOGLE_AI_API_KEY` | ✅ Done |
| `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` | 🔴 Add now |
| `RAZORPAY_KEY_ID` | 🔴 Add now |
| `RAZORPAY_KEY_SECRET` | 🔴 Add now |
| `MAILCHIMP_API_KEY` | 🔴 Add now |
| `MAILCHIMP_LIST_ID` | 🔴 Add now |
| `AGMARKNET_API_KEY` | 🟡 Optional |

---

## Supabase

**URL:** `https://iylyhdddvpsckinpnyxw.supabase.co`

### Tables
- `plant_directory` — 164 plants (heirloom, desi, Magahi varieties)
- `ventures` — 13 venture plans
- `admin_users` — 2 admins (Alpha + Beta)
- `newsletter_subscribers` — schema created, needs push

### Admin Credentials
| Role | Passkey |
|------|---------|
| Alpha (`/admin/alpha`) | `JeeVan-Alpha-2024` |
| Beta (`/admin/beta`) | `JeeVan-Beta-2024` |

---

## Build Known Issues & Fixes

### `Type error: Set can only be iterated...`
**Pattern:** `[...someSet]` or `new Set([...l, i])`  
**Fix:** Use `Array.from(someSet)` or `new Set(l); s.add(i); return s`

### `class=` vs `className=`
**Pattern:** HTML `class=` in TSX files  
**Fix:** Replace with `className=`

### `npm install` fails
**Fix:** Use `--legacy-peer-deps` (set in `.npmrc` and `vercel.json`)

---

## Dev Workflow

```bash
# Start dev server
bash scripts/dev.sh
# → http://localhost:3000

# Run tests
bash scripts/test.sh

# Seed database
bash scripts/seed.sh

# Clean build artifacts
bash scripts/clean.sh
```

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing
│   ├── layout.tsx          # Root layout (SEO, JSON-LD, theme)
│   ├── globals.css         # Design system (250+ lines)
│   ├── about/page.tsx      # Farm narrative
│   ├── hub/page.tsx        # Interactive dashboard
│   ├── contact/page.tsx    # WhatsApp contact
│   ├── account/page.tsx    # Customer profile
│   ├── blog/               # Blog listing + [slug]
│   ├── shop/page.tsx       # Shop + cart
│   ├── pricing/page.tsx    # Venture plans
│   ├── admin/              # Alpha + Beta dashboards
│   └── api/                # 12 API routes
├── components/             # 22 reusable components
│   ├── parallax-hero.tsx
│   ├── nature/nature-engine.tsx
│   ├── gallery-lightbox.tsx
│   ├── onboarding/         # Country → Language → Theme → Survey
│   ├── shop/cart-drawer.tsx
│   └── admin/alpha-dashboard.tsx
├── lib/
│   ├── i18n.tsx            # I18n provider + DeepL
│   └── store/              # Zustand stores (cart, auth)
└── scripts/                # 7 bash scripts
```
