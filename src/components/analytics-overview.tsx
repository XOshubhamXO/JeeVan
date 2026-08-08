'use client'

import React, { useEffect, useState } from 'react'
import { Users, Eye, Clock, Globe2 } from 'lucide-react'

export default function AnalyticsOverview() {
  const [stats] = useState({ pageviews: 1420, sessions: 340, countries: 30, avgDwell: '4m 20s' })
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  const items = [
    { label: 'Page Views', value: ready ? stats.pageviews.toLocaleString() : '...', icon: <Eye className="w-5 h-5" />, color: 'var(--accent-green)' },
    { label: 'Sessions', value: ready ? stats.sessions.toLocaleString() : '...', icon: <Users className="w-5 h-5" />, color: 'var(--accent-sage)' },
    { label: 'Countries', value: ready ? stats.countries.toString() : '...', icon: <Globe2 className="w-5 h-5" />, color: 'var(--accent-gold)' },
    { label: 'Avg Dwell', value: ready ? stats.avgDwell : '...', icon: <Clock className="w-5 h-5" />, color: '#8a5a9e' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.label} className="card p-5 text-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(90,158,75,0.1)', color: item.color }}>{item.icon}</div>
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{item.value}</p>
          <p className="label mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
