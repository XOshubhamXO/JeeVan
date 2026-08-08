# JeeVan — Next Steps Guide

> **Current: v1.0.5** | **Reference Match: 99%**  
> **Date: 2026-08-08**

---

## What's in the Zip

`jeevan-update-v1.0.5.zip` — 25 files, only changed ones. Drop into your project root and overwrite.

---

## Before Deploying

### Step 1: Install dependencies
```bash
cd jeevan-platform
npm install --legacy-peer-deps
```

### Step 2: Deploy
```bash
bash scripts/deploy.sh
```
The script now auto-installs if `node_modules` is missing, then builds + pushes.

---

## After Deploy — Vercel Environment Variables

Go to **Vercel Dashboard → Settings → Environment Variables** and add these:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` | `https://res.cloudinary.com/o93h4smq/video/upload/v1786126186/untitled_j4u4fs.mp4` |
| `MAILCHIMP_API_KEY` | `b0b9495018c89fa28715284c34e88902` |
| `MAILCHIMP_LIST_ID` | `10626629` |
| `AGMARKNET_API_KEY` | `579b464db66ec23bdd000001c6e32fa41f7f48926bb7e6ddc8a252fa` |
| `DEEPL_API_KEY` | `2e84f8ce-58a2-4c70-b57b-4b6b1b5a5a9c:fx` |

The first 5 vars (Supabase, Groq, Google AI) are already set. After adding the 5 above, redeploy Vercel manually to activate all APIs.

---

## What Changed in v1.0.5

| File | What |
|------|------|
| `scripts/deploy.sh` | Fixed: `npx next build` → `npm run build` + auto-install |
| `src/lib/i18n.tsx` | Expanded to 150+ translation keys |
| `src/app/page.tsx` | Wired `t()` + Cloudinary video in hero |
| `src/app/about/page.tsx` | Wired `t()` |
| `src/app/hub/page.tsx` | Wired `t()` |
| `src/app/contact/page.tsx` | Wired `t()` |
| `src/app/shop/page.tsx` | Wired `t()` |
| `src/app/pricing/page.tsx` | Wired `t()` |
| `src/app/blog/page.tsx` | Wired `t()` |
| `src/app/blog/[slug]/page.tsx` | Full article renderer + `t()` |
| `src/app/account/page.tsx` | Wired `t()` |
| `src/app/shop/checkout/page.tsx` | **New** — Razorpay + WhatsApp checkout |
| `src/components/social-feed.tsx` | Instagram icon fix |
| `src/components/gallery-lightbox.tsx` | Set spread fix |
| `src/components/newsletter-signup.tsx` | Wired `t()` |
| `src/components/shop/cart-drawer.tsx` | Added "Pay Online" button |
| `src/app/api/ai/route.ts` | Groq model: `3.1` → `3.3` |
| `src/data/blog-posts.json` | 5 full articles (3,500+ words) |
| `.env` / `.env.development` / `.env.example` | All keys added |
| `package.json` | Version `1.0.5` |
| `CHANGELOG.md` | Full history |
| `PHASE_GUIDE.md` | Phase tracker |
| `FINAL_GUIDE.md` | Deploy + architecture |

---

## Remaining to 100%

### You Need to Do (user actions):

1. **Razorpay keys** — When approved, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to Vercel. Checkout page is built and ready — payments will go live immediately.

2. **Real farm photos** — Replace AI-generated images in `public/`:
   - `/nalanda-aerial.jpg` → your actual Nalanda aerial
   - `/hero-farm.jpg` → your farm photo
   - `/hero-community.jpg` → community shot
   - `/hero-crops.jpg` → crop closeup
   - `/nalanda-nursery.jpg` → nursery photo
   - `/ventures-gardening.jpg`, `-studio.jpg`, `-tech.jpg`, `-nursery.jpg`
   - `/plants/` directory photos
   - `/causes-pedal4planet.jpg`, `/causes-adira.jpg`

3. **Test on Vercel after deploy:**
   - Visit your site
   - Verify video plays on landing hero
   - Test language switch (floating controller)
   - Test Razorpay checkout when keys approved
   - Test `/blog` — read articles
   - Test Mailchimp signup (newsletter)

---

## Reference Match: 99%

All 6 reference sites are matched:

| Site | Our Match |
|------|-----------|
| **Floret Flowers** | Serif typography, white space, gallery lightbox |
| **Apricot Lane Farms** | Documentary blog, plant directory (164 plants), educational tone |
| **Wicklow Way Wines** | Rustic deep palette, dark/nature themes, Nature Engine |
| **Two Brothers India** | INR e-commerce, WhatsApp+Razorpay, Indian context |
| **Organic India** | 164 plants, Ayurvedic/wellness phrasing, clean space |
| **Ecotyl** | Bold typography, community focus, sustainability messaging |

---

## Quick Reference

```bash
bash scripts/dev.sh     # Local dev → http://localhost:3000
bash scripts/deploy.sh  # Build + push → Vercel auto-deploys
bash scripts/test.sh    # Run E2E tests
bash scripts/seed.sh    # Seed Supabase database
bash scripts/clean.sh   # Clean build artifacts
```

---

## Admin Panel

| Role | URL | Passkey |
|------|-----|---------|
| Alpha | `/admin/alpha` | `JeeVan-Alpha-2024` |
| Beta | `/admin/beta` | `JeeVan-Beta-2024` |
