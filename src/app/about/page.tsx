'use client'

import React from 'react'
import { Code, Sprout, Heart, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage:'url(/hero-farm.jpg)'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom, rgba(4,10,4,0.2), var(--bg-primary))'}}/>
        <div className="relative z-10 text-center px-6">
          <span className="label mb-4" style={{color:'var(--accent-green)'}}>Our Story</span>
          <h1 style={{fontFamily:'var(--font-display)',color:'#fff'}}>From Desktop Computing<br/>to Sustainable Living</h1>
          <p className="lead max-w-xl mx-auto mt-4 text-white/60">One B.Tech graduate&apos;s journey back to his ancestral village — and what grew from it.</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center shrink-0" style={{background:'rgba(90,158,75,0.08)',border:'1px solid rgba(90,158,75,0.15)'}}>
              <span className="text-5xl font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>SS</span>
            </div>
            <div>
              <h2 style={{fontFamily:'var(--font-display)'}} className="mb-4">Shubham Saurabh</h2>
              <p className="label" style={{color:'var(--accent-green)'}}>Founder & Lead Engineer · B.Tech Computer Science</p>
              <div className="space-y-4 mt-6" style={{color:'var(--text-secondary)',lineHeight:1.9}}>
                <p>I left the screen for the soil. After completing my B.Tech in Computer Science, I returned to my ancestral village of Mahamadpur in Nalanda, Bihar — not to escape technology, but to apply it where it matters most: the land that feeds us.</p>
                <p>JeeVan is the bridge between advanced software engineering and sustainable natural agriculture. Every line of code serves a plant. Every database query tracks soil health. Every API route connects a farmer to market prices.</p>
                <p>What started as a personal journey became a community. Today, JeeVan serves farmers, gardeners, sustainability advocates, and tech innovators — all from this small village in Bihar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Land */}
      <section className="py-24 md:py-32 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
        <div className="max-w-3xl mx-auto">
          <span className="label" style={{color:'var(--accent-gold)'}}>The Land</span>
          <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-8">Where JeeVan Grows</h2>
          <div className="h-64 rounded-2xl overflow-hidden mb-8 bg-cover bg-center opacity-60" style={{backgroundImage:'url(/hero-farm.jpg)'}}/>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{color:'var(--text-secondary)'}}>
            {[{l:'Village',v:'Mahamadpur'},{l:'Mauja',v:'Mansinghpur'},{l:'Panchayat',v:'Kaila'},{l:'District',v:'Nalanda'},{l:'State',v:'Bihar'},{l:'PIN',v:'803110'}].map(r=>(
              <div key={r.l} className="p-3 rounded-lg" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                <span className="label block mb-1">{r.l}</span>
                <span className="text-sm font-medium" style={{color:'var(--text-primary)'}}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="label" style={{color:'var(--accent-green)'}}>Our Philosophy</span>
          <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-8">Three Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {icon:<Sprout className="w-6 h-6"/>,t:'Natural',d:'Chemical-free farming. Heirloom seeds. Indigenous knowledge meets modern soil science.',color:'var(--accent-green)'},
              {icon:<Code className="w-6 h-6"/>,t:'Technical',d:'Software, APIs, and platforms serving farmers. B.Tech CSE rigor applied to agriculture.',color:'var(--accent-sage)'},
              {icon:<Heart className="w-6 h-6"/>,t:'Social',d:'Community-first. Zero-emission transit. Circular bio-economy. Farming as a collective act.',color:'var(--accent-gold)'}
            ].map(p=>(
              <div key={p.t} className="card p-6 text-left">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{background:'rgba(90,158,75,0.1)',color:p.color}}>{p.icon}</div>
                <h3 className="text-lg mb-2" style={{fontFamily:'var(--font-display)'}}>{p.t}</h3>
                <p className="small" style={{color:'var(--text-secondary)'}}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventures summary */}
      <section className="py-24 md:py-32 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="label" style={{color:'var(--accent-green)'}}>What We Do</span>
          <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-10">Our Ventures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {t:'Plant Nursery',d:'Heirloom saplings, indigenous seeds, rare Magahi varieties'},
              {t:'Gardening Services',d:'Rooftop gardens, composting, tool rentals'},
              {t:'Tech Consulting',d:'Custom software, PC builds, startup advisory'},
              {t:'Creative Media',d:'Photography, video, content creation'},
            ].map(v=>(
              <div key={v.t} className="card p-4 text-left">
                <strong style={{color:'var(--text-primary)',fontSize:'0.9375rem'}}>{v.t}</strong>
                <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 text-center">
        <h2 style={{fontFamily:'var(--font-display)'}}>Join the Community</h2>
        <p className="lead max-w-md mx-auto mt-4">From Nalanda to the world — farmers, gardeners, and technologists growing together.</p>
        <a href="/" className="btn-primary mt-8 inline-flex">Explore JeeVan <ArrowRight className="w-4 h-4"/></a>
      </section>

      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p style={{color:'var(--text-muted)',fontSize:'0.8125rem'}}>JeeVan · Vill-Mahamadpur, Nalanda, Bihar · 🌱 Shubham Saurabh · Est. 2024</p>
      </footer>
    </div>
  )
}
