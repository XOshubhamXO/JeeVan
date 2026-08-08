# JeeVan — Next Steps

> **v1.2.0** | **100% Core Complete**

---

## What's in `jeevan-update-v1.2.0.zip`

38 files — only changed ones. Drop into project root, overwrite.

---

## Before Deploy

```bash
cd jeevan-platform
npm install --legacy-peer-deps
bash scripts/deploy.sh
```

---

## After Deploy — Vercel Env Vars (ALL required)

| Key | Value | Status |
|-----|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://iylyhdddvpsckinpnyxw.supabase.co` | ✅ Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(in .env)* | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | *(in .env)* | ✅ Set |
| `DEEPL_API_KEY` | `2e84f8ce-...` | ✅ Set |
| `GROQ_API_KEY` | `gsk_Ul4yyy...` | ✅ Set |
| `GOOGLE_AI_API_KEY` | `AQ.Ab8RN6I...` | ✅ Set |
| `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` | Cloudinary MP4 URL | 🔴 Add |
| `MAILCHIMP_API_KEY` | `b0b9495018c89fa28715284c34e88902` | 🔴 Add |
| `MAILCHIMP_LIST_ID` | `10626629` | 🔴 Add |
| `AGMARKNET_API_KEY` | `579b464db66ec23bdd000001c6e32fa41f7f48926bb7e6ddc8a252fa` | 🔴 Add |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_TNHQwrr9ErYmv4` | 🔴 Add |
| `RAZORPAY_KEY_SECRET` | `FDC14wSuysszyKkxepcl2KJl` | 🔴 Add |

---

## Remaining — Your Only Action

### Real Farm Photos
Replace 16 AI-generated images in `public/` and `public/plants/` with your actual Nalanda farm photos.

### Optional
- Upload podcast MP3s → update `src/data/podcast-episodes.json`
- Enable Email/Phone auth in Supabase Dashboard for `/login`

---

## Verify After Deploy

- [ ] Homepage with video background
- [ ] Language switch (floating controller)
- [ ] Blog articles render with structured data
- [ ] Podcast page shows 6 episodes
- [ ] `/shop/checkout` — Razorpay payment modal opens
- [ ] 404 page at `/nonexistent`
- [ ] Newsletter signup → Supabase
- [ ] PWA installable on mobile

---

## Admin

| Panel | URL | Passkey |
|-------|-----|---------|
| Alpha | `/admin/alpha` | `JeeVan-Alpha-2024` |
| Beta | `/admin/beta` | `JeeVan-Beta-2024` |
