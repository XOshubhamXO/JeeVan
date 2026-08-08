'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import CountrySelection from '@/components/onboarding/country-selection'
import LanguageThemeSelection from '@/components/onboarding/language-theme'
import MiniSurvey from '@/components/onboarding/survey'
import HiddenAdminEntry from '@/components/admin/hidden-entry'
import ErrorBoundary from '@/components/error-boundary'
import ParallaxHero from '@/components/parallax-hero'
import { useUserStore } from '@/lib/store'
import { ArrowDown, Sprout, Wrench, Monitor, Camera, ChevronRight, Heart } from 'lucide-react'

const NatureEngine = dynamic(() => import('@/components/nature/nature-engine'), { ssr: false })
type Step = 'hero' | 'country' | 'language' | 'survey'

const VENTURES = [
  { id:'nursery', name:'Plant Nursery', desc:'Heirloom saplings, indigenous seeds, and rare Magahi varieties from our Nalanda farm.', icon:<Sprout className="w-5 h-5"/>, img:'/nalanda-nursery.jpg', color:'var(--accent-green)' },
  { id:'gardening', name:'Gardening Services', desc:'Rooftop gardens, living lawns, natural composting, and tool rentals.', icon:<Wrench className="w-5 h-5"/>, img:'/ventures-gardening.jpg', color:'var(--accent-gold)' },
  { id:'tech', name:'Tech Consulting', desc:'Custom software, web apps, PC builds, and startup infrastructure by B.Tech CSE.', icon:<Monitor className="w-5 h-5"/>, img:'/ventures-tech.jpg', color:'var(--accent-sage)' },
  { id:'studio', name:'Creative Media', desc:'Professional photography, video production, and content creation.', icon:<Camera className="w-5 h-5"/>, img:'/ventures-studio.jpg', color:'#8a5a9e' },
]
const PARTNERS = ['Madhopur Farmers Producer Co. (IFFCO/YARA/Katyayani)','Falcon Garden Tools','Ecoviha Industries','Humsafar RO Water','Madras Dosa House','SahG Greens','Aviraj Aviral Digital Studio','Kumar Enterprises','Prakash Enterprises']
const CAUSES = [{ name:'Pedal4Planet', desc:'Zero-emission transit', img:'/causes-pedal4planet.jpg' },{ name:'Adira Biocycle', desc:'Organic waste recycling', img:'/causes-adira.jpg' }]
const STATS = [{ value:'164+', label:'Plant Species' },{ value:'13', label:'Partners' },{ value:'30', label:'Countries' },{ value:'$0', label:'Monthly Cost' }]

export default function HomePage() {
  const [step, setStep] = useState<Step>('hero')
  const [mounted, setMounted] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const countryRef = useRef<HTMLDivElement>(null)
  const { completeOnboarding } = useUserStore()
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="min-h-screen" style={{background:'var(--bg-primary)'}} />

  const scrollToCountry = () => { setStep('country'); setHeroVisible(false); setTimeout(() => countryRef.current?.scrollIntoView({ behavior: 'smooth' }), 100) }
  const startOnboarding = () => { setStep('country'); setHeroVisible(false) }

  return (
    <ErrorBoundary>
      <div className="relative w-full overflow-hidden" style={{background:'var(--bg-primary)'}}>
        <AnimatePresence>
          {heroVisible && (
            <motion.div key="hero" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-30}} transition={{duration:0.6}}>
              <ParallaxHero image="/nalanda-aerial.jpg" speed={0.35}>
                <a href="#main-content" className="skip-link">Skip to content</a>
                <header className="px-6 md:px-10 py-5 flex items-center justify-between" role="banner">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}}>
                      <span className="text-lg font-bold text-white" style={{fontFamily:'var(--font-display)'}} aria-hidden="true">J</span>
                    </div>
                    <span className="label text-white/60">JeeVan</span>
                  </div>
                  <button onClick={startOnboarding} className="btn-ghost text-sm text-white/60 hover:text-white" aria-label="Skip to content">Skip</button>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center h-full">
                  <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.8}}>
                    <h1 className="text-white mb-4" style={{fontFamily:'var(--font-display)',fontSize:'clamp(3rem, 6vw, 5rem)',lineHeight:1.1}}>Grow with<br/>Nature</h1>
                    <p className="lead max-w-lg mx-auto text-white/70 mb-4">Sustainable agriculture, heirloom crops, and community farming — from Nalanda, Bihar to your table.</p>
                    <div className="flex justify-center gap-6 mb-10">
                      {STATS.map(s => (<div key={s.label} className="text-center"><p className="text-2xl font-bold text-white" style={{fontFamily:'var(--font-display)'}}>{s.value}</p><p className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</p></div>))}
                    </div>
                    <button onClick={scrollToCountry} className="btn-primary text-base px-8 py-4 rounded-full">Explore JeeVan <ArrowDown className="w-4 h-4 ml-1"/></button>
                  </motion.div>
                </div>
                <div className="pb-8 flex justify-center"><motion.div animate={{y:[0,8,0]}} transition={{duration:2,repeat:Infinity}} className="text-white/30"><ArrowDown className="w-5 h-5"/></motion.div></div>
              </ParallaxHero>
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
                  {(['country','language','survey'] as Step[]).map((s,i) => s!=='hero' && (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i-1<['country','language','survey'].indexOf(step)?'bg-green-500':i-1===['country','language','survey'].indexOf(step)?'bg-green-400':'bg-white/15'}`}/>
                      <span className={`text-[11px] uppercase tracking-wider ${i-1===['country','language','survey'].indexOf(step)?'text-green-400':i-1<['country','language','survey'].indexOf(step)?'text-white/40':'text-white/20'}`}>{['Country','Language','Profile'][i-1]}</span>
                    </div>
                  ))}
                </header>
                <main className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {step==='country' && <CountrySelection key="c" onNext={()=>setStep('language')}/>}
                    {step==='language' && <LanguageThemeSelection key="l" onNext={()=>setStep('survey')}/>}
                    {step==='survey' && <MiniSurvey key="s" onComplete={()=>{completeOnboarding();window.location.href='/hub'}}/>}
                  </AnimatePresence>
                </main>
              </div>

              <section className="py-24 md:py-32 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <span className="label" style={{color:'var(--accent-green)'}}>What We Offer</span>
                    <h2 id="ventures-heading" style={{fontFamily:'var(--font-display)'}} className="mt-3">Our Ventures</h2>
                    <p className="lead max-w-xl mx-auto mt-4">From sapling to software — four ways JeeVan serves you.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {VENTURES.map((v,i)=>(
                      <motion.div key={v.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{delay:i*0.12,duration:0.6}}
                        className="group relative overflow-hidden rounded-2xl cursor-pointer hover-lift"
                        style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                        <div className="h-48 overflow-hidden hover-zoom-img"><div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${v.img})`}}/></div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:'rgba(90,158,75,0.1)',color:v.color}}>{v.icon}</div><h3 style={{fontFamily:'var(--font-display)'}} className="text-xl">{v.name}</h3></div>
                          <p className="small" style={{color:'var(--text-secondary)'}}>{v.desc}</p>
                          <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium" style={{color:'var(--accent-green)'}}>Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-20 px-6 md:px-10">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12"><span className="label" style={{color:'var(--accent-gold)'}}>Trusted By</span><h2 style={{fontFamily:'var(--font-display)'}} className="mt-3">Ecosystem Partners</h2></div>
                  <div className="flex flex-wrap justify-center gap-3 mb-16">{PARTNERS.map(p=>(<span key={p} className="px-4 py-2.5 rounded-full text-xs transition-all cursor-default" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)',color:'var(--text-secondary)'}}>{p}</span>))}</div>
                  <div className="text-center"><span className="label" style={{color:'var(--accent-green)'}}>Social Causes</span><h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-8">What We Stand For</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{CAUSES.map(c=>(<motion.div key={c.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative overflow-hidden rounded-2xl p-8 group cursor-pointer" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}><div className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity bg-cover bg-center" style={{backgroundImage:`url(${c.img})`}}/><Heart className="w-8 h-8 mb-4 relative z-10" style={{color:'var(--accent-green)'}}/><h3 style={{fontFamily:'var(--font-display)'}} className="text-xl mb-2 relative z-10">{c.name}</h3><p className="small relative z-10" style={{color:'var(--text-secondary)'}}>{c.desc}</p></motion.div>))}</div></div>
                </div>
              </section>

              <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}} role="contentinfo">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-4"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}><span className="text-sm font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>J</span></div><span className="label">JeeVan</span></div>
                  <p className="small">Vill-Mahamadpur, Nalanda, Bihar, India · Built with 🌱 by Shubham Saurabh</p>
                  <nav className="flex justify-center gap-6 mt-4"><a href="/about" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>About</a><a href="/contact" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Contact</a><a href="/blog" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Blog</a><a href="/shop" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Shop</a><a href="/pricing" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>Pricing</a></nav>
                </div>
              </footer>
            </NatureEngine>
          </div>
        )}
        <HiddenAdminEntry />
      </div>
    </ErrorBoundary>
  )
}
