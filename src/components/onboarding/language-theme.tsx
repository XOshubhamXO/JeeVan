'use client'

/**
 * JeeVan Language & Theme Selection
 *
 * Presents major regional languages based on selected country,
 * then offers theme customization (Light/Dark/Nature Dynamic).
 */

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Languages, Sun, Moon, Leaf, Check, ArrowRight } from 'lucide-react'
import { useUserStore, type ThemeType } from '@/lib/store'
import { useI18n } from '@/lib/i18n'

// ─── Country → Language mapping ───
const COUNTRY_LANGUAGES: Record<string, { code: string; name: string; nativeName: string }[]> = {
  IN: [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bh', name: 'Bihari / Maithili', nativeName: 'मैथिली' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  CN: [
    { code: 'zh', name: 'Mandarin', nativeName: '中文' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
  US: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
  ],
  BR: [
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ],
}

const DEFAULT_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
]

const THEMES: { id: ThemeType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'light',
    label: 'Light',
    icon: <Sun className="w-6 h-6" />,
    description: 'High-contrast crisp natural paper feel.',
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: <Moon className="w-6 h-6" />,
    description: 'Deep obsidian with glowing biome elements.',
  },
  {
    id: 'nature',
    label: 'Dynamic Nature',
    icon: <Leaf className="w-6 h-6" />,
    description: 'Adapts in real-time to daylight, season, and weather.',
  },
]

interface LanguageThemeProps {
  onNext: () => void
}

export default function LanguageThemeSelection({ onNext }: LanguageThemeProps) {
  const { session, setLanguage, setTheme } = useUserStore()
  const { setLang } = useI18n()
  const [selectedLang, setSelectedLang] = useState(session.selectedLanguage)
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(session.selectedTheme)
  const [step, setStep] = useState<'language' | 'theme'>('language')

  const languages = useMemo(
    () => COUNTRY_LANGUAGES[session.countryCode] || DEFAULT_LANGUAGES,
    [session.countryCode],
  )

  const handleLanguageNext = () => {
    setLanguage(selectedLang)
    setLang(selectedLang)
    setStep('theme')
  }

  const handleThemeNext = () => {
    setTheme(selectedTheme)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto px-4 py-12"
    >
      {step === 'language' ? (
        <>
          {/* Language Selection */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-900/20 backdrop-blur-md border border-blue-700/30 mb-6"
            >
              <Languages className="w-10 h-10 text-blue-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              Choose your language
            </h1>
            <p className="text-lg opacity-70">
              We&apos;ll translate JeeVan into your preferred language.
            </p>
            {session.countryName && (
              <p className="mt-2 text-sm opacity-50">
                Showing languages for {session.countryName}
              </p>
            )}
          </div>

          <div className="grid gap-3 mb-8">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  selectedLang === lang.code
                    ? 'bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg bg-white/10">
                  {lang.nativeName.charAt(0)}
                </span>
                <div className="text-left flex-1">
                  <p className="font-medium">{lang.name}</p>
                  <p className="text-sm opacity-60">{lang.nativeName}</p>
                </div>
                {selectedLang === lang.code && (
                  <Check className="w-5 h-5 text-blue-400" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-end">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLanguageNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition-colors font-medium"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </>
      ) : (
        <>
          {/* Theme Selection */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-900/20 backdrop-blur-md border border-purple-700/30 mb-6"
            >
              <Leaf className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              Choose your visual theme
            </h1>
            <p className="text-lg opacity-70">
              Pick how you want JeeVan to look and feel.
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {THEMES.map((theme) => (
              <motion.button
                key={theme.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTheme(theme.id)}
                className={`flex items-center gap-5 p-5 rounded-xl border transition-all text-left ${
                  selectedTheme === theme.id
                    ? 'bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  theme.id === 'light' ? 'bg-amber-100 text-amber-700' :
                  theme.id === 'dark' ? 'bg-gray-800 text-gray-200' :
                  'bg-green-900 text-green-400'
                }`}>
                  {theme.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{theme.label}</p>
                  <p className="text-sm opacity-60">{theme.description}</p>
                </div>
                {selectedTheme === theme.id && (
                  <Check className="w-5 h-5 text-purple-400" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep('language')}
              className="px-4 py-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              ← Back to languages
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleThemeNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition-colors font-medium"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  )
}
