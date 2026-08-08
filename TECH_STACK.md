# JeeVan — Technology Stack Audit

> Free tier only. $0 budget. Every service listed has a free plan.

---

## Current Stack (v1.2.0 → v1.3.0)

| Category | Tech | Tier | Alternative (Free) | Verdict |
|----------|------|------|--------------------|--------|
| **Framework** | Next.js 14 | Free (Vercel) | Remix, Astro | ✅ Best for SSR+static |
| **Hosting** | Vercel | Hobby (free) | Netlify, Cloudflare Pages | ✅ Best DX |
| **Database** | Supabase | Free (500MB) | PlanetScale, Neon | ✅ Best for auth+DB |
| **Auth** | Supabase Auth | Free (50K MAU) | Firebase Auth, Clerk | ✅ Email free, phone=paid |
| **Auth (Phone)** | Custom REST API | Free | Firebase Auth (10K phone/mo) | 🔄 Switch to Firebase |
| **Payments** | Razorpay | Live | Stripe, Paytm | ✅ Already live |
| **Translation** | DeepL API | Free (500K chars/mo) | LibreTranslate, Google Translate | ✅ Best quality |
| **AI (Primary)** | Groq Llama 3.3 70B | Free (30 req/min) | Together AI, Fireworks | ✅ Fastest free inference |
| **AI (Backup)** | Google Gemini | Free (60 req/min) | Claude, Mistral | ✅ Good fallback |
| **Weather** | Open-Meteo | Free (no key) | OpenWeatherMap | ✅ No limits |
| **Countries** | REST Countries | Free (no key) | CountryAPI | ✅ Open source |
| **Market Rates** | Agmarknet (Data.gov.in) | Free | None in India | ✅ Official API |
| **Email (Newsletter)** | Mailchimp | Free (500 contacts) | SendGrid, Brevo | ✅ Good for small list |
| **CDN/Video** | Cloudinary | Free (25GB) | Uploadcare, ImageKit | ✅ Generous free tier |
| **CSS** | Tailwind CSS 3 | Free | UnoCSS, Panda CSS | ✅ Utility-first |
| **Animation** | Framer Motion | Free | GSAP, Motion One | ✅ React-native |
| **State** | Zustand | Free | Jotai, Redux | ✅ Lightweight |
| **Testing** | Playwright | Free | Cypress, Vitest | ✅ Multi-browser |
| **Icons** | Lucide React | Free | Radix Icons | ✅ Tree-shakeable |
| **3D (Docker)** | Three.js / R3F | Free | Babylon.js | ✅ WebGL engine |
| **PWA** | next-pwa compatible | Free | Workbox | ✅ Manifest ready |

---

## API Redundancy (3-deep fallback per function)

| Function | Primary | Backup 1 | Backup 2 |
|----------|---------|----------|----------|
| AI Advisory | Groq Llama 3.3 | Google Gemini | JeeVan Knowledge Base (local) |
| Weather | Open-Meteo | — | — |
| Countries | REST Countries v3.1 | — | — |
| Translation | DeepL | LibreTranslate | — |
| Market | Agmarknet | JeeVan cached DB | — |
| Payments | Razorpay | WhatsApp fallback | — |
| Auth | Custom REST + Supabase | Firebase Auth | Guest mode |
| Newsletter | Mailchimp | Supabase direct insert | — |

---

## What Could Be Better (but costs $)

| Current | Paid Alternative | Benefit |
|---------|-----------------|---------|
| Vercel Hobby | Vercel Pro ($20/mo) | Analytics, team, 1TB bandwidth |
| Supabase Free | Supabase Pro ($25/mo) | No pausing, backups, 8GB DB |
| DeepL Free | DeepL Pro | Unlimited translations |
| Groq Free | OpenAI/GPT-4 | Better quality (but $) |

---

## Total Cost: $0/month

All services on free tiers. No paid dependency.
