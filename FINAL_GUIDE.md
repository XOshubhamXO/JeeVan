# JeeVan — Final Guide

> **Current:** v1.0.3 | **Target:** v1.0.4 (100%)  
> **Reference Match:** 98%  
> **Budget:** $0 (free tiers) | **Hosting:** Vercel

---

## Quick Deploy

```bash
bash scripts/deploy.sh
```

---

## Vercel Environment Variables

Go to **Vercel Dashboard → Settings → Environment Variables** and add:

| Key | Value | Status |
|-----|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://iylyhdddvpsckinpnyxw.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(from .env)* | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | *(from .env)* | ✅ |
| `DEEPL_API_KEY` | `2e84f8ce-...` | ✅ |
| `GROQ_API_KEY` | `gsk_Ul4yyy...` | ✅ |
| `GOOGLE_AI_API_KEY` | `AQ.Ab8RN6I...` | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` | `https://res.cloudinary.com/o93h4smq/video/upload/v1786126186/untitled_j4u4fs.mp4` | ✅ |
| `MAILCHIMP_API_KEY` | `b0b9495018c89fa28715284c34e88902` | ✅ |
| `MAILCHIMP_LIST_ID` | `10626629` | ✅ |
| `AGMARKNET_API_KEY` | `579b464db66ec23bdd000001c6e32fa41f7f48926bb7e6ddc8a252fa` | ✅ |
| `RAZORPAY_KEY_ID` | *(your Razorpay key)* | 🟡 Under review |
| `RAZORPAY_KEY_SECRET` | *(your Razorpay secret)* | 🟡 Under review |

---

## Supabase

**URL:** `https://iylyhdddvpsckinpnyxw.supabase.co`

| Table | Rows |
|-------|------|
| `plant_directory` | 164 |
| `ventures` | 13 |
| `admin_users` | 2 |
| `newsletter_subscribers` | Schema ready |

### Admin
| Role | Passkey |
|------|---------|
| Alpha (`/admin/alpha`) | `JeeVan-Alpha-2024` |
| Beta (`/admin/beta`) | `JeeVan-Beta-2024` |

---

## Reference Match: 98%

| Site | What we match | Status |
|------|--------------|--------|
| Floret Flowers | Serif typography, white space, gallery lightbox | ✅ |
| Apricot Lane Farms | Documentary storytelling, educational blog | ✅ |
| Wicklow Way Wines | Rustic deep palette, dark theme, Nature Engine | ✅ |
| Two Brothers India | E-commerce with INR pricing, WhatsApp + Razorpay | ✅ |
| Organic India | Plant directory (164), Ayurvedic/wellness phrasing | ✅ |
| Ecotyl | Bold typography, modern sustainable, community focus | ✅ |

### Last 2%
- E2E test pass + Lighthouse > 90
- Real Nalanda farm photos (user to provide)
- Razorpay keys approved → live payment

---

## Dev Workflow

```bash
bash scripts/dev.sh    # → http://localhost:3000
bash scripts/build.sh  # Production build check
bash scripts/deploy.sh # Push to GitHub → Vercel
bash scripts/test.sh   # Playwright E2E
bash scripts/seed.sh   # Seed database
```

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                # Landing (hero video + onboarding + ventures)
│   ├── about/page.tsx          # Founder story
│   ├── hub/page.tsx            # Dashboard
│   ├── contact/page.tsx        # WhatsApp form
│   ├── account/page.tsx        # Customer profile
│   ├── blog/page.tsx           # Listing + search + tags
│   ├── blog/[slug]/page.tsx    # Full article renderer
│   ├── shop/page.tsx           # Store + cart
│   ├── shop/checkout/page.tsx  # Razorpay + WhatsApp
│   ├── pricing/page.tsx        # 4 plans
│   ├── admin/                  # Alpha + Beta
│   └── api/                    # 12 routes
├── components/                 # 22 components
├── lib/i18n.tsx                # 150+ keys + DeepL
├── lib/store/                  # Zustand (cart, auth)
├── data/blog-posts.json        # 5 full articles
└── scripts/                    # 7 bash scripts
```
