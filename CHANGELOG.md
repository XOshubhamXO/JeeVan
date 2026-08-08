# JeeVan — Changelog

> **Versioning:** Sequential: `1.0.0 → 1.0.1 → 1.0.2 …`  
> **Deploy:** `bash scripts/deploy.sh` → Vercel auto-deploys  
> **Status:** v1.0.0 — Build fixed, clutter cleaned

---

## v1.0.0 — 2026-08-08 (Current)

### Build Fixes (4 issues resolved)
- **`gallery-lightbox.tsx:37`** — `new Set([...l, i])` spread-on-Set → `new Set(l); s.add(i); return s`
- **`blog/page.tsx:12`** — `[...new Set(posts.flatMap(...))]` → `Array.from(new Set(posts.flatMap(...)))`
- **Footer links** — `class=` (HTML) → `className=` (React/JSX) in blog + shop footers
- **`social-feed.tsx:4`** — `Instagram` removed from lucide-react → inline SVG component
- **`social-feed.tsx:27`** — `style` prop not accepted by custom icon → spread `...props`

### Cleanup
- Removed: `ANDROID_GUIDE.md`, `COMPARISON.md`, `DOCKER_GUIDE.md`, `FINAL_GUIDE.md`, `PHASE_GUIDE.md`, `JEEVAN.md`, `VERSION.md` (old docs)
- Removed: `src/app/page.tsx.bak` (backup)
- Removed: `.next/` (build cache)
- Removed: `/home/user/uploads/` (uploaded artifacts)
- Consolidated into: `CHANGELOG.md`, `PHASE_GUIDE.md`, `FINAL_GUIDE.md`

### Version Reset
- Reset from `3.0.0` → `1.0.0` (sequential scheme)

---

## Commands History

```bash
# Setup
npm install --legacy-peer-deps

# Development
bash scripts/dev.sh

# Build
bash scripts/build.sh

# Deploy (build + push → Vercel)
bash scripts/deploy.sh

# Seed database
bash scripts/seed.sh

# Clean
bash scripts/clean.sh

# Tests
bash scripts/test.sh

# Database
npx supabase db push
npx supabase db reset
```

---

## Platform State

### Pages (10)
Landing (`/`), About, Hub, Contact, Account, Blog, Blog/[slug], Shop, Pricing, Admin (Alpha + Beta)

### API Routes (12)
countries, weather, market, ai, match, translate, search, mailchimp, payment/create-order, payment/verify, admin/auth, telemetry

### Components (22)
ParallaxHero, VideoHero, NatureEngine, GalleryLightbox, NewsletterSignup, CartDrawer, TestimonialWall, CookieConsent, ReadingProgress, LazyImage, AnalyticsOverview, SocialFeed, SEO-JsonLD, Skeleton, Onboarding (CountrySelection, LanguageSelection, ThemeSelection, Survey), Admin (AlphaDashboard, BetaDashboard), PlantDirectory

### Design System
3 themes: Light / Dark / Nature (CSS custom properties in `globals.css`, 250+ lines)

### Integrations
| Service | Status | Notes |
|---------|--------|-------|
| Supabase | ✅ | 164 plants, 13 ventures, 2 admins |
| DeepL | ✅ | Real-time translation API |
| Groq AI | ✅ (needs redeploy) | KB offline on Vercel |
| Google AI | ✅ (needs redeploy) | Needs redeploy to activate |
| Razorpay | ❌ (keys missing) | Mock mode works |
| Mailchimp | ❌ (keys missing) | Falls back to Supabase |
| Cloudinary Video | ❌ (URL missing) | `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` |
| AGMARKNET | ❌ (key missing) | Uses cached market data |

---

## Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL          ✅ Set
NEXT_PUBLIC_SUPABASE_ANON_KEY     ✅ Set
SUPABASE_SERVICE_ROLE_KEY         ✅ Set
DEEPL_API_KEY                     ✅ Set
GROQ_API_KEY                      ✅ Set (needs redeploy)
GOOGLE_AI_API_KEY                 ✅ Set (needs redeploy)
AGMARKNET_API_KEY                 ❌ Not set
NEXT_PUBLIC_CLOUDINARY_VIDEO_URL  ❌ Not set
RAZORPAY_KEY_ID                   ❌ Not set
RAZORPAY_KEY_SECRET               ❌ Not set
MAILCHIMP_API_KEY                 ❌ Not set
MAILCHIMP_LIST_ID                 ❌ Not set
```
