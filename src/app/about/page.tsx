'use client'

import React from 'react'
import { Code, Sprout, Heart, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function AboutPage() {
  const { t } = useI18n()

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage:'url(/hero-farm.jpg)'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom, rgba(4,10,4,0.2), var(--bg-primary))'}}/>
        <div className="relative z-10 text-center px-6">
          <span className="label mb-4" style={{color:'var(--accent-green)'}}>{t('about.hero.label')}</span>
          <h1 style={{fontFamily:'var(--font-display)',color:'#fff',whiteSpace:'pre-line'}}>{t('about.hero.headline')}</h1>
          <p className="lead max-w-xl mx-auto mt-4 text-white/60">{t('about.hero.subtitle')}</p>
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
              <h2 style={{fontFamily:'var(--font-display)'}} className="mb-4">{t('about.founder.name')}</h2>
              <p className="label" style={{color:'var(--accent-green)'}}>{t('about.founder.title')}</p>
              <div className="space-y-4 mt-6" style={{color:'var(--text-secondary)',lineHeight:1.9}}>
                <p>{t('about.story.p1')}</p>
                <p>{t('about.story.p2')}</p>
                <p>{t('about.story.p3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Land */}
      <section className="py-24 md:py-32 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
        <div className="max-w-3xl mx-auto">
          <span className="label" style={{color:'var(--accent-gold)'}}>{t('about.land.label')}</span>
          <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-8">{t('about.land.heading')}</h2>
          <div className="h-64 rounded-2xl overflow-hidden mb-8 bg-cover bg-center opacity-60" style={{backgroundImage:'url(/hero-farm.jpg)'}}/>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{color:'var(--text-secondary)'}}>
            {[
              {l:t('about.land.village'),v:'Mahamadpur'},
              {l:t('about.land.mauja'),v:'Mansinghpur'},
              {l:t('about.land.panchayat'),v:'Kaila'},
              {l:t('about.land.district'),v:'Nalanda'},
              {l:t('about.land.state'),v:'Bihar'},
              {l:t('about.land.pin'),v:'803110'}
            ].map(r=>(
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
          <span className="label" style={{color:'var(--accent-green)'}}>{t('about.philosophy.label')}</span>
          <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-8">{t('about.philosophy.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {icon:<Sprout className="w-6 h-6"/>,t:t('about.pillar.natural'),d:t('about.pillar.natural.desc'),color:'var(--accent-green)'},
              {icon:<Code className="w-6 h-6"/>,t:t('about.pillar.technical'),d:t('about.pillar.technical.desc'),color:'var(--accent-sage)'},
              {icon:<Heart className="w-6 h-6"/>,t:t('about.pillar.social'),d:t('about.pillar.social.desc'),color:'var(--accent-gold)'}
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
          <span className="label" style={{color:'var(--accent-green)'}}>{t('about.ventures.label')}</span>
          <h2 style={{fontFamily:'var(--font-display)'}} className="mt-3 mb-10">{t('about.ventures.heading')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {t:t('venture.nursery'),d:t('venture.nursery.desc').slice(0,45)+'...'},
              {t:t('venture.gardening'),d:t('venture.gardening.desc').slice(0,45)+'...'},
              {t:t('venture.tech'),d:t('venture.tech.desc').slice(0,45)+'...'},
              {t:t('venture.studio'),d:t('venture.studio.desc').slice(0,45)+'...'},
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
        <h2 style={{fontFamily:'var(--font-display)'}}>{t('about.cta.heading')}</h2>
        <p className="lead max-w-md mx-auto mt-4">{t('about.cta.subtitle')}</p>
        <a href="/" className="btn-primary mt-8 inline-flex">{t('about.cta.button')} <ArrowRight className="w-4 h-4"/></a>
      </section>

      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p style={{color:'var(--text-muted)',fontSize:'0.8125rem'}}>{t('footer.established')}</p>
      </footer>
    </div>
  )
}
