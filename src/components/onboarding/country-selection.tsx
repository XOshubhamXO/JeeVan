'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Globe2, Sprout, MapPin } from 'lucide-react'
import { useCountryStore, useUserStore, type Country } from '@/lib/store'

const TOP_20 = ['IN','CN','US','BR','RU','FR','MX','ID','NG','TR','AR','AU','CA','DE','TH','VN','PK','EG','BD','JP']
const TOP_NAMES: Record<string,string> = { IN:'India',CN:'China',US:'United States',BR:'Brazil',RU:'Russia',FR:'France',MX:'Mexico',ID:'Indonesia',NG:'Nigeria',TR:'Turkey',AR:'Argentina',AU:'Australia',CA:'Canada',DE:'Germany',TH:'Thailand',VN:'Vietnam',PK:'Pakistan',EG:'Egypt',BD:'Bangladesh',JP:'Japan' }
const MAP_CDN = 'https://raw.githubusercontent.com/djaiss/mapsicon/master/all'

const FALLBACK: Country[] = TOP_20.map(c => ({ code:c, name:TOP_NAMES[c]||c, flag:`https://flagcdn.com/w40/${c.toLowerCase()}.png`, region:'', languages:[], isAgricultural:true }))

export default function CountrySelection({ onNext }: { onNext: () => void }) {
  const { countries, setCountries, setLoading } = useCountryStore()
  const { setCountry } = useUserStore()
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState<Country | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<Country | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const r = await fetch('/api/countries')
        const j = await r.json()
        const raw = j.data || j
        const list: Country[] = (Array.isArray(raw) ? raw : []).map((c: Record<string,unknown>) => ({
          code: (c.cca2 as string) || '',
          name: ((c.name as Record<string,unknown>)?.common as string) || '',
          flag: `https://flagcdn.com/w80/${(c.cca2 as string || '').toLowerCase()}.png`,
          region: (c.region as string) || '',
          languages: c.languages ? Object.keys(c.languages as Record<string,string>) : [],
          isAgricultural: TOP_20.includes((c.cca2 as string) || ''),
        }))
        setCountries(list.length > 0 ? list : FALLBACK)
      } catch { setCountries(FALLBACK) }
    }
    load()
  }, [setCountries, setLoading])

  const agri = countries.filter(c => TOP_20.includes(c.code))
  const others = countries.filter(c => !TOP_20.includes(c.code))
  const results = search ? countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())) : []

  const handleSelect = () => {
    if (!selected) return
    setCountry(selected.code, selected.name)
    setTimeout(onNext, 400)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-5xl mx-auto px-4 py-8 relative min-h-[70vh]">
      {/* MAP + FLAG BACKGROUND on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div key={hovered.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* SVG map silhouette */}
            <div className="absolute opacity-[0.05]" style={{ width: 'min(500px, 75vw)', height: 'min(500px, 75vw)' }}>
              <img src={`${MAP_CDN}/${hovered.code.toLowerCase()}/vector.svg`} alt="" className="w-full h-full object-contain brightness-0 invert" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            {/* Animated rings */}
            <div className="absolute w-[320px] h-[320px] rounded-full" style={{ background: 'var(--accent-green)', opacity: 0.03, boxShadow: '0 0 180px rgba(74,103,65,0.08)' }} />
            <div className="absolute w-[260px] h-[260px] rounded-full border-2 border-green-500/25" style={{ animation: 'spin 8s linear infinite' }} />
            <div className="absolute w-[210px] h-[210px] rounded-full border border-dashed border-green-500/15" style={{ animation: 'spin 12s linear infinite reverse' }} />
            {/* Flag in center */}
            <div className="absolute w-[110px] h-[110px] rounded-full overflow-hidden border-2 border-green-500/40" style={{ boxShadow: '0 0 60px rgba(74,103,65,0.15)' }}>
              {hovered.flag ? <img src={hovered.flag} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{hovered.code}</div>}
            </div>
            <div className="absolute bottom-[6%] text-center">
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-xl">{hovered.name}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: hovered.isAgricultural ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                {hovered.isAgricultural ? 'Agricultural Powerhouse' : hovered.region || 'Select Country'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'rgba(74,103,65,0.07)', border: '1px solid rgba(74,103,65,0.12)' }}>
            <Globe2 className="w-8 h-8" style={{ color: 'var(--accent-green)' }} />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}>Where in the world are you?</h1>
          <p className="lead max-w-md mx-auto mt-3">Select your country to unlock localized crop recommendations and community connections.</p>
          {selected && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ background: 'rgba(74,103,65,0.08)', border: '1px solid rgba(74,103,65,0.18)' }}>
                {selected.flag && <img src={selected.flag} alt="" className="w-6 h-4 rounded-sm" />}
                <span className="font-medium text-sm" style={{ color: 'var(--accent-green)' }}>{selected.name}</span>
                <MapPin className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
              </div>
              <br />
              <button onClick={handleSelect} className="mt-4 px-8 py-3 rounded-full text-white font-medium text-sm transition-all hover:scale-105" style={{ background: 'var(--accent-green)', boxShadow: '0 4px 20px rgba(74,103,65,0.3)' }}>
                Confirm & Continue <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
              </button>
            </motion.div>
          )}
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search 195 countries..." className="input" style={{ paddingLeft: '2.75rem' }} />
        </div>

        {search ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <p className="label mb-3">{results.length} countries found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {results.map(c => <CountryBtn key={c.code} c={c} selected={selected?.code === c.code} onSelect={setSelected} onHover={setHovered} />)}
            </div>
          </motion.div>
        ) : (
          <>
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
                <span className="label">Top 20 Agricultural Nations</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {agri.map((c, i) => (
                  <motion.div key={c.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                    <CountryBtn c={c} selected={selected?.code === c.code} onSelect={setSelected} onHover={setHovered} active />
                  </motion.div>
                ))}
              </div>
            </section>
            {others.length > 0 && (
              <section>
                <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-2 text-xs transition-colors mb-3" style={{ color: 'var(--text-muted)' }}>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                  {showAll ? 'Hide' : 'Show'} {others.length} more countries
                </button>
                <AnimatePresence>
                  {showAll && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-hidden">
                      {others.map((c, i) => (
                        <motion.div key={c.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}>
                          <CountryBtn c={c} selected={selected?.code === c.code} onSelect={setSelected} onHover={setHovered} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

function CountryBtn({ c, selected, onSelect, onHover, active }: { c: Country; selected: boolean; onSelect: (c: Country) => void; onHover: (c: Country | null) => void; active?: boolean }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(c)} onMouseEnter={() => onHover(c)} onMouseLeave={() => onHover(null)}
      className="w-full flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left"
      style={{
        background: selected ? 'rgba(74,103,65,0.12)' : active ? 'rgba(74,103,65,0.06)' : 'var(--bg-surface)',
        borderColor: selected ? 'rgba(74,103,65,0.35)' : active ? 'rgba(74,103,65,0.2)' : 'var(--border-subtle)',
      }}>
      {c.flag ? <img src={c.flag} alt="" className="w-7 h-5 rounded-sm object-cover" /> : <span className="w-7 h-5 rounded-sm flex items-center justify-center text-[9px]" style={{ background: 'var(--bg-secondary)' }}>{c.code}</span>}
      <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
      {active && <Sprout className="w-3 h-3 opacity-30" style={{ color: 'var(--accent-green)' }} />}
    </motion.button>
  )
}
