'use client'

import React, { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px]" style={{ background: 'transparent' }}>
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, var(--accent-green), var(--accent-gold))`,
          boxShadow: progress > 0 ? '0 0 8px rgba(90,158,75,0.5)' : 'none',
        }}
      />
    </div>
  )
}
