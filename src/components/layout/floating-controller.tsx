'use client'

/**
 * JeeVan Floating Language & Theme Toggle
 *
 * Persistent floating button (bottom-right) for reconfiguring
 * language preferences and theme at any time during the session.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Settings2, Sun, Moon, Leaf } from 'lucide-react'
import { useUserStore, type ThemeType } from '@/lib/store'
import { useI18n } from '@/lib/i18n'

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bh', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
]

const THEMES: { id: ThemeType; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { id: 'nature', label: 'Nature', icon: <Leaf className="w-4 h-4" /> },
]

export default function FloatingController() {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<'lang' | 'theme'>('lang')
  const { session, setLanguage, setTheme } = useUserStore()
  const { setLang } = useI18n()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-16 right-0 w-72 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden mb-4"
            >
              {/* Tab Switcher */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setTab('lang')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    tab === 'lang' ? 'text-green-400 border-b-2 border-green-400' : 'opacity-50'
                  }`}
                >
                  <Languages className="w-4 h-4 inline mr-1" /> Language
                </button>
                <button
                  onClick={() => setTab('theme')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    tab === 'theme' ? 'text-green-400 border-b-2 border-green-400' : 'opacity-50'
                  }`}
                >
                  <Settings2 className="w-4 h-4 inline mr-1" /> Theme
                </button>
              </div>

              {/* Content */}
              <div className="max-h-64 overflow-y-auto p-2">
                {tab === 'lang' ? (
                  LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLang(lang.code)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        session.selectedLanguage === lang.code
                          ? 'bg-green-600/30 text-green-300'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">
                        {lang.nativeName.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{lang.name}</p>
                        <p className="text-xs opacity-50">{lang.nativeName}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        session.selectedTheme === theme.id
                          ? 'bg-purple-600/30 text-purple-300'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme.id === 'light' ? 'bg-amber-100 text-amber-800' :
                        theme.id === 'dark' ? 'bg-gray-700 text-gray-200' :
                        'bg-green-800 text-green-300'
                      }`}>
                        {theme.icon}
                      </span>
                      <span className="font-medium text-sm">{theme.label}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border transition-all ${
            isOpen
              ? 'bg-green-600 border-green-400 rotate-45'
              : 'bg-black/60 backdrop-blur-xl border-white/20 hover:bg-black/80'
          }`}
        >
          <Settings2 className="w-6 h-6" />
        </motion.button>
      </div>
    </>
  )
}
