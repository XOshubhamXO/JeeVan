'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'

export default function ExitFeedback() {
  const [show, setShow] = useState(false)
  const [rating, setRating] = useState(0)
  const [suggestion, setSuggestion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5 && !submitted) setShow(true)
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [submitted])

  const submit = async () => {
    try {
      await fetch('/api/telemetry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type:'exit_feedback', rating, suggestion, url:window.location.pathname, timestamp:new Date().toISOString() }) })
    } catch {}
    setSubmitted(true); setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={()=>setShow(false)}>
          <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9}} className="card p-8 max-w-md w-full relative" style={{background:'var(--bg-elevated)'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShow(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10"><X className="w-5 h-5" style={{color:'var(--text-muted)'}}/></button>
            <h2 className="text-xl mb-2" style={{fontFamily:'var(--font-display)'}}>Before you go...</h2>
            <p className="small mb-6" style={{color:'var(--text-secondary)'}}>How was your experience with JeeVan? Your feedback helps us grow.</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setRating(n)} className="p-2 transition-all hover:scale-110" style={{color:n<=rating?'var(--accent-gold)':'var(--text-muted)'}}><Star className="w-8 h-8" fill={n<=rating?'currentColor':'none'}/></button>))}
            </div>
            <textarea value={suggestion} onChange={e=>setSuggestion(e.target.value)} placeholder="Any suggestions, ideas, or feedback?" className="input resize-none mb-4" rows={3}/>
            <button onClick={submit} className="btn-primary w-full justify-center" disabled={rating===0}>Submit Feedback</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
