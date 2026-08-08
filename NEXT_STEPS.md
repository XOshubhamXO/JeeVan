# JeeVan — Next Steps

> **v1.1.1** | **33 pages, 0 errors**

---

## What Changed — Firebase + Together AI + Brevo

### 1. Firebase Auth (FREE phone auth)
- `/api/auth/login` now uses Firebase Identity Toolkit for phone + email
- **10,000 free phone verifications/month** (vs Supabase: paid only)
- Fallback chain: Firebase → Supabase (email only) → Guest mode
- Set `FIREBASE_API_KEY` on Vercel to activate

### 2. Together AI (FREE backup AI)
- `/api/ai` now has 4-deep fallback: Groq → Together AI → Gemini → JeeVan KB
- **Together AI** offers free Llama 3.3 at 60 req/min (vs Groq: 30/min)
- Set `TOGETHER_AI_API_KEY` on Vercel to activate

### 3. Brevo (FREE email marketing)
- `/api/newsletter` — New endpoint: Brevo → Mailchimp → Supabase
- **300 emails/day, unlimited contacts** (vs Mailchimp: 500 contacts limit)
- Set `BREVO_API_KEY` + `BREVO_LIST_ID` on Vercel to activate

---

## Keys to Get (All FREE)

| Service | Sign Up At | Key Name |
|---------|-----------|----------|
| Firebase Auth | https://console.firebase.google.com | `FIREBASE_API_KEY` |
| Together AI | https://api.together.xyz | `TOGETHER_AI_API_KEY` |
| Brevo | https://www.brevo.com | `BREVO_API_KEY`, `BREVO_LIST_ID=2` |

---

## Deploy

```bash
npm install --legacy-peer-deps
bash scripts/deploy.sh
```

Then add the 3 new env vars to Vercel and redeploy.

---

## Image File Map

```
field-01..06 (6 ornamental/field plants)
fungi-01..03 (3 mushroom varieties)
grain-01..03  (3 cereal crops)
root-01..03   (3 roots/rhizomes)
```
Generate more with next numbers — no overwrites.

## Admin
Alpha: `JeeVan-Alpha-2024` · Beta: `JeeVan-Beta-2024`
