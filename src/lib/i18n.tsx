'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

const STRINGS: Record<string, string> = {
  'landing.title': 'Where in the world are you?',
  'landing.subtitle': 'Select your country to unlock localized crop recommendations and community connections.',
  'landing.search': 'Search countries...',
  'landing.agri_nations': 'Top Agricultural Nations',
  'landing.show_more': 'Show',
  'landing.more_countries': 'more countries',
  'landing.results': 'results',
  'landing.footer': 'JeeVan \u00b7 Nalanda, Bihar \u00b7 Built with love by Shubham Saurabh',
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
  'directory.title': 'Global Plant Directory',
  'directory.subtitle': '50+ species across 10 categories.',
  'directory.search': 'Search plants by name...',
  'admin.auth_title': 'Admin Authentication',
  'admin.authenticate': 'Authenticate',
  'admin.cancel': 'Cancel',
  'admin.invalid': 'Invalid passkey. Access denied.',
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
