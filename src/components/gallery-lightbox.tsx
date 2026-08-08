'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

interface GalleryImage { src: string; alt: string; caption?: string }
interface Props { images: GalleryImage[]; className?: string }

export default function GalleryLightbox({ images, className = '' }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Set<number>>(new Set())

  const open = (i: number) => setActive(i)
  const close = () => setActive(null)
  const prev = () => setActive(a => a! > 0 ? a! - 1 : images.length - 1)
  const next = () => setActive(a => a! < images.length - 1 ? a! + 1 : 0)

  useEffect(() => {
    if (active === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [active])

  // Preload adjacent images
  useEffect(() => {
    if (active === null) return
    const toLoad = [active, (active + 1) % images.length, (active - 1 + images.length) % images.length]
    toLoad.forEach(i => {
      if (!loaded.has(i)) {
        const img = new Image()
        img.onload = () => setLoaded(l => { const s = new Set(l); s.add(i); return s })
        img.src = images[i].src
      }
    })
  }, [active])

  if (images.length === 0) return null

  return (
    <>
      {/* Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer hover-lift"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            onClick={() => open(i)}
          >
            <div className="aspect-[4/3] overflow-hidden hover-zoom-img">
              <div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: `url(${img.src})` }} />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={close}
          >
            <button onClick={close} className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"><X className="w-6 h-6" /></button>

            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            ><ChevronLeft className="w-6 h-6" /></button>

            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            ><ChevronRight className="w-6 h-6" /></button>

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={images[active].src}
                alt={images[active].alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              {images[active].caption && (
                <p className="text-white/60 text-sm text-center mt-3">{images[active].caption}</p>
              )}
              <p className="text-white/30 text-xs text-center mt-1">{active + 1} / {images.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
