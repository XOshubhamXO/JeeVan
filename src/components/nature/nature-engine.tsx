'use client'

import React from 'react'
import { useNatureEngineStore } from '@/lib/store'

interface Props { children?: React.ReactNode; className?: string; bgImage?: string }

export default function NatureEngine({ children, className = '', bgImage }: Props) {
  const engineStore = useNatureEngineStore((s) => s.engine)
  
  if (!engineStore.enabled) {
    return <div className={`relative w-full h-full overflow-hidden ${className}`}>{children}</div>
  }

  const bgUrl = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_URL || bgImage

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        {bgUrl && bgUrl.match(/\.(mp4|webm|mov)/) ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-25" src={bgUrl} />
        ) : bgUrl ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{backgroundImage: `url(${bgUrl})`}} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-emerald-950 to-green-900 opacity-70" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,168,83,0.06),transparent_50%)]" />
        <div className="absolute inset-0 opacity-20 animate-breathing" style={{background: 'radial-gradient(circle at 50% 30%, rgba(34,197,94,0.08), transparent 60%)'}} />
      </div>
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
