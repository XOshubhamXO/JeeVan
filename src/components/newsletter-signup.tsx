'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Check, Sparkles } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Store in Supabase or forward to email service
    const SUPABASE_URL = 'https://iylyhdddvpsckinpnyxw.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU'
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
        method: 'POST',
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ email, subscribed_at: new Date().toISOString() }),
      })
    } catch {}
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4" style={{ background: 'rgba(196,164,74,0.1)', border: '1px solid rgba(196,164,74,0.2)' }}>
        <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl mb-2">Stay Connected</h3>
      <p className="small mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Seasonal planting guides, farm updates, and community stories — straight to your inbox.</p>

      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--accent-green)' }}>
          <Check className="w-4 h-4" /> Thank you! You&apos;re on the list.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="input flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Subscribe</>}
          </button>
        </form>
      )}

      <p className="text-[10px] mt-3" style={{ color: 'var(--text-muted)' }}>No spam. One email per month. Unsubscribe anytime.</p>
    </div>
  )
}
