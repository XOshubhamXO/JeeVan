# JeeVan — Next Steps

> **v1.1.2** | **33 pages, 0 errors** | **$0/month**

---

## What Changed

### AI Fixed — Together AI REMOVED
Together AI requires $5 prepaid credit. Replaced with 2 genuinely free alternatives:

| Tier | Service | Free Limit | Card? |
|------|---------|-----------|-------|
| Primary | Groq | 30 req/min | No |
| Backup 1 | **Mistral AI** | 1B tokens/month | No (phone verify) |
| Backup 2 | **HuggingFace** | Serverless, 1000s models | No |
| Backup 3 | Gemini Flash | 1500 req/day | No |
| Backup 4 | JeeVan KB | Unlimited | N/A |

### Alpha Admin — Media Panel
New "Media" tab — view/edit/delete all site images. Add images, set paths, categories, alt text.

### Shop — 20 Products
Comprehensive catalog categorized: Saplings, Seeds, Tools, Services. Search + category counts.

### Images — 10 new
`grain-04-05`, `field-07-08-09`, `root-04-05`, `fungi-04`, `shop-seeds-01`, `shop-tools-01`

---

## Keys to Get (All FREE, No Credit Card)

| Service | Sign Up | Key Name |
|---------|---------|----------|
| **Mistral AI** | https://console.mistral.ai | `MISTRAL_API_KEY` |
| **HuggingFace** | https://huggingface.co/settings/tokens | `HUGGINGFACE_API_KEY` |
| Firebase Auth | https://console.firebase.google.com | `FIREBASE_API_KEY` |
| Brevo | https://brevo.com | `BREVO_API_KEY` |

---

## Supabase SQL (Run Once)

```sql
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  category TEXT DEFAULT 'uncategorized',
  alt_text TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT now()
);
```

Then seed images from Alpha → Media tab.

---

## Deploy

```bash
npm install --legacy-peer-deps
bash scripts/deploy.sh
```

Add new env vars to Vercel: `MISTRAL_API_KEY`, `HUGGINGFACE_API_KEY`

## Admin
Alpha: `JeeVan-Alpha-2024` · Beta: `JeeVan-Beta-2024`
