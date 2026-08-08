'use client'

import React from 'react'
import Link from 'next/link'
import { Sprout, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background:'rgba(90,158,75,0.08)',border:'1px solid rgba(90,158,75,0.15)'}}>
          <Sprout className="w-10 h-10" style={{color:'var(--accent-green)'}} />
        </div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(3rem,8vw,5rem)'}} className="mb-3">404</h1>
        <p className="lead mb-2">This page hasn&apos;t been planted yet.</p>
        <p className="small mb-8" style={{color:'var(--text-muted)'}}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to fertile ground.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" /> Back Home
          </Link>
          <Link href="/hub" className="btn-secondary">
            JeeVan Hub
          </Link>
        </div>
      </div>
    </div>
  )
}
