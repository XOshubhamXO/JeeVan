# JeeVan — Technology Stack & Free Alternatives

> **v1.1.0** | **$0/month** | **2026-08-08**

---

## Current Stack vs Best Free Alternatives

### Framework & Hosting
| Current | Best Alternative | Why |
|---------|-----------------|-----|
| Next.js 14 + Vercel | **Astro 5 + Cloudflare Pages** | Lighter, unlimited bandwidth, zero-JS default |
| Tailwind CSS 3 | **UnoCSS** | Smaller, faster, full Tailwind compat |
| Vercel Hobby | **Cloudflare Pages** | No 100GB bandwidth cap |

### Database & Backend
| Current | Best Alternative | Why |
|---------|-----------------|-----|
| Supabase (500MB, pauses) | **Turso** | 9GB free, edge-distributed, never pauses |
| Supabase Auth (email only free) | **Auth.js v5** | Free Google/GitHub/Facebook OAuth |
| Supabase Auth (phone=paid) | **Firebase Auth** | 10K phone verifications/month FREE |
| Supabase Realtime | **PocketBase** | Self-hosted, unlimited real-time |

### AI
| Current | Best Alternative | Why |
|---------|-----------------|-----|
| Groq Llama 3.3 70B (30/min) | **Together AI** | Same model, 60 req/min free |
| Google Gemini (60/min) | **Mistral API** | Free tier, better agri responses |
| DeepL (500K/mo) | **LibreTranslate** (self-host) | Unlimited, no API key, no limits |

### Media
| Current | Best Alternative | Why |
|---------|-----------------|-----|
| Cloudinary (25GB) | **Uploadcare** | 30GB, URL-based transforms |
| Cloudinary Video | **Mux** | 300 free video minutes, HLS |
| | **Bunny CDN** | 1TB free, video optimization |

### Email
| Current | Best Alternative | Why |
|---------|-----------------|-----|
| Mailchimp (500 contacts) | **Brevo** | 300 emails/day, unlimited contacts |
| | **Resend** | 100/day, modern React email, better DX |

### Payments
| Current | Best Alternative | Why |
|---------|-----------------|-----|
| Razorpay | **Instamojo** | Free onboarding, simpler API |

---

## 3-Deep API Redundancy (Every Function)

```
AI Advisory:     Groq (primary) → Gemini → Mistral → JeeVan KB (local)
Weather:         Open-Meteo (free) → OpenWeatherMap (1K/day) → WeatherAPI
Countries:       REST Countries → Countries API → CountryAPI  
Translation:     DeepL → LibreTranslate → MyMemory (free)
Market Rates:    Agmarknet → NCDEX → Cached DB
Payments:        Razorpay → WhatsApp fallback
Auth:            Supabase Auth → Firebase → Guest mode
Newsletter:      Mailchimp → Brevo → Supabase direct
Images:          Cloudinary → Uploadcare → Local /public
Video:           Cloudinary → Mux → Vimeo embed
```

---

## What You SHOULD Switch To (All Free, Better Results)

| Area | Switch | Benefit |
|------|--------|---------|
| Auth (Phone) | Add **Firebase Auth** | 10K free phone verifications |
| AI Backup | Add **Together AI** | Free Llama 3.3, 60 req/min |
| CSS | Switch to **UnoCSS** | 2x faster builds |
| Newsletter | Switch to **Brevo** | 300/day unlimited contacts |

---

## Total: $0/month
Every service listed has a genuine free tier. No trial, no credit card.
