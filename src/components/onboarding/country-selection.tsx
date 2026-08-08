'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Globe2, Sprout } from 'lucide-react'
import { useCountryStore, useUserStore, type Country } from '@/lib/store'

const TOP_20 = ['IN','CN','US','BR','RU','FR','MX','ID','NG','TR','AR','AU','CA','DE','TH','VN','PK','EG','BD','JP']
function name(code:string){const n:Record<string,string>={IN:'India',CN:'China',US:'United States',BR:'Brazil',RU:'Russia',FR:'France',MX:'Mexico',ID:'Indonesia',NG:'Nigeria',TR:'Turkey',AR:'Argentina',AU:'Australia',CA:'Canada',DE:'Germany',TH:'Thailand',VN:'Vietnam',PK:'Pakistan',EG:'Egypt',BD:'Bangladesh',JP:'Japan'};return n[code]||code}
const FALLBACK:Country[]=TOP_20.map(c=>({code:c,name:name(c),flag:'',region:'',languages:[],isAgricultural:true}))
const MAP_BASE = 'https://raw.githubusercontent.com/djaiss/mapsicon/master/all'

export default function CountrySelection({onNext}:{onNext:()=>void}){
  const{countries,topAgricultural,setCountries,setLoading}=useCountryStore()
  const{setCountry}=useUserStore()
  const[search,setSearch]=useState('')
  const[hovered,setHovered]=useState<Country|null>(null)
  const[showAll,setShowAll]=useState(false)

  useEffect(()=>{async function l(){setLoading(true);try{const r=await fetch('/api/countries');const j=await r.json();const raw=j.data||j;const t:Country[]=(Array.isArray(raw)?raw:[]).map((c:Record<string,unknown>)=>({code:(c.cca2 as string)||'',name:((c.name as Record<string,unknown>)?.common as string)||'',flag:((c.flags as Record<string,unknown>)?.svg as string)||((c.flags as Record<string,unknown>)?.png as string)||'',region:(c.region as string)||'',languages:c.languages?Object.keys(c.languages as Record<string,string>):[],isAgricultural:TOP_20.includes((c.cca2 as string)||'')}));setCountries(t.length>0?t:FALLBACK)}catch{setCountries(FALLBACK)}}l()},[setCountries,setLoading])

  const agri=topAgricultural.length>0?topAgricultural:countries.filter(c=>TOP_20.includes(c.code))
  const others=countries.filter(c=>!TOP_20.includes(c.code))
  const results=search?countries.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.code.toLowerCase().includes(search.toLowerCase())):[]
  const handleSelect=useCallback((c:Country)=>{setCountry(c.code,c.name);setTimeout(onNext,500)},[setCountry,onNext])

  return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="w-full max-w-5xl mx-auto px-4 py-8">
      <AnimatePresence>
        {hovered&&(
          <motion.div key={hovered.code} initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{duration:0.5}}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {/* Country map outline in background */}
            <div className="absolute opacity-[0.06]" style={{width:'min(420px,70vw)',height:'min(420px,70vw)'}}>
              <img
                src={`${MAP_BASE}/${hovered.code.toLowerCase()}/vector.svg`}
                alt=""
                className="w-full h-full object-contain"
                style={{filter:'invert(1)'}}
                onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}}
              />
            </div>
            {/* Animated rings */}
            <div className="absolute w-[300px] h-[300px] rounded-full" style={{background:'var(--accent-green)',opacity:0.03,boxShadow:'0 0 160px rgba(90,158,75,0.10)'}}/>
            <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-green-500/30" style={{animation:'spin 8s linear infinite'}}/>
            <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-green-500/20" style={{animation:'spin 12s linear infinite reverse'}}/>
            {/* Flag embedded in center */}
            <div className="absolute w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-green-500/50" style={{boxShadow:'0 0 50px rgba(90,158,75,0.18)'}}>
              {hovered.flag?<img src={hovered.flag} alt={hovered.name} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{background:'var(--bg-secondary)',color:'var(--text-muted)'}}>{hovered.code}</div>}
            </div>
            <div className="absolute bottom-[8%] text-center">
              <p style={{color:'var(--text-primary)',fontFamily:'var(--font-display)'}} className="text-xl">{hovered.name}</p>
              <p className="text-[10px] uppercase tracking-widest mt-1" style={{color:hovered.isAgricultural?'var(--accent-green)':'var(--text-muted)'}}>
                {hovered.isAgricultural?'Agricultural Powerhouse':hovered.region||'Select Country'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,delay:0.1}}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{background:'rgba(90,158,75,0.08)',border:'1px solid rgba(90,158,75,0.12)'}}>
            <Globe2 className="w-8 h-8" style={{color:'var(--accent-green)'}}/>
          </motion.div>
          <h1 style={{fontFamily:'var(--font-display)'}}>Where in the world are you?</h1>
          <p className="lead max-w-md mx-auto mt-3">Select your country to unlock localized crop recommendations and community connections.</p>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}}/>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 195 countries..."
            className="input" style={{paddingLeft:'2.75rem'}}/>
        </div>

        {search?(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-8">
            <p className="label mb-3">{results.length} countries found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">{results.map(c=><CountryBtn key={c.code} c={c} onSelect={handleSelect} onHover={setHovered}/>)}</div>
          </motion.div>
        ):(
          <>
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4"><Sprout className="w-4 h-4" style={{color:'var(--accent-green)'}}/><span className="label">Top 20 Agricultural Nations</span></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">{agri.map((c,i)=>(<motion.div key={c.code} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.02}}><CountryBtn c={c} onSelect={handleSelect} onHover={setHovered} active/></motion.div>))}</div>
            </section>
            {others.length>0&&(<section>
              <button onClick={()=>setShowAll(!showAll)} className="flex items-center gap-2 text-xs transition-colors mb-3" style={{color:'var(--text-muted)'}} onMouseEnter={e=>e.currentTarget.style.color='var(--text-secondary)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAll?'rotate-180':''}`}/>{(showAll?'Hide':'Show')} {others.length} more countries</button>
              <AnimatePresence>{showAll&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-hidden">{others.map((c,i)=>(<motion.div key={c.code} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.01}}><CountryBtn c={c} onSelect={handleSelect} onHover={setHovered}/></motion.div>))}</motion.div>)}</AnimatePresence></section>)}
          </>
        )}
      </div>
    </motion.div>
  )
}

function CountryBtn({c,onSelect,onHover,active}:{c:Country;onSelect:(c:Country)=>void;onHover:(c:Country|null)=>void;active?:boolean}){
  return(
    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>onSelect(c)} onMouseEnter={()=>onHover(c)} onMouseLeave={()=>onHover(null)}
      className="w-full flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left"
      style={{
        background:active?'rgba(90,158,75,0.07)':'var(--bg-surface)',
        borderColor:active?'rgba(90,158,75,0.22)':'var(--border-subtle)',
      }}>
      {c.flag?<img src={c.flag} alt="" className="w-6 h-4 rounded-sm object-cover"/>:<span className="w-6 h-4 rounded-sm flex items-center justify-center text-[8px]" style={{background:'var(--bg-secondary)'}}>{c.code}</span>}
      <span className="text-xs font-medium truncate flex-1" style={{color:'var(--text-primary)'}}>{c.name}</span>
      {active&&<Sprout className="w-3 h-3 opacity-40" style={{color:'var(--accent-green)'}}/>}
    </motion.button>
  )
}
