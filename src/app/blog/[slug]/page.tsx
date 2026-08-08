'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import posts from '@/data/blog-posts.json'
import ReadingProgress from '@/components/reading-progress'
import NewsletterSignup from '@/components/newsletter-signup'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const post = posts.find(p => p.slug === slug)
  const related = posts.filter(p => p.slug !== slug).slice(0, 3)

  if (!post) {
    return (
      <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 style={{fontFamily:'var(--font-display)'}}>Article Not Found</h1>
          <a href="/blog" className="btn-primary mt-4">← Back to Blog</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <ReadingProgress />
      <article className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <a href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 hover:underline" style={{color:'var(--text-muted)'}}>
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </a>
          <div className="flex items-center gap-4 text-[11px] mb-4" style={{color:'var(--text-muted)'}}>
            <span className="badge-green">{post.category}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
          </div>
          <h1 className="text-3xl md:text-5xl mb-6" style={{fontFamily:'var(--font-display)',lineHeight:1.2}}>{post.title}</h1>
          {post.image && <div className="h-64 md:h-96 rounded-2xl overflow-hidden mb-10 bg-cover bg-center" style={{backgroundImage:`url(${post.image})`}} />}
          <div className="space-y-4" style={{color:'var(--text-secondary)',lineHeight:1.9}}>
            <p className="text-lg">{post.excerpt}</p>
            <p>This article is part of the JeeVan Blog — stories, guides, and farming wisdom from the fields of Nalanda, Bihar.</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-[10px] capitalize" style={{background:'var(--bg-secondary)',border:'1px solid var(--border-subtle)',color:'var(--text-muted)'}}>{tag}</span>
            ))}
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="py-16 px-6 md:px-10" style={{background:'var(--bg-secondary)'}}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-8" style={{fontFamily:'var(--font-display)'}}>Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(p => (
                <a key={p.slug} href={`/blog/${p.slug}`} className="card overflow-hidden group hover-lift">
                  <div className="h-40 overflow-hidden hover-zoom-img">
                    <div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${p.image})`}} />
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-1" style={{color:'var(--text-muted)'}}>{p.category} · {p.readTime}</p>
                    <h3 className="text-sm font-semibold group-hover:underline" style={{fontFamily:'var(--font-display)'}}>{p.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="py-16 px-6"><div className="max-w-xl mx-auto"><NewsletterSignup /></div></section>
    </div>
  )
}
