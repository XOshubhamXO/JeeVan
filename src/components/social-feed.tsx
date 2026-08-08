'use client'

import React from 'react'

/* Inline Instagram icon — lucide-react removed brand icons */
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const FEED = [
  { platform:'instagram', handle:'@jeevan.farm', image:'/hero-community.jpg', caption:'Golden hour at JeeVan Farms. Our community planting session this morning. #NalandaFarming', likes:142 },
  { platform:'instagram', handle:'@jeevan.farm', image:'/plants/moringa.jpg', caption:'Moringa saplings ready for dispatch. Grown with love, no chemicals. #OrganicFarming', likes:98 },
  { platform:'instagram', handle:'@jeevan.farm', image:'/hero-crops.jpg', caption:'Heirloom harvest this week. Magahi varieties thriving in the Gangetic soil. #HeirloomSeeds', likes:215 },
]

export default function SocialFeed() {
  if (FEED.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{fontFamily:'var(--font-display)'}}>
          <InstagramIcon className="w-4 h-4" style={{color:'var(--accent-green)'}} /> From Instagram
        </h2>
        <a href="https://instagram.com/jeevan.farm" target="_blank" rel="noopener noreferrer"
          className="text-[10px] hover:underline" style={{color:'var(--text-muted)'}}>@jeevan.farm →</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEED.map((post, i) => (
          <div key={i} className="card overflow-hidden group hover-lift">
            <div className="h-40 overflow-hidden hover-zoom-img">
              <div className="bg-image w-full h-full bg-cover bg-center transition-transform duration-700" style={{backgroundImage:`url(${post.image})`}} />
            </div>
            <div className="p-3">
              <p className="text-[10px] mb-1" style={{color:'var(--text-muted)'}}>{post.handle}</p>
              <p className="text-[11px] leading-relaxed" style={{color:'var(--text-secondary)'}}>{post.caption.slice(0,80)}...</p>
              <p className="text-[10px] mt-2" style={{color:'var(--accent-green)'}}>♥ {post.likes.toLocaleString()} likes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
