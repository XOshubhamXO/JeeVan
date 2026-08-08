'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Props {
  image: string
  video?: string
  children: React.ReactNode
  height?: string
  speed?: number
}

export default function ParallaxHero({ image, video, children, height = '100vh', speed = 0.4 }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      setOffset(-rect.top * speed)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className="relative overflow-hidden" style={{ height }}>
      {video ? (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src={video} style={{ transform: `translate3d(0, ${offset}px, 0)` }} />
      ) : (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})`, transform: `translate3d(0, ${offset}px, 0)` }} />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,10,4,0.3) 0%, rgba(4,10,4,0.7) 60%, rgba(4,10,4,0.95) 100%)' }} />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
