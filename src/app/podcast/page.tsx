'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Play, Clock, User } from 'lucide-react'
import episodes from '@/data/podcast-episodes.json'
import NewsletterSignup from '@/components/newsletter-signup'
import { useI18n } from '@/lib/i18n'

const CATEGORIES = ['All','Farming','Heritage','Science','Story','Business']

export default function PodcastPage() {
  const { t } = useI18n()
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? episodes : episodes.filter(e => e.category === cat)

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{background:'rgba(196,164,74,0.1)',border:'1px solid rgba(196,164,74,0.2)'}}>
              <Mic className="w-8 h-8" style={{color:'var(--accent-gold)'}}/>
            </div>
            <span className="label" style={{color:'var(--accent-green)'}}>Podcast</span>
            <h1 style={{fontFamily:'var(--font-display)'}}>JeeVan Conversations</h1>
            <p className="lead max-w-xl mx-auto mt-3">Conversations with farmers, scientists, and entrepreneurs shaping sustainable agriculture.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map(c=>(<button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${cat===c?'bg-green-600/20 border border-green-500/30 text-green-300':'border text-white/40'}`} style={cat===c?{}:{borderColor:'var(--border-subtle)'}}>{c}</button>))}
          </div>
          <div className="space-y-4">
            {filtered.map((ep,i)=>(
              <motion.div key={ep.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card p-5 flex flex-col sm:flex-row gap-4 hover-lift cursor-pointer">
                <div className="w-full sm:w-32 h-24 rounded-lg bg-cover bg-center shrink-0" style={{backgroundImage:`url(${ep.image})`}}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 text-[10px]" style={{color:'var(--text-muted)'}}>
                    <span className="badge-green">{ep.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{ep.duration}</span>
                    <span>{ep.date}</span>
                  </div>
                  <h3 className="text-base font-semibold mb-1" style={{fontFamily:'var(--font-display)'}}>{ep.title}</h3>
                  <p className="text-xs flex items-center gap-1 mb-2" style={{color:'var(--text-muted)'}}><User className="w-3 h-3"/>{ep.guest}</p>
                </div>
                <button className="btn-primary shrink-0 self-start mt-2 sm:mt-0"><Play className="w-4 h-4"/> Listen</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-6" style={{background:'var(--bg-secondary)'}}><div className="max-w-xl mx-auto"><NewsletterSignup/></div></section>
      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="small">{t('footer.short')}</p>
        <nav className="flex justify-center gap-6 mt-3">
          <a href="/" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.home')}</a>
          <a href="/blog" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.blog')}</a>
          <a href="/shop" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.shop')}</a>
        </nav>
      </footer>
    </div>
  )
}
