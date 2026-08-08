# JeeVan — Changelog
> **v1.1.8** | **$0/month** | **33 pages, 0 errors** | **112 images**

## v1.1.8 — Onboarding Rebuilt from Scratch

### Country Selection — Map+Flag Hover
- **SVG map outline** fills background when hovering any country
- **Flag embedded** inside animated rings at center of map
- **Top 20 agricultural nations** prominently displayed first
- **"Confirm & Continue"** button after country selection with visual feedback
- **Search** across all 195 countries
- **Expandable list** of remaining 175 countries

### Language Selection — Multi-Language
- **Country-specific languages** shown first (auto-detected)
- **28 world languages** with native script names
- **Pick 2+ languages** — primary language marked "1st"
- Selected languages shown in pill with "Active" indicator

### Theme Selection
- **3 themes**: Light (warm paper), Dark (obsidian), Nature (dynamic)
- Color swatch preview for each theme
- Theme persists via Zustand + localStorage

### Floating Controller — Live Toggle
- **Bottom-right FAB**: Language switch + theme reconfig
- Tap language → sets primary instantly
- Theme toggle with visual feedback
- Reconfigure link back to home page

### Store Update
- `selectedLanguages: string[]` added — multi-language support
- `setLanguages()` method — bulk update language list

## Platform
14 pages · 16 APIs · 25 components · 53 plants · 25 shop products · 112 images · 33 compiled
