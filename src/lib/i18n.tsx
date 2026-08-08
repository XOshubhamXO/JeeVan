'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

/* ── Comprehensive translation dictionary ── */
const STRINGS: Record<string, string> = {
  /* Nav / Common */
  'nav.skip': 'Skip',
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.hub': 'Hub',
  'nav.contact': 'Contact',
  'nav.blog': 'Blog',
  'nav.shop': 'Shop',
  'nav.pricing': 'Pricing',
  'nav.explore': 'Explore JeeVan',
  'footer.tagline': 'Vill-Mahamadpur, Nalanda, Bihar, India · Built with 🌱 by Shubham Saurabh',
  'footer.short': 'JeeVan · Nalanda, Bihar · 🌱 Shubham Saurabh',
  'footer.established': 'JeeVan · Vill-Mahamadpur, Nalanda, Bihar · 🌱 Shubham Saurabh · Est. 2024',

  /* Landing — Hero */
  'hero.headline': 'Grow with\nNature',
  'hero.subtitle': 'Sustainable agriculture, heirloom crops, and community farming — from Nalanda, Bihar to your table.',
  'hero.cta': 'Explore JeeVan',
  'hero.skip': 'Skip to content',

  /* Landing — Stats */
  'stats.plants': 'Plant Species',
  'stats.partners': 'Partners',
  'stats.countries': 'Countries',
  'stats.cost': 'Monthly Cost',

  /* Landing — Ventures */
  'ventures.heading': 'Our Ventures',
  'ventures.subtitle': 'From sapling to software — four ways JeeVan serves you.',
  'ventures.label': 'What We Offer',
  'ventures.learn_more': 'Learn more',
  'venture.nursery': 'Plant Nursery',
  'venture.nursery.desc': 'Heirloom saplings, indigenous seeds, and rare Magahi varieties from our Nalanda farm.',
  'venture.gardening': 'Gardening Services',
  'venture.gardening.desc': 'Rooftop gardens, living lawns, natural composting, and tool rentals.',
  'venture.tech': 'Tech Consulting',
  'venture.tech.desc': 'Custom software, web apps, PC builds, and startup infrastructure by B.Tech CSE.',
  'venture.studio': 'Creative Media',
  'venture.studio.desc': 'Professional photography, video production, and content creation.',

  /* Landing — Partners */
  'partners.heading': 'Ecosystem Partners',
  'partners.label': 'Trusted By',

  /* Landing — Causes */
  'causes.heading': 'What We Stand For',
  'causes.label': 'Social Causes',
  'cause.pedal4planet': 'Zero-emission transit',
  'cause.adira': 'Organic waste recycling',

  /* Landing — Onboarding steps */
  'onboarding.country': 'Country',
  'onboarding.language': 'Language',
  'onboarding.profile': 'Profile',

  /* Landing — Country Selection */
  'landing.title': 'Where in the world are you?',
  'landing.subtitle': 'Select your country to unlock localized crop recommendations and community connections.',
  'landing.search': 'Search countries...',
  'landing.agri_nations': 'Top Agricultural Nations',
  'landing.show_more': 'Show',
  'landing.more_countries': 'more countries',
  'landing.results': 'results',
  'landing.footer': 'JeeVan · Nalanda, Bihar · Built with love by Shubham Saurabh',

  /* Language & Theme */
  'lang.title': 'Choose your language',
  'lang.continue': 'Continue',
  'lang.back': 'Back',
  'theme.title': 'Choose your visual theme',
  'theme.light': 'Light',
  'theme.light_desc': 'High-contrast crisp natural paper feel.',
  'theme.dark': 'Dark',
  'theme.dark_desc': 'Deep obsidian with glowing biome elements.',
  'theme.nature': 'Dynamic Nature',
  'theme.nature_desc': 'Adapts in real-time to daylight, season, and weather.',

  /* Survey */
  'survey.title': 'Tell us about yourself',
  'survey.name': 'Your Name',
  'survey.age': 'Age (optional)',
  'survey.location': 'Detected Location',
  'survey.interest': 'What brings you to JeeVan?',
  'survey.enter_hub': 'Enter JeeVan Hub',
  'survey.natural_produce': 'Natural Produce',
  'survey.nursery_plants': 'Nursery Plants',
  'survey.tech_consulting': 'Tech and Consulting',
  'survey.partnerships': 'Partnerships',
  'survey.social_causes': 'Social Causes',

  /* Hub */
  'hub.greeting_morning': 'Good morning',
  'hub.greeting_afternoon': 'Good afternoon',
  'hub.greeting_evening': 'Good evening',
  'hub.welcome': 'Your unified platform for sustainable agriculture, natural living, and technology.',
  'hub.ventures': 'Our Ventures',
  'hub.partners': 'Ecosystem Partners',
  'hub.causes': 'Social Causes',
  'hub.directory': 'Plant Directory',
  'hub.advisory': 'AI Advisory',
  'hub.market': 'Market Rates',
  'hub.community': 'Community',
  'hub.learn_more': 'Learn more',

  /* About */
  'about.hero.label': 'Our Story',
  'about.hero.headline': 'From Desktop Computing\nto Sustainable Living',
  'about.hero.subtitle': "One B.Tech graduate's journey back to his ancestral village — and what grew from it.",
  'about.founder.name': 'Shubham Saurabh',
  'about.founder.title': 'Founder & Lead Engineer · B.Tech Computer Science',
  'about.story.p1': 'I left the screen for the soil. After completing my B.Tech in Computer Science, I returned to my ancestral village of Mahamadpur in Nalanda, Bihar — not to escape technology, but to apply it where it matters most: the land that feeds us.',
  'about.story.p2': 'JeeVan is the bridge between advanced software engineering and sustainable natural agriculture. Every line of code serves a plant. Every database query tracks soil health. Every API route connects a farmer to market prices.',
  'about.story.p3': 'What started as a personal journey became a community. Today, JeeVan serves farmers, gardeners, sustainability advocates, and tech innovators — all from this small village in Bihar.',
  'about.land.label': 'The Land',
  'about.land.heading': 'Where JeeVan Grows',
  'about.land.village': 'Village',
  'about.land.mauja': 'Mauja',
  'about.land.panchayat': 'Panchayat',
  'about.land.district': 'District',
  'about.land.state': 'State',
  'about.land.pin': 'PIN',
  'about.philosophy.label': 'Our Philosophy',
  'about.philosophy.heading': 'Three Pillars',
  'about.pillar.natural': 'Natural',
  'about.pillar.natural.desc': 'Chemical-free farming. Heirloom seeds. Indigenous knowledge meets modern soil science.',
  'about.pillar.technical': 'Technical',
  'about.pillar.technical.desc': 'Software, APIs, and platforms serving farmers. B.Tech CSE rigor applied to agriculture.',
  'about.pillar.social': 'Social',
  'about.pillar.social.desc': 'Community-first. Zero-emission transit. Circular bio-economy. Farming as a collective act.',
  'about.ventures.label': 'What We Do',
  'about.ventures.heading': 'Our Ventures',
  'about.cta.heading': 'Join the Community',
  'about.cta.subtitle': 'From Nalanda to the world — farmers, gardeners, and technologists growing together.',
  'about.cta.button': 'Explore JeeVan',

  /* Contact */
  'contact.label': 'Get in Touch',
  'contact.heading': 'Contact JeeVan',
  'contact.subtitle': 'Order saplings, inquire about services, or partner with us. We respond within 24 hours.',
  'contact.phone.label': 'Phone / WhatsApp',
  'contact.phone.value': '+91 9009790421',
  'contact.location.label': 'Visit Us',
  'contact.location.value': 'Vill-Mahamadpur, Nalanda, Bihar',
  'contact.email.label': 'Email',
  'contact.email.value': 'meshubham943@gmail.com',
  'contact.form.heading': 'Send a Message',
  'contact.form.name': 'Name',
  'contact.form.name.placeholder': 'Your name',
  'contact.form.interest': 'Interest',
  'contact.form.interest.select': 'Select...',
  'contact.form.interest.nursery': 'Plant Nursery / Saplings',
  'contact.form.interest.gardening': 'Gardening Services',
  'contact.form.interest.tech': 'Tech Consulting',
  'contact.form.interest.media': 'Creative Media',
  'contact.form.interest.partnership': 'Partnership',
  'contact.form.interest.other': 'Other',
  'contact.form.message': 'Message',
  'contact.form.message.placeholder': 'Tell us what you need...',
  'contact.form.submit': 'Send via WhatsApp',
  'contact.form.sent': "Message sent! We'll get back to you soon.",

  /* Shop */
  'shop.label': 'Shop',
  'shop.heading': 'JeeVan Store',
  'shop.subtitle': 'Saplings, seeds, and tools — from our Nalanda farm. Add to cart, order via WhatsApp.',
  'shop.add': 'Add',
  'shop.category.all': 'All',
  'shop.category.saplings': 'Saplings',
  'shop.category.seeds': 'Seeds',
  'shop.category.tools': 'Tools',
  'shop.category.services': 'Services',
  'shop.badge.bestseller': 'Bestseller',
  'shop.badge.premium': 'Premium',
  'shop.badge.new': 'New',

  /* Pricing */
  'pricing.label': 'Pricing',
  'pricing.heading': 'Venture Plans',
  'pricing.subtitle': 'Choose a plan that matches your venture size. All plans include platform access.',
  'pricing.cta': 'Get Started',

  /* Blog */
  'blog.label': 'Blog',
  'blog.heading': 'The JeeVan Journal',
  'blog.subtitle': 'Stories from the farm, tech insights, and sustainable living guides.',
  'blog.search': 'Search articles...',
  'blog.read_more': 'Read more',
  'blog.no_results': 'No articles match your search.',
  'blog.all_tags': 'All',

  /* Account */
  'account.heading': 'My Account',
  'account.profile': 'Profile',
  'account.orders': 'Orders',
  'account.save': 'Save Changes',
  'account.saved': 'Saved!',
  'account.logout': 'Sign Out',

  /* Admin */
  'admin.auth_title': 'Admin Authentication',
  'admin.authenticate': 'Authenticate',
  'admin.cancel': 'Cancel',
  'admin.invalid': 'Invalid passkey. Access denied.',
  'admin.alpha.title': 'Alpha Dashboard',
  'admin.beta.title': 'Beta Panel',
  'admin.beta.subtitle': 'PARTNER ADMIN',
  'admin.beta.redirecting': 'Redirecting...',
  'admin.beta.exit': 'Exit',
  'admin.beta.dashboard': 'Partner Dashboard',
  'admin.beta.restricted': 'You have restricted access to manage assigned venture content. All modifications are tracked and visible to the Master Admin.',
  'admin.beta.audited': 'Activity audited in real-time',
  'admin.beta.products': 'My Products',
  'admin.beta.media': 'Media',
  'admin.beta.pricing': 'Pricing',
  'admin.beta.history': 'Activity Log',

  /* Directory */
  'directory.title': 'Global Plant Directory',
  'directory.subtitle': '50+ species across 10 categories.',
  'directory.search': 'Search plants by name...',

  /* Newsletter */
  'newsletter.title': 'Stay Connected',
  'newsletter.subtitle': 'Get farm updates, new sapling arrivals, and sustainability tips.',
  'newsletter.placeholder': 'Your email address',
  'newsletter.subscribe': 'Subscribe',
  'newsletter.success': 'Subscribed! Welcome to the JeeVan community.',
  'newsletter.spam': 'No spam, ever. Unsubscribe anytime.',

  /* Cart */
  'cart.empty': 'Your cart is empty',
  'cart.checkout': 'Order via WhatsApp',
  'cart.total': 'Total',
  'cart.remove': 'Remove',
}

interface Ctx { t: (k: string) => string; lang: string; setLang: (l: string) => void; loading: boolean }

const I18nContext = createContext<Ctx>({ t: (k: string) => STRINGS[k] || k, lang: 'en', setLang: () => {}, loading: false })
export function useI18n() { return useContext(I18nContext) }

export function I18nProvider({ children, initialLang = 'en' }: { children: React.ReactNode; initialLang?: string }) {
  const [lang, setLangState] = useState(initialLang)
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setLang = useCallback(async (newLang: string) => {
    if (newLang === 'en') { setLangState('en'); setTranslations({}); return }
    setLangState(newLang); setLoading(true)
    const keys = Object.keys(STRINGS)
    const newT: Record<string, string> = {}
    const batch = 5
    for (let i = 0; i < keys.length; i += batch) {
      const b = keys.slice(i, i + batch)
      await Promise.all(b.map(async (k) => {
        try {
          const r = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: STRINGS[k], source: 'en', target: newLang }) })
          const d = await r.json()
          if (d.translatedText && d.translatedText !== STRINGS[k]) newT[k] = d.translatedText
        } catch {}
      }))
    }
    setTranslations(newT); setLoading(false)
  }, [])

  const t = useCallback((k: string) => {
    if (lang === 'en') return STRINGS[k] || k
    return translations[k] || STRINGS[k] || k
  }, [lang, translations])

  return <I18nContext.Provider value={{ t, lang, setLang, loading }}>{children}</I18nContext.Provider>
}
