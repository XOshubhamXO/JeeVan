'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2, Languages, Leaf, Moon, Sun, X } from 'lucide-react'
import { useUserStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n'

const WORLD_LANGUAGES: Record<string, string> = {
  en: 'English', hi: 'हिन्दी', bn: 'বাংলা', es: 'Español', fr: 'Français',
  ar: 'العربية', pt: 'Português', ru: 'Русский', ja: '日本語', de: 'Deutsch',
  pa: 'ਪੰਜਾਬੀ', mr: 'मराठी', te: 'తెలుగు', ta: 'தமிழ்', ur: 'اردو',
  gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', or: 'ଓଡ଼ିଆ', zh: '中文',
  ko: '한국어', it: 'Italiano', tr: 'Türkçe', vi: 'Tiếng Việt', th: 'ไทย',
}

export default function FloatingController() {
  const { session, setLanguage, setTheme } = useUserStore()
  const { setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'lang' | 'theme'>('lang')

  const userLangs = session.selectedLanguages?.length ? session.selectedLanguages : ['en']
  const primary = userLangs[0]

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[250] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ background: open ? 'var(--accent-green)' : 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        {open ? <X className="w-5 h-5 text-white" /> : <Settings2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[250] w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl p-5 shadow-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            
            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              <button onClick={() => setTab('lang')} className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${tab === 'lang' ? 'bg-green-600/15 text-green-600' : 'opacity-45'}`}>
                <Languages className="w-3.5 h-3.5 inline mr-1" /> Languages
              </button>
              <button onClick={() => setTab('theme')} className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${tab === 'theme' ? 'bg-green-600/15 text-green-600' : 'opacity-45'}`}>
                <Leaf className="w-3.5 h-3.5 inline mr-1" /> Theme
              </button>
            </div>

            {tab === 'lang' ? (
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Toggle languages — tap to switch primary</p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {userLangs.map((l) => (
                    <button key={l}
                      onClick={() => {
                        setLanguage(l)
                        setLang(l)
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${l === primary ? 'bg-green-600/10 border border-green-500/20' : 'hover:bg-white/5'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${l === primary ? 'bg-green-600/20 text-green-600' : ''}`} style={{ background: l === primary ? undefined : 'var(--bg-secondary)' }}>
                          {l.toUpperCase()}
                        </span>
                        <span className="font-medium">{WORLD_LANGUAGES[l] || l}</span>
                      </div>
                      {l === primary && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,103,65,0.12)', color: 'var(--accent-green)' }}>Active</span>}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                  Re-configure on <span onClick={() => { window.location.href = '/' }} className="underline cursor-pointer hover:opacity-70">home page</span>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Switch theme</p>
                <div className="space-y-1.5">
                  {[
                    { id: 'light' as const, name: 'Light', icon: <Sun className="w-4 h-4" /> },
                    { id: 'dark' as const, name: 'Dark', icon: <Moon className="w-4 h-4" /> },
                    { id: 'nature' as const, name: 'Nature', icon: <Leaf className="w-4 h-4" /> },
                  ].map(t => (
                    <button key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${session.selectedTheme === t.id ? 'bg-green-600/10 border border-green-500/20' : 'hover:bg-white/5'}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>{t.icon}</div>
                      <span className="font-medium">{t.name}</span>
                      {session.selectedTheme === t.id && <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,103,65,0.12)', color: 'var(--accent-green)' }}>Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
