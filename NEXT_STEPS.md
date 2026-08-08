# JeeVan — Next Steps

> **v1.6.1** | **Visual Rebuild Complete**

---

## What Changed — Visual Overhaul

The entire visual identity rebuilt from scratch. References used:
- **Floret Flowers** → Serif typography, cream/white space, elegant photography cards, newsletter signup
- **Apricot Lane Farms** → Cinematic video hero, parallax scroll, documentary narrative
- **Wicklow Way Wines** → Testimonial carousel, rustic deep palette, "As Seen In" partner strip

### CSS completely rewritten (`src/app/globals.css`)
- Warm cream primary background instead of harsh black
- Playfair Display serif headings (Floret style)
- 3 themes: Light (cream), Dark (espresso), Nature (organic)
- Cinematic hero with parallax video/image
- Testimonial blocks with left green border

### Landing page rebuilt (`src/app/page.tsx`)
- Full-screen video hero with parallax
- Venture cards with hover-zoom imagery
- 3 testimonials with star ratings
- Partner press-logo strip
- Newsletter signup section
- Causes + footer

---

## Deploy

```bash
npm install --legacy-peer-deps
bash scripts/deploy.sh
```

## Image Naming Convention
New images use numbered names: `field-01.jpg`, `grain-01.jpg`, `root-01.jpg` etc.
When regenerating, increment the number (`field-02`, `field-03`) — no overwrites.

## Remaining Image Generation
20 SVG placeholders in `public/plants/` need JPG replacements. Generate in batches of 5 per session using the `generate_image` tool.

---

## Admin
| Panel | Passkey |
|-------|---------|
| Alpha (`/admin/alpha`) | `JeeVan-Alpha-2024` |
| Beta (`/admin/beta`) | `JeeVan-Beta-2024` |
