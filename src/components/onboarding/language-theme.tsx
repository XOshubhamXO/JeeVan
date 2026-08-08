'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Sun, Moon, Leaf, ArrowRight, Check, Globe } from 'lucide-react'
import { useUserStore, useCountryStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n'

const WORLD_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
]

const THEMES = [
  { id: 'light' as const, name: 'Light', icon: <Sun className="w-6 h-6" />, desc: 'Crisp, warm natural paper feel. High contrast for readability.', colors: ['#fdfaf5', '#f7f3eb', '#2c2416'] },
  { id: 'dark' as const, name: 'Dark', icon: <Moon className="w-6 h-6" />, desc: 'Deep obsidian with glowing botanical elements.', colors: ['#110e0a', '#18140d', '#e8e2d4'] },
  { id: 'nature' as const, name: 'Dynamic Nature', icon: <Leaf className="w-6 h-6" />, desc: 'Adapts in real-time to daylight, season, and weather.', colors: ['#f7f2e8', '#7d9b6e', '#1e1a14'] },
]

type Step = 'language' | 'theme'

export default function LanguageThemeSelection({ onNext }: { onNext: () => void }) {
  const { setLanguage, setLanguages, setTheme } = useUserStore()
  const { selectedCountry } = useCountryStore()
  const { setLang } = useI18n()
  const [step, setStep] = useState<Step>('language')
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['en'])
  const [selectedTheme, setSelectedTheme] = useState<string>('nature')

  // Generate country-specific languages at top
  const countryLangs = useMemo(() => {
    if (!selectedCountry?.languages?.length) return []
    return WORLD_LANGUAGES.filter(l => selectedCountry.languages!.includes(l.code))
  }, [selectedCountry])

  const handleLangToggle = (code: string) => {
    setSelectedLangs(prev => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev // Keep at least 1
        return prev.filter(l => l !== code)
      }
      return [...prev, code]
    })
  }

  const handleContinue = () => {
    if (selectedLangs.length >= 1) {
      setLanguage(selectedLangs[0])
      setLanguages(selectedLangs)
      setLang(selectedLangs[0])
      setStep('theme')
    }
  }

  const handleFinish = () => {
    setTheme(selectedTheme as 'light' | 'dark' | 'nature')
    setTimeout(onNext, 300)
  }

  const primaryLang = selectedLangs[0]
  const langInfo = WORLD_LANGUAGES.find(l => l.code === primaryLang)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-3xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {step === 'language' ? (
          <motion.div key="lang" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="text-center mb-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'rgba(196,155,74,0.07)', border: '1px solid rgba(196,155,74,0.12)' }}>
                <Languages className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'var(--font-display)' }}>Choose your languages</h1>
              <p className="lead max-w-md mx-auto mt-3">
                Pick 2 or more languages. Primary language will be used for translation. Toggle anytime.
              </p>

              {selectedLangs.length >= 1 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(196,155,74,0.08)', border: '1px solid rgba(196,155,74,0.15)' }}>
                    <Globe className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Primary: {langInfo?.native || primaryLang}</span>
                  </div>
                  <span className="text-[10px] block mt-2" style={{ color: 'var(--text-muted)' }}>
                    Selected: {selectedLangs.map(l => WORLD_LANGUAGES.find(w => w.code === l)?.name || l).join(', ')}
                  </span>
                </motion.div>
              )}

              <button onClick={handleContinue} disabled={selectedLangs.length < 1}
                className="mt-6 px-8 py-3 rounded-full text-white font-medium text-sm transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                style={{ background: 'var(--accent-green)', boxShadow: '0 4px 20px rgba(74,103,65,0.3)' }}>
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Country languages first */}
            {countryLangs.length > 0 && (
              <section className="mb-8">
                <p className="label mb-3">Languages of {selectedCountry?.name || 'your country'}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {countryLangs.map(l => (
                    <LanguageCard key={l.code} lang={l} selected={selectedLangs.includes(l.code)} primary={selectedLangs[0] === l.code} onToggle={handleLangToggle} />
                  ))}
                </div>
              </section>
            )}

            {/* All world languages */}
            <section>
              <p className="label mb-3">World Languages</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {WORLD_LANGUAGES.filter(l => !countryLangs.some(c => c.code === l.code)).map(l => (
                  <LanguageCard key={l.code} lang={l} selected={selectedLangs.includes(l.code)} primary={selectedLangs[0] === l.code} onToggle={handleLangToggle} />
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="text-center mb-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'rgba(74,103,65,0.07)', border: '1px solid rgba(74,103,65,0.12)' }}>
                {selectedTheme === 'light' ? <Sun className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} />
                  : selectedTheme === 'dark' ? <Moon className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} />
                    : <Leaf className="w-8 h-8" style={{ color: 'var(--accent-green)' }} />}
              </motion.div>
              <h1 style={{ fontFamily: 'var(--font-display)' }}>Choose your theme</h1>
              <p className="lead max-w-md mx-auto mt-3">Pick the visual experience that feels right to you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {THEMES.map(t => (
                <motion.button key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTheme(t.id)}
                  className="p-6 rounded-2xl border transition-all duration-300 text-left"
                  style={{
                    background: selectedTheme === t.id ? 'rgba(74,103,65,0.06)' : 'var(--bg-surface)',
                    borderColor: selectedTheme === t.id ? 'rgba(74,103,65,0.3)' : 'var(--border-subtle)',
                    boxShadow: selectedTheme === t.id ? '0 4px 24px rgba(74,103,65,0.1)' : 'none',
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedTheme === t.id ? 'rgba(74,103,65,0.1)' : 'var(--bg-secondary)', color: t.id === 'light' ? 'var(--accent-gold)' : t.id === 'dark' ? '#8a8af0' : 'var(--accent-green)' }}>
                      {t.icon}
                    </div>
                    {selectedTheme === t.id && <Check className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />}
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-display)' }}>{t.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
                  <div className="flex gap-1.5 mt-3">
                    {t.colors.map((col, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white/20" style={{ background: col }} />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <button onClick={handleFinish}
                className="px-8 py-3 rounded-full text-white font-medium text-sm transition-all hover:scale-105"
                style={{ background: 'var(--accent-green)', boxShadow: '0 4px 20px rgba(74,103,65,0.3)' }}>
                Enter JeeVan <Leaf className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function LanguageCard({ lang, selected, primary, onToggle }: { lang: { code: string; name: string; native: string }; selected: boolean; primary: boolean; onToggle: (code: string) => void }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onToggle(lang.code)}
      className="p-3 rounded-xl border transition-all duration-200 text-left flex items-center gap-2.5"
      style={{
        background: primary ? 'rgba(74,103,65,0.1)' : selected ? 'rgba(74,103,65,0.05)' : 'var(--bg-surface)',
        borderColor: primary ? 'rgba(74,103,65,0.35)' : selected ? 'rgba(74,103,65,0.2)' : 'var(--border-subtle)',
      }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
        {lang.code.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{lang.name}</p>
        {lang.native !== lang.name && <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{lang.native}</p>}
      </div>
      {primary && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,103,65,0.12)', color: 'var(--accent-green)' }}>1st</span>}
      {selected && !primary && <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-green)' }} />}
    </motion.button>
  )
}
