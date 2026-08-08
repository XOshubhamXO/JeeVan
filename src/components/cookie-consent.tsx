'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('jeevan-cookie-consent')
    if (!consent) {
      setTimeout(() => setShow(true), 2000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('jeevan-cookie-consent', 'accepted')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[170] max-w-md w-[calc(100%-2rem)]"
        >
          <div className="card p-5 flex items-start gap-4 shadow-2xl" style={{background:'var(--bg-surface)'}}>
            <Cookie className="w-5 h-5 shrink-0 mt-0.5" style={{color:'var(--accent-gold)'}} />
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-relaxed mb-3" style={{color:'var(--text-secondary)'}}>
                We use cookies to understand how you use JeeVan and improve your experience. No tracking, no ads.
              </p>
              <div className="flex gap-2">
                <button onClick={accept} className="btn-primary text-xs px-4 py-2">Accept</button>
                <button onClick={accept} className="btn-ghost text-xs">Decline</button>
                <a href="/privacy" className="btn-ghost text-xs" style={{color:'var(--text-muted)'}}>Privacy</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
