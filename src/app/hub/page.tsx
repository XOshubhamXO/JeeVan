'use client'
import NewsletterSignup from '@/components/newsletter-signup'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ErrorBoundary from '@/components/error-boundary'
import { useUserStore } from '@/lib/store'
import FloatingController from '@/components/layout/floating-controller'
import PlantDirectory from '@/components/directory/plant-directory'
import { Sprout, Monitor, Wrench, Camera, Heart, CloudSun, TrendingUp, ChevronRight } from 'lucide-react'

const NatureEngine = dynamic(() => import('@/components/nature/nature-engine'), { ssr: false })

const VENTURES = [
  { id:'nursery', name:'JeeVan Plant Nursery', desc:'On-demand sapling preparation, indigenous seed conservation, and rare variety supply from our Nalanda farm.', icon:<Sprout className="w-5 h-5"/>, color:'from-green-600/15 to-emerald-700/15 border-green-500/25', img:'/ventures-nursery.jpg' },
  { id:'gardening', name:'Gardening Services', desc:'Urban rooftop gardens, living lawns, natural composting setups, and tool rentals.', icon:<Wrench className="w-5 h-5"/>, color:'from-amber-600/15 to-yellow-700/15 border-amber-500/25', img:'/ventures-gardening.jpg' },
  { id:'tech', name:'Tech Consulting (B.Tech CSE)', desc:'Custom software, web & mobile apps, PC build architecture, startup advisory.', icon:<Monitor className="w-5 h-5"/>, color:'from-blue-600/15 to-cyan-700/15 border-blue-500/25', img:'/ventures-tech.jpg' },
  { id:'studio', name:'Creative Media Studio', desc:'Professional content creation, photography, video production, and event planning.', icon:<Camera className="w-5 h-5"/>, color:'from-purple-600/15 to-pink-700/15 border-purple-500/25', img:'/ventures-studio.jpg' },
]
const PARTNERS = ['Madhopur Farmers Producer Co. (IFFCO/YARA/Katyayani)','Falcon Garden Tools','Ecoviha Industries','Humsafar RO Water','Madras Dosa House','SahG Greens','Aviraj Aviral Digital Studio','Kumar Enterprises','Prakash Enterprises']
const CAUSES = [{ name:'Pedal4Planet', desc:'Zero-emission transit & environmental awareness', img:'/causes-pedal4planet.jpg' },{ name:'Adira Biocycle', desc:'Organic waste recycling & circular bio-economy', img:'/causes-adira.jpg' }]

export default function HubPage() {
  const { session } = useUserStore()
  const [g,setG] = useState('')
  const [ready,setReady] = useState(false)
  useEffect(()=>{setReady(true);const h=new Date().getHours();setG(h<12?'Good morning':h<17?'Good afternoon':'Good evening')},[])
  useEffect(()=>{if(ready&&!session.onboardingCompleted&&typeof window!=='undefined')window.location.href='/'},[ready,session.onboardingCompleted])
  if(!ready)return <div className="min-h-screen" style={{background:'var(--bg-primary)'}}/>

  return (
    <ErrorBoundary>
      <NatureEngine bgImage="/bg-gradient-4k.jpg">
        <div className="relative z-10">
          {/* Header */}
          <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{background:'rgba(4,10,4,0.8)',borderColor:'var(--border-subtle)'}}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                  <span className="text-base font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>J</span>
                </div>
                <div>
                  <span className="text-sm font-medium">JeeVan Hub</span>
                  {session.name&&<p className="text-[11px] mt-0.5" style={{color:'var(--text-muted)'}}>{g}, {session.name}</p>}
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-1 text-xs">
                {['Ventures','Directory','Advisory','Market','Community'].map(t=>(
                  <a key={t} href={`#${t.toLowerCase()}`} className="px-3 py-1.5 rounded-lg transition-colors" style={{color:'var(--text-muted)'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>{t}</a>
                ))}
                <a href="/about" className="px-3 py-1.5 rounded-lg transition-colors" style={{color:'var(--accent-green)'}}>About</a>
                <a href="/blog" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Blog</a>
                <a href="/shop" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Shop</a>
              </nav>
            </div>
          </header>

          {/* Welcome */}
          <section className="py-20 md:py-28 text-center px-6">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <h1 style={{fontFamily:'var(--font-display)'}}>{g}, {session.name||'Friend'}</h1>
              <p className="lead max-w-lg mx-auto mt-3">Your unified platform for sustainable agriculture, natural living, and technology.</p>
            </motion.div>
          </section>

          {/* Ventures */}
          <section id="ventures" className="py-20 md:py-28 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <span className="label" style={{color:'var(--accent-green)'}}>Ventures</span>
                <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3">Our Ventures</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VENTURES.map((v,i)=>(
                  <motion.div key={v.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{delay:i*0.12,duration:0.6}}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                    <div className="h-48 overflow-hidden hover-zoom-img">
                      {v.img&&<div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${v.img})`}}/>}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:'rgba(90,158,75,0.1)'}}>{v.icon}</div>
                        <h3 style={{fontFamily:'var(--font-display)'}} className="text-xl">{v.name}</h3>
                      </div>
                      <p className="small mb-4" style={{color:'var(--text-secondary)'}}>{v.desc}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium" style={{color:'var(--accent-green)'}}>Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Plant Directory */}
          <section id="directory" className="py-20 md:py-28 px-6 md:px-10">
            <PlantDirectory/>
          </section>

          {/* Advisory */}
          <section id="advisory" className="py-20 md:py-28 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{background:'rgba(196,164,74,0.08)',border:'1px solid rgba(196,164,74,0.15)'}}>
                <CloudSun className="w-10 h-10" style={{color:'var(--accent-gold)'}}/>
              </div>
              <h2 style={{fontFamily:'var(--font-display)'}}>AI Crop Advisory</h2>
              <p className="lead mt-3 mb-8">Powered by Groq Llama with Google Gemini fallback. Ask anything about farming.</p>
              <div className="card p-6 max-w-md mx-auto text-left text-sm space-y-3" style={{color:'var(--text-secondary)'}}>
                <p><span style={{color:'var(--accent-green)',fontWeight:500}}>Try:</span> What should I plant in Bihar in July?</p>
                <p><span style={{color:'var(--accent-green)',fontWeight:500}}>Try:</span> Organic pest control for tomato crop</p>
                <p><span style={{color:'var(--accent-green)',fontWeight:500}}>Try:</span> Natural fertilizer recipe for wheat</p>
              </div>
            </div>
          </section>

          {/* Market */}
          <section id="market" className="py-20 md:py-28 px-6 md:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{background:'rgba(90,158,75,0.08)',border:'1px solid rgba(90,158,75,0.15)'}}>
                <TrendingUp className="w-10 h-10" style={{color:'var(--accent-green)'}}/>
              </div>
              <h2 style={{fontFamily:'var(--font-display)'}}>Mandi Rate Tracker</h2>
              <p className="lead mt-3 mb-8">Live commodity prices from Agmarknet across Indian mandis.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                {['rice','wheat','maize','turmeric','onion','potato','tomato','ginger'].map(c=>(
                  <div key={c} className="card p-4 text-center hover:border-green-500/20 transition-all cursor-pointer">
                    <p className="text-sm font-medium capitalize">{c}</p>
                    <p className="text-[10px] mt-1" style={{color:'var(--text-muted)'}}>₹ view rates</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Community */}
          <section id="community" className="py-20 md:py-28 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <span className="label" style={{color:'var(--accent-gold)'}}>Community</span>
                <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3">Partners & Causes</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {PARTNERS.map(p=>(<span key={p} className="px-4 py-2.5 rounded-full text-xs transition-all cursor-default" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)',color:'var(--text-secondary)'}}>{p}</span>))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CAUSES.map(c=>(
                  <div key={c.name} className="relative overflow-hidden rounded-2xl p-8" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                    {c.img&&<div className="absolute inset-0 opacity-[0.06] bg-cover bg-center" style={{backgroundImage:`url(${c.img})`}}/>}
                    <Heart className="w-8 h-8 mb-4 relative z-10" style={{color:'var(--accent-green)'}}/>
                    <h3 style={{fontFamily:'var(--font-display)'}} className="text-xl mb-2 relative z-10">{c.name}</h3>
                    <p className="small relative z-10" style={{color:'var(--text-secondary)'}}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 px-6 md:px-10" style={{background:"var(--bg-secondary)"}}><div className="max-w-xl mx-auto"><NewsletterSignup /></div></section>

          {/* Footer */}
          <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
            <div className="max-w-7xl mx-auto">
              <p className="small">JeeVan · Vill-Mahamadpur, Nalanda, Bihar · 🌱 Shubham Saurabh</p>
              <div className="flex justify-center gap-6 mt-3">
                <a href="/about" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>About</a>
                <a href="/blog" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Blog</a>
                <a href="/shop" className="text-xs hover:underline" style={{color:"var(--text-muted)"}}>Shop</a>
                <span className="text-xs" style={{color:'var(--text-muted)'}}>© 2026 JeeVan</span>
              </div>
            </div>
          </footer>
        </div>
      </NatureEngine>
      <FloatingController/>
    </ErrorBoundary>
  )
}

