'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function LazyImage({ src, alt, className = '', width, height }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    if (imgRef.current) observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          width={width}
          height={height}
        />
      )}
    </div>
  )
}
