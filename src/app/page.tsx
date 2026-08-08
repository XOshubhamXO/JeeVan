'use client'
import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import CountrySelection from '@/components/onboarding/country-selection'
import LanguageThemeSelection from '@/components/onboarding/language-theme'
import MiniSurvey from '@/components/onboarding/survey'
import HiddenAdminEntry from '@/components/admin/hidden-entry'
import ErrorBoundary from '@/components/error-boundary'
import { useUserStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n'
import { ArrowDown, Sprout, Wrench, Monitor, Camera, ChevronRight, Heart, Star } from 'lucide-react'

const NatureEngine = dynamic(() => import('@/components/nature/nature-engine'), { ssr: false })
type Step = 'hero' | 'country' | 'language' | 'survey'

export default function HomePage() {
  const [step, setStep] = useState<Step>('hero')
  const [mounted, setMounted] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const countryRef = useRef<HTMLDivElement>(null)
  const { completeOnboarding } = useUserStore()
  const { t } = useI18n()
  const VID = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_URL : null

  useEffect(() => {
    setMounted(true)
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  if (!mounted) return <div className="min-h-screen" style={{ background: 'var(--cream)' }} />

  const V = [
    { id: 'nursery', n: t('venture.nursery'), d: t('venture.nursery.desc'), icon: <Sprout className="w-5 h-5" />, img: '/ventures-nursery.jpg', c: 'var(--earth)' },
    { id: 'gardening', n: t('venture.gardening'), d: t('venture.gardening.desc'), icon: <Wrench className="w-5 h-5" />, img: '/ventures-gardening.jpg', c: 'var(--gold)' },
    { id: 'tech', n: t('venture.tech'), d: t('venture.tech.desc'), icon: <Monitor className="w-5 h-5" />, img: '/ventures-tech.jpg', c: 'var(--earth-light)' },
    { id: 'studio', n: t('venture.studio'), d: t('venture.studio.desc'), icon: <Camera className="w-5 h-5" />, img: '/ventures-studio.jpg', c: 'var(--bark)' },
  ]

  const T = [
    { q: 'The Moringa saplings from JeeVan transformed our kitchen garden. The quality and planting guidance is unmatched.', a: 'Priya Sharma', l: 'Patna, Bihar', r: 5 },
    { q: 'From desktop to farm — Shubham\'s journey inspired me to start my own terrace garden. The tech consulting was spot-on.', a: 'Rahul Verma', l: 'Bengaluru', r: 5 },
    { q: 'Found heirloom seeds my grandmother grew but were lost for decades. JeeVan is preserving Bihar\'s agricultural heritage.', a: 'Anita Devi', l: 'Nalanda', r: 5 },
  ]

  const start = () => { setStep('country'); setHeroVisible(false) }
  const CT = [{ n: 'Pedal4Planet', d: t('cause.pedal4planet'), img: '/causes-pedal4planet.jpg' }, { n: 'Adira Biocycle', d: t('cause.adira'), img: '/causes-adira.jpg' }]

  return (
    <ErrorBoundary>
      <div className="relative w-full overflow-hidden" style={{ background: 'var(--cream)' }}>
        <AnimatePresence>
          {heroVisible && (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.9 }}>
              {/* ▸ CINEMATIC HERO — Apricot Lane inspired */}
              <div className="hero">
                {VID ? (
                  <video autoPlay muted loop playsInline className="hero-bg" src={VID} style={{ transform: `translate3d(0,${scrollY * 0.25}px,0)` }} />
                ) : (
                  <div className="hero-bg" style={{ backgroundImage: 'url(/nalanda-aerial.jpg)', transform: `translate3d(0,${scrollY * 0.25}px,0)` }} />
                )}
                <div className="hero-veil" />
                <div className="hero-body">
                  <a href="#main-content" className="absolute top-0 left-0 bg-[var(--earth)] text-white py-2.5 px-5 -translate-y-full focus:translate-y-0 z-50 text-sm font-medium" style={{ transition: 'transform 0.2s' }}>Skip to content</a>
                  <header className="absolute top-0 left-0 right-0 px-6 md:px-12 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>J</span>
                      <span className="text-white/45 text-[10px] uppercase tracking-[0.25em] font-medium">JeeVan</span>
                    </div>
                    <button onClick={start} className="text-white/55 hover:text-white text-xs uppercase tracking-[0.15em] font-medium transition-colors">Enter</button>
                  </header>
                  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.1 }}>
                    <p className="label text-white/40 mb-5 tracking-[0.25em]">Nalanda, Bihar &middot; Since 2021</p>
                    <h1 style={{ fontSize: 'clamp(2.75rem,7vw,6.5rem)', lineHeight: 1.04 }}>
                      Cultivating<br />Nature &amp; Technology
                    </h1>
                    <p className="text-base md:text-lg max-w-lg mx-auto mt-6 mb-10" style={{ lineHeight: 1.85 }}>
                      Sustainable agriculture, heirloom crops, and community farming — from Nalanda, Bihar to the world.
                    </p>
                    <button onClick={start} className="px-10 py-4 rounded-full text-white font-medium text-base transition-all duration-500 hover:scale-105" style={{ background: 'var(--earth)', boxShadow: '0 8px 40px rgba(74,103,65,0.45)' }}>
                      Explore JeeVan <ArrowDown className="w-4 h-4 ml-2" />
                    </button>
                  </motion.div>
                  <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/20">
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}><ArrowDown className="w-4 h-4" /></motion.div>
                    <span className="text-[8px] uppercase tracking-[0.3em]">Scroll</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!heroVisible && (
          <div className="relative z-10" ref={countryRef} role="main" id="main-content">
            <NatureEngine bgImage="/bg-gradient-4k.jpg">
              <div className="min-h-screen flex flex-col">
                <header className="px-6 md:px-10 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <span className="text-lg font-bold" style={{ color: 'var(--earth)', fontFamily: 'var(--font-display)' }}>J</span>
                    </div>
                    <span className="label">JeeVan</span>
                  </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {step === 'country' && <CountrySelection key="c" onNext={() => setStep('language')} />}
                    {step === 'language' && <LanguageThemeSelection key="l" onNext={() => setStep('survey')} />}
                    {step === 'survey' && <MiniSurvey key="s" onComplete={() => { completeOnboarding(); window.location.href = '/hub' }} />}
                  </AnimatePresence>
                </main>
              </div>
            </NatureEngine>
          </div>
        )}

        {/* ▸ VENTURES — Floret-style card grid */}
        <section className="py-28 md:py-40 px-6 md:px-12" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="label tracking-[0.25em]" style={{ color: 'var(--earth)' }}>{t('ventures.label')}</span>
              <h2 className="mt-4 mb-5">{t('ventures.heading')}</h2>
              <p className="lead max-w-lg mx-auto">{t('ventures.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {V.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative overflow-hidden cursor-pointer hover-lift" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div className="h-60 img-zoom">
                    <div className="img-inner w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${v.img})` }} />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(74,103,65,0.06)', color: v.c }}>{v.icon}</div>
                      <h3 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>{v.n}</h3>
                    </div>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.d}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: 'var(--earth)' }}>{t('ventures.learn_more')} <ChevronRight className="w-4 h-4" /></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ▸ TESTIMONIALS — Wicklow Way inspired */}
        <section className="py-28 md:py-40 px-6 md:px-12" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="label tracking-[0.25em]" style={{ color: 'var(--gold)' }}>Kind Words</span>
              <h2 className="mt-4">What People Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {T.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="testimonial">
                  <div className="flex gap-0.5 mb-3">{Array.from({ length: t.r }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--gold)' }} />)}</div>
                  <q>{t.q}</q>
                  <cite>{t.a} &mdash; {t.l}</cite>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ▸ PARTNERS + CAUSES */}
        <section className="py-28 md:py-40 px-6 md:px-12" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto text-center">
            <span className="label tracking-[0.25em]" style={{ color: 'var(--gold)' }}>{t('partners.label')}</span>
            <h2 className="mt-4 mb-12">{t('partners.heading')}</h2>
            <div className="press-strip mb-20">
              {['Madhopur Farmers Co.', 'Falcon Garden Tools', 'Ecoviha Industries', 'Humsafar RO', 'Madras Dosa House', 'SahG Greens', 'Aviraj Aviral Studio', 'Kumar Ent.', 'Prakash Ent.'].map(p => <span key={p}>{p}</span>)}
            </div>
            <span className="label tracking-[0.25em]" style={{ color: 'var(--earth)' }}>{t('causes.label')}</span>
            <h2 className="mt-4 mb-8">{t('causes.heading')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {CT.map(c => (
                <motion.div key={c.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden p-8 group" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity bg-cover bg-center" style={{ backgroundImage: `url(${c.img})` }} />
                  <Heart className="w-8 h-8 mb-4 relative z-10" style={{ color: 'var(--earth)' }} />
                  <h3 className="text-xl mb-2 relative z-10" style={{ fontFamily: 'var(--font-display)' }}>{c.n}</h3>
                  <p className="text-sm relative z-10" style={{ color: 'var(--text-secondary)' }}>{c.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ▸ NEWSLETTER — Floret-style */}
        <section className="py-28 md:py-40 px-6" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-lg mx-auto text-center">
            <h2 className="mb-4">Stay Connected</h2>
            <p className="lead mb-8">Seasonal guides, farm stories, and new arrivals — straight to your inbox. One email per month, no spam.</p>
            <form onSubmit={async (e) => { e.preventDefault(); const el = (e.target as HTMLFormElement).querySelector('input'); if (el) { const em = el.value; await fetch('/api/mailchimp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em }) }); el.value = ''; el.placeholder = 'Thank you!' } }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required placeholder="Your email" className="input flex-1" />
              <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </section>

        {/* ▸ FOOTER */}
        <footer className="py-14 px-6 text-center border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }} role="contentinfo">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl font-bold" style={{ color: 'var(--earth)', fontFamily: 'var(--font-display)' }}>J</span>
              <span className="label">JeeVan</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('footer.tagline')}</p>
            <nav className="flex justify-center gap-8 mt-5">
              <a href="/about" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>{t('nav.about')}</a>
              <a href="/blog" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>{t('nav.blog')}</a>
              <a href="/podcast" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>Podcast</a>
              <a href="/shop" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>{t('nav.shop')}</a>
              <a href="/contact" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>{t('nav.contact')}</a>
            </nav>
          </div>
        </footer>
      </div>
      <HiddenAdminEntry />
    </ErrorBoundary>
  )
}
