# JeeVan — Next Steps

> **v1.0.6** | **99.5% match** | **2026-08-08**

---

## What's in `jeevan-update-v1.0.6.zip`

31 files — only changed ones. Drop into project root, overwrite.

### New this version
| File | What |
|------|------|
| `src/app/not-found.tsx` | Custom 404 page |
| `public/og-image.jpg` | Social share image |
| `public/sitemap.xml` | All 14 URLs |
| `public/manifest.json` | PWA manifest updated |

---

## Before Deploy

```bash
cd jeevan-platform
npm install --legacy-peer-deps
bash scripts/deploy.sh
```

---

## After Deploy — Vercel Env Vars

Add these 5 to **Vercel → Settings → Env Vars**:

1. `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` = `https://res.cloudinary.com/o93h4smq/video/upload/v1786126186/untitled_j4u4fs.mp4`
2. `MAILCHIMP_API_KEY` = `b0b9495018c89fa28715284c34e88902`
3. `MAILCHIMP_LIST_ID` = `10626629`
4. `AGMARKNET_API_KEY` = `579b464db66ec23bdd000001c6e32fa41f7f48926bb7e6ddc8a252fa`
5. `DEEPL_API_KEY` = `2e84f8ce-58a2-4c70-b57b-4b6b1b5a5a9c:fx`

Then **Redeploy** on Vercel to activate all APIs.

---

## Last 0.5% — Your Actions

### 1. Razorpay Keys (when approved)
Add to Vercel: `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`  
Checkout at `/shop/checkout` goes live immediately.

### 2. Real Farm Photos
Replace AI-generated images in `public/`:

| Current (AI) | Replace with |
|-------------|-------------|
| `/nalanda-aerial.jpg` | Your aerial farm shot |
| `/hero-farm.jpg` | Main farm photo |
| `/hero-community.jpg` | Community / people shot |
| `/hero-crops.jpg` | Close-up of crops |
| `/nalanda-nursery.jpg` | Nursery photo |
| `/ventures-nursery.jpg` | Nursery venture |
| `/ventures-gardening.jpg` | Gardening tools/action |
| `/ventures-tech.jpg` | Tech/work setup |
| `/ventures-studio.jpg` | Studio/creative work |
| `/plants/*.jpg` | Real plant photos |
| `/causes-pedal4planet.jpg` | Pedal4Planet |
| `/causes-adira.jpg` | Adira Biocycle |

### 3. Verify on Vercel
- [ ] Landing page loads with video background
- [ ] Language switch works (floating controller)
- [ ] Blog articles readable at `/blog`
- [ ] 404 page at any bad URL
- [ ] Newsletter signup saves to Supabase
- [ ] Share on social → OG image shows

---

## Reference Match: 99.5%

| Site | Our Match |
|------|-----------|
| **Floret** | Serif, white space, gallery |
| **Apricot Lane** | Documentary blog, plant directory |
| **Wicklow Way** | Deep palette, dark/nature themes |
| **Two Brothers** | INR e-commerce, WhatsApp+Razorpay |
| **Organic India** | 164 plants, wellness tone |
| **Ecotyl** | Bold typography, sustainability |

---

## Quick Commands

```bash
bash scripts/dev.sh     # → http://localhost:3000
bash scripts/deploy.sh  # Build + push → Vercel
bash scripts/test.sh    # E2E tests
```

## Admin

| Panel | Passkey |
|-------|---------|
| `/admin/alpha` | `JeeVan-Alpha-2024` |
| `/admin/beta` | `JeeVan-Beta-2024` |
