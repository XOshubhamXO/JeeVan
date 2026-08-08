'use client'

import React, { useEffect, useState } from 'react'
import { Star, Quote } from 'lucide-react'

interface Testimonial { id:string; user_name:string; location:string; rating:number; feedback_text:string; created_at:string }

export default function TestimonialWall() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const SUPABASE_URL = 'https://iylyhdddvpsckinpnyxw.supabase.co'
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU'
        const res = await fetch(`${SUPABASE_URL}/rest/v1/testimonials_feedback?select=*&is_approved_by_alpha=is.true&order=created_at.desc&limit=6`, {
          headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
        })
        if (res.ok) setTestimonials(await res.json())
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  if (!loading && testimonials.length === 0) return null

  return (
    <div>
      <div className="text-center mb-8">
        <span className="label" style={{color:'var(--accent-gold)'}}>What People Say</span>
        <h2 className="mt-3" style={{fontFamily:'var(--font-display)'}}>Testimonials</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? [1,2,3].map(i => (
          <div key={i} className="card p-5 space-y-3">
            <div className="animate-pulse h-3 w-3/4 rounded" style={{background:'var(--bg-secondary)'}} />
            <div className="animate-pulse h-12 w-full rounded" style={{background:'var(--bg-secondary)'}} />
            <div className="animate-pulse h-3 w-1/2 rounded" style={{background:'var(--bg-secondary)'}} />
          </div>
        )) : testimonials.map(t => (
          <div key={t.id} className="card p-5 testimonial-card">
            <Quote className="w-6 h-6 mb-2 opacity-20" style={{color:'var(--accent-green)'}} />
            <blockquote className="text-sm leading-relaxed mb-3" style={{color:'var(--text-secondary)'}}>&ldquo;{t.feedback_text}&rdquo;</blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background:'var(--bg-secondary)',color:'var(--accent-green)'}}>
                {(t.user_name||'A')[0].toUpperCase()}
              </div>
              <div>
                <cite className="text-xs font-medium not-italic" style={{color:'var(--text-primary)'}}>{t.user_name||'Anonymous'}</cite>
                <p className="text-[10px]" style={{color:'var(--text-muted)'}}>{t.location||'India'}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(t.rating||5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
