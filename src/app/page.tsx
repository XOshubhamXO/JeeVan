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
const VID = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_URL

export default function HomePage() {
  const [step, setStep] = useState<Step>('hero')
  const [mounted, setMounted] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const countryRef = useRef<HTMLDivElement>(null)
  const { completeOnboarding } = useUserStore()
  const { t } = useI18n()

  useEffect(() => { setMounted(true); const h = () => setScrollY(window.scrollY); window.addEventListener('scroll', h, {passive:true}); return () => window.removeEventListener('scroll', h) }, [])
  if (!mounted) return <div className="min-h-screen" style={{background:'var(--bg-cream)'}}/>

  const VENTURES = [
    { id:'nursery', name:t('venture.nursery'), desc:t('venture.nursery.desc'), icon:<Sprout className="w-5 h-5"/>, img:'/ventures-nursery.jpg', color:'var(--accent-green)' },
    { id:'gardening', name:t('venture.gardening'), desc:t('venture.gardening.desc'), icon:<Wrench className="w-5 h-5"/>, img:'/ventures-gardening.jpg', color:'var(--accent-gold)' },
    { id:'tech', name:t('venture.tech'), desc:t('venture.tech.desc'), icon:<Monitor className="w-5 h-5"/>, img:'/ventures-tech.jpg', color:'var(--accent-sage)' },
    { id:'studio', name:t('venture.studio'), desc:t('venture.studio.desc'), icon:<Camera className="w-5 h-5"/>, img:'/ventures-studio.jpg', color:'#8a5a9e' },
  ]

  const TESTIMONIALS = [
    { text:'JeeVan\'s Moringa saplings transformed our kitchen garden. The quality and guidance is unmatched.', author:'Priya Sharma', loc:'Patna, Bihar', rating:5 },
    { text:'From desktop to farm — Shubham\'s journey inspired me to start my own organic terrace garden. The tech consulting was spot-on.', author:'Rahul Verma', loc:'Bengaluru', rating:5 },
    { text:'The heirloom seed collection is extraordinary. Found varieties my grandmother used to grow but were lost for decades.', author:'Anita Devi', loc:'Nalanda', rating:5 },
  ]

  const startOnboarding = () => { setStep('country'); setHeroVisible(false) }

  return (
    <ErrorBoundary>
      <div className="relative w-full overflow-hidden" style={{background:'var(--bg-cream)'}}>
        <AnimatePresence>
          {heroVisible && (
            <motion.div key="hero" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-30}} transition={{duration:0.8}}>
              {/* ─── CINEMATIC HERO — Apricot Lane inspired ─── */}
              <div className="hero-section">
                {VID ? (
                  <video autoPlay muted loop playsInline className="video-hero" src={VID} style={{transform:`translate3d(0,${scrollY*0.3}px,0)`}}/>
                ) : (
                  <div className="hero-bg" style={{backgroundImage:'url(/nalanda-aerial.jpg)',transform:`translate3d(0,${scrollY*0.3}px,0)`}}/>
                )}
                <div className="hero-overlay"/>
                <div className="hero-content px-6">
                  <a href="#main-content" className="skip-link">Skip to content</a>
                  <header className="absolute top-0 left-0 right-0 px-6 md:px-10 py-6 flex items-center justify-between z-20">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white" style={{fontFamily:'var(--font-display)'}}>J</span>
                      <span className="text-white/60 text-xs uppercase tracking-widest">JeeVan</span>
                    </div>
                    <button onClick={startOnboarding} className="text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors">Enter</button>
                  </header>
                  <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:1}}>
                    <p className="label text-white/50 mb-4 tracking-[0.2em]">Nalanda, Bihar · Est. 2021</p>
                    <h1 className="text-white mb-6 max-w-3xl" style={{fontSize:'clamp(2.75rem,7vw,6.5rem)',lineHeight:1.05}}>
                      Cultivating<br/>Nature &amp; Technology
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 max-w-lg mx-auto mb-10" style={{lineHeight:1.8}}>
                      {t('hero.subtitle')}
                    </p>
                    <button onClick={startOnboarding} className="px-10 py-4 rounded-full text-white font-medium text-base transition-all duration-500 hover:scale-105" style={{background:'var(--accent-green)',boxShadow:'0 8px 40px rgba(74,103,65,0.4)'}}>
                      Explore JeeVan <ArrowDown className="w-4 h-4 ml-2"/>
                    </button>
                  </motion.div>
                  <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/25">
                    <motion.div animate={{y:[0,10,0]}} transition={{duration:2.5,repeat:Infinity}}><ArrowDown className="w-5 h-5"/></motion.div>
                    <span className="text-[9px] uppercase tracking-[0.25em]">Scroll</span>
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                      <span className="text-lg font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>J</span>
                    </div>
                    <span className="label">JeeVan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {(['country','language','survey'] as Step[]).map((_,i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${i < ['country','language','survey'].indexOf(step) ? 'bg-green-500' : i === ['country','language','survey'].indexOf(step) ? 'bg-green-400 animate-pulse' : 'bg-white/15'}`}/>
                      </div>
                    ))}
                  </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {step==='country' && <CountrySelection key="c" onNext={()=>setStep('language')}/>}
                    {step==='language' && <LanguageThemeSelection key="l" onNext={()=>setStep('survey')}/>}
                    {step==='survey' && <MiniSurvey key="s" onComplete={()=>{completeOnboarding();window.location.href='/hub'}}/>}
                  </AnimatePresence>
                </main>
              </div>
            </NatureEngine>
          </div>
        )}

        {/* ─── VENTURES — Floret-style elegant cards ─── */}
        <section className="py-24 md:py-36 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="label tracking-[0.2em]" style={{color:'var(--accent-green)'}}>{t('ventures.label')}</span>
              <h2 style={{fontFamily:'var(--font-display)'}} className="mt-4 mb-4">{t('ventures.heading')}</h2>
              <p className="lead max-w-xl mx-auto">{t('ventures.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VENTURES.map((v,i)=>(
                <motion.div key={v.id} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{delay:i*0.1,duration:0.6}}
                  className="group relative overflow-hidden cursor-pointer hover-lift" style={{borderRadius:'20px',background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                  <div className="h-56 overflow-hidden hover-zoom-img"><div className="bg-image w-full h-full transition-transform duration-800" style={{backgroundImage:`url(${v.img})`}}/></div>
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(74,103,65,0.06)',color:v.color}}>{v.icon}</div><h3 style={{fontFamily:'var(--font-display)'}} className="text-xl">{v.name}</h3></div>
                    <p className="text-sm mb-5 leading-relaxed" style={{color:'var(--text-secondary)'}}>{v.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2 transition-all" style={{color:'var(--accent-green)'}}>{t('ventures.learn_more')} <ChevronRight className="w-4 h-4"/></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS — Wicklow Way inspired ─── */}
        <section className="py-24 md:py-36 px-6 md:px-10" style={{background:'var(--bg-primary)'}}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="label tracking-[0.2em]" style={{color:'var(--accent-gold)'}}>Kind Words</span>
              <h2 style={{fontFamily:'var(--font-display)'}} className="mt-4">What People Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="testimonial-block">
                  <div className="flex gap-0.5 mb-3">{Array.from({length:t.rating}).map((_,j)=><Star key={j} className="w-3.5 h-3.5 fill-current" style={{color:'var(--accent-gold)'}}/>)}</div>
                  <p>&ldquo;{t.text}&rdquo;</p>
                  <cite>{t.author} — {t.loc}</cite>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PARTNERS + CAUSES ─── */}
        <section className="py-24 md:py-36 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
          <div className="max-w-6xl mx-auto text-center">
            <span className="label tracking-[0.2em]" style={{color:'var(--accent-gold)'}}>{t('partners.label')}</span>
            <h2 style={{fontFamily:'var(--font-display)'}} className="mt-4 mb-12">{t('partners.heading')}</h2>
            <div className="press-scroll mb-16">
              {['Madhopur Farmers Co.','Falcon Garden Tools','Ecoviha Industries','Humsafar RO','Madras Dosa House','SahG Greens','Aviraj Aviral Studio','Kumar Enterprises','Prakash Enterprises'].map(p=>(<span key={p}>{p}</span>))}
            </div>
            <span className="label tracking-[0.2em]" style={{color:'var(--accent-green)'}}>{t('causes.label')}</span>
            <h2 style={{fontFamily:'var(--font-display)'}} className="mt-4 mb-8">{t('causes.heading')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[{name:'Pedal4Planet',desc:t('cause.pedal4planet'),img:'/causes-pedal4planet.jpg'},{name:'Adira Biocycle',desc:t('cause.adira'),img:'/causes-adira.jpg'}].map(c=>(
                <motion.div key={c.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative overflow-hidden p-8 group cursor-pointer" style={{borderRadius:'20px',background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                  <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity bg-cover bg-center" style={{backgroundImage:`url(${c.img})`}}/>
                  <Heart className="w-8 h-8 mb-4 relative z-10" style={{color:'var(--accent-green)'}}/>
                  <h3 style={{fontFamily:'var(--font-display)'}} className="text-xl mb-2 relative z-10">{c.name}</h3>
                  <p className="text-sm relative z-10" style={{color:'var(--text-secondary)'}}>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER — Floret-style signup ─── */}
        <section className="py-24 md:py-36 px-6" style={{background:'var(--bg-primary)'}}>
          <div className="max-w-lg mx-auto text-center">
            <h2 style={{fontFamily:'var(--font-display)'}} className="mb-4">Stay Connected</h2>
            <p className="lead mb-8">Seasonal planting guides, farm stories, and new arrivals — straight to your inbox. No spam, ever.</p>
            <form onSubmit={async(e)=>{e.preventDefault();const el=(e.target as HTMLFormElement).querySelector('input');if(el){const em=el.value;await fetch('/api/mailchimp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:em})});el.value='';el.placeholder='Thank you!'}}}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required placeholder="Your email address" className="input flex-1"/>
              <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </section>

        <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)',background:'var(--bg-primary)'}} role="contentinfo">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>J</span>
              <span className="label">JeeVan</span>
            </div>
            <p className="small">{t('footer.tagline')}</p>
            <nav className="flex justify-center gap-8 mt-5">
              <a href="/about" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.about')}</a>
              <a href="/blog" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.blog')}</a>
              <a href="/podcast" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Podcast</a>
              <a href="/shop" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.shop')}</a>
              <a href="/contact" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.contact')}</a>
            </nav>
          </div>
        </footer>
      </div>
      <HiddenAdminEntry />
    </ErrorBoundary>
  )
}
