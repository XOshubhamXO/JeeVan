'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Search } from 'lucide-react'
import posts from '@/data/blog-posts.json'
import { useI18n } from '@/lib/i18n'

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { t } = useI18n()

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)))
  const filtered = posts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.excerpt.toLowerCase().includes(search.toLowerCase())) return false
    if (activeTag && !p.tags.includes(activeTag)) return false
    return true
  })

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="label" style={{color:'var(--accent-green)'}}>{t('blog.label')}</span>
            <h1 style={{fontFamily:'var(--font-display)'}}>{t('blog.heading')}</h1>
            <p className="lead mt-3 max-w-xl mx-auto">{t('blog.subtitle')}</p>
          </div>

          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('blog.search')}
              className="input" style={{paddingLeft:'2.75rem'}} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                !activeTag ? 'bg-green-600/20 border border-green-500/30 text-green-300' : 'border text-white/40'
              }`} style={!activeTag ? {} : {borderColor:'var(--border-subtle)'}}>{t('blog.all_tags')}</button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all capitalize ${
                  tag === activeTag ? 'bg-green-600/20 border border-green-500/30 text-green-300' : 'border text-white/40'
                }`} style={tag === activeTag ? {} : {borderColor:'var(--border-subtle)'}}>{tag}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((post, i) => (
              <motion.article key={post.slug} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                className="card overflow-hidden group cursor-pointer hover-lift">
                {post.image && (
                  <div className="h-48 overflow-hidden hover-zoom-img">
                    <div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${post.image})`}} />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-[10px]" style={{color:'var(--text-muted)'}}>
                    <span className="badge-green">{post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-lg mb-2" style={{fontFamily:'var(--font-display)'}}>{post.title}</h2>
                  <p className="small mb-4" style={{color:'var(--text-secondary)'}}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{color:'var(--text-muted)'}}>By {post.author}</span>
                    <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-medium group-hover:gap-1.5 transition-all" style={{color:'var(--accent-green)'}}>
                      {t('blog.read_more')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16"><p className="text-sm" style={{color:'var(--text-muted)'}}>{t('blog.no_results')}</p></div>
          )}
        </div>
      </section>

      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="small">{t('footer.short')}</p>
        <nav className="flex justify-center gap-6 mt-3" aria-label="Footer">
          <a href="/" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.home')}</a>
          <a href="/about" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.about')}</a>
          <a href="/contact" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.contact')}</a>
          <a href="/pricing" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.pricing')}</a>
          <a href="/shop" className="text-xs hover:underline" style={{color:'var(--text-muted)'}}>{t('nav.shop')}</a>
        </nav>
      </footer>
    </div>
  )
}
