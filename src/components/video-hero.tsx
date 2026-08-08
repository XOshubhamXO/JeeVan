'use client'

import React, { useEffect, useRef } from 'react'

interface Props {
  src: string
  poster?: string
  children: React.ReactNode
  height?: string
  overlay?: string
}

export default function VideoHero({ src, poster, children, height = '100vh', overlay = 'rgba(4,10,4,0.3) 0%, rgba(4,10,4,0.7) 60%, rgba(4,10,4,0.95) 100%' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <video
        ref={videoRef}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${overlay})` }} />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
