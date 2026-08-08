# JeeVan — Phase Guide

> **Current Version:** v1.0.0  
> **Next Target:** v1.0.1  
> **Goal:** Match reference sites (Floret, Apricot Lane, Wicklow Way, Two Brothers India, Organic India, Ecotyl) at 100%

---

## Phase 1 — Foundation ✅ (v1.0.0)

- [x] Next.js 14 + TypeScript + Tailwind scaffold
- [x] 10 pages (Landing, About, Hub, Contact, Account, Blog, Blog/[slug], Shop, Pricing, Admin)
- [x] 12 API routes
- [x] 22 components
- [x] CSS design system (3 themes, custom properties)
- [x] Shopping cart (Zustand + localStorage)
- [x] WhatsApp checkout flow
- [x] Onboarding flow (Country → Language → Theme → Survey)
- [x] Admin dashboard (Alpha + Beta)
- [x] Blog with search + tag filter
- [x] Parallax scrolling hero
- [x] Gallery lightbox
- [x] SEO (JSON-LD, sitemap, robots.txt, manifest)
- [x] Supabase integration (164 plants, 13 ventures)
- [x] DeepL translation API
- [x] Nature Engine (CSS-only on Vercel, WebGL preserved for Docker)
- [x] 7 bash scripts (setup, dev, build, deploy, test, seed, clean)
- [x] Build fixes: Set spread → Array.from, class → className

---

## Phase 2 — Environment & APIs (v1.0.1)

- [ ] Add `NEXT_PUBLIC_CLOUDINARY_VIDEO_URL` to Vercel
- [ ] Add `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` to Vercel
- [ ] Add `MAILCHIMP_API_KEY` + `MAILCHIMP_LIST_ID` to Vercel
- [ ] Add `AGMARKNET_API_KEY` to Vercel
- [ ] Redeploy to activate AI/Market API keys (Groq, Google AI)

---

## Phase 3 — i18n Refactor (v1.0.2)

- [ ] Wire `useI18n().t()` into all components (currently hardcoded English)
- [ ] Components to refactor: Landing, About, Hub, Contact, Shop, Pricing, Blog, Account, Admin
- [ ] Test DeepL translation flow end-to-end for Hindi, Marathi, Bangla

---

## Phase 4 — Payments & Email (v1.0.3)

- [ ] Build Razorpay checkout UI (frontend form → `/api/payment/create-order`)
- [ ] Test live payment flow with Razorpay test keys
- [ ] Test Mailchimp subscription with live keys
- [ ] Verify newsletter_subscribers table on Supabase

---

## Phase 5 — Content (v1.0.4)

- [ ] Write full body content for 5 blog articles
- [ ] Add real Nalanda farm photos (replace AI-generated images)
- [ ] Upload farm video to Cloudinary, set URL

---

## Phase 6 — Polish (v1.0.5)

- [ ] Reference match audit at 100%
- [ ] E2E test pass (all 3 browsers)
- [ ] Performance audit (Lighthouse > 90)
- [ ] Accessibility audit

---

## Future

- Android APK build (configs ready, sideload first)
- Docker deployment with WebGL Nature Engine
- Custom domain (user to configure later)
