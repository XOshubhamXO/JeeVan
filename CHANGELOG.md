# JeeVan — Changelog

> **v1.3.0** | **100% CORE** | **$0/month**

---

## v1.3.0 — 2026-08-08 (Current)

### Admin Panel — Complete Rewrite
- **8 tabs**: Ventures, Plants, Shop Inventory, Reviews, Beta Admins, Users, Audit, API Health
- **Beta admin management**: Create/delete partner admins from Alpha panel
- **Shop inventory**: Add/edit/delete products — synced to Supabase
- **Image management**: Every item shows image path — editable from panel
- **User tracking**: Live visitor data table with name, country, language, theme, interest
- **Unified API**: `/api/admin/manage` handles all CRUD (ventures, plants, shop, testimonials, admins)

### Shop — Supabase-Backed
- Products now pull from `shop_products` table (live data)
- Falls back to 6 hardcoded items if DB empty
- Admin panel can add/edit/delete products in real-time

### 8 New AI Images Generated
- ventures-nursery, ventures-gardening, ventures-tech, ventures-studio
- nalanda-aerial, hero-farm, hero-crops, hero-community, causes-pedal4planet, causes-adira

### Auth Fix
- Phone auth: Switched from Supabase (paid) to custom REST + free fallback
- Added "Continue as Guest" button
- Firebase-compatible OTP design (free tier: 10K phone/mo)

### Tech Stack Audit
- `TECH_STACK.md` — Full audit of all 20+ services, alternatives, redundancy

---

## Platform State

| Area | v1.2.0 | v1.3.0 |
|------|--------|--------|
| Pages | 14 | 14 |
| APIs | 14 | 15 (+admin/manage) |
| Components | 25 | 24 (alpha-dashboard rebuilt) |
| Admin Tabs | 4 | 8 |
| Images | 35 | 43 (+8 generated) |
| Build Errors | 0 | 0 |
| Pages Compiled | 31 | 32 |
