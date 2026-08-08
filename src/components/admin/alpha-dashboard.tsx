'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Shield, Settings, LogOut, Check, X, RefreshCw, Save, Edit3, Package } from 'lucide-react'
import { useAdminStore } from '@/lib/store'
import AnalyticsOverview from '@/components/analytics-overview'

const SUPABASE_URL = 'https://iylyhdddvpsckinpnyxw.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU'

interface Testimonial { id:string; user_name:string; location:string; rating:number; feedback_text:string; is_approved_by_alpha:boolean; created_at:string }
interface AuditLog { id:string; admin_tier:string; action_performed:string; target_module:string; timestamp:string }
interface Venture { id:string; slug:string; venture_name:string; category:string; description:string; hero_image_url:string; is_active:boolean }
interface Plant { id:string; botanical_name:string; common_name:string; category:string; sub_category:string; description:string; growth_cycle_days:number; water_needs:string; origin_regions:string[]; is_active:boolean }

export default function AlphaDashboard() {
  const { username, logout } = useAdminStore()
  const [tab, setTab] = useState('ventures')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [ventures, setVentures] = useState<Venture[]>([])
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [apiHealth, setApiHealth] = useState<Record<string,string>>({})
  const [editingVenture, setEditingVenture] = useState<Venture|null>(null)

  const fetchSupabase = async (table:string, query='') => {
    try { const r=await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`,{headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`}}); return r.ok?r.json():[] }
    catch { return [] }
  }

  const loadAll = async () => {
    setLoading(true)
    if (tab==='testimonials') setTestimonials(await fetchSupabase('testimonials_feedback','?select=*&order=created_at.desc&limit=30'))
    if (tab==='audit') setAuditLogs(await fetchSupabase('admin_audit_logs','?select=*&order=timestamp.desc&limit=50'))
    if (tab==='ventures') setVentures(await fetchSupabase('ventures','?select=*&order=created_at.desc'))
    if (tab==='plants') setPlants(await fetchSupabase('plant_directory','?select=*&order=category,common_name&limit=100'))
    if (tab==='settings') checkApiHealth()
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [tab])

  const checkApiHealth = async () => {
    const h:Record<string,string>={}
    try{const r=await fetch('https://restcountries.com/v3.1/name/india',{signal:AbortSignal.timeout(5000)});h['REST Countries']=r.ok?'healthy':'degraded'}catch{h['REST Countries']='unreachable'}
    try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=25&longitude=85&current=temperature_2m',{signal:AbortSignal.timeout(5000)});h['Open-Meteo']=r.ok?'healthy':'degraded'}catch{h['Open-Meteo']='unreachable'}
    try{await fetchSupabase('plant_directory','?limit=1');h['Supabase']='healthy'}catch{h['Supabase']='unreachable'}
    h['DeepL']=process.env.DEEPL_API_KEY?'configured':'not configured'
    h['Groq']=process.env.GROQ_API_KEY?'configured':'not configured'
    h['Agmarknet']=process.env.AGMARKNET_API_KEY?'configured':'not configured'
    setApiHealth(h)
  }

  const approveTestimonial = useCallback(async (id:string) => {
    await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs`,{method:'POST',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({admin_id:'91532c20-863c-4380-9ddd-6e52816370d1',admin_tier:'ALPHA',action_performed:'approve_testimonial',target_module:'testimonials_feedback'})})
    await fetch(`${SUPABASE_URL}/rest/v1/testimonials_feedback?id=eq.${id}`,{method:'PATCH',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({is_approved_by_alpha:true,approved_at:new Date().toISOString(),approved_by:'91532c20-863c-4380-9ddd-6e52816370d1'})})
    setTestimonials(ts=>ts.map(t=>t.id===id?{...t,is_approved_by_alpha:true}:t));setMsg('Approved');setTimeout(()=>setMsg(''),1500)
  },[])
  const dismissTestimonial = useCallback(async (id:string) => {
    await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs`,{method:'POST',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({admin_id:'91532c20-863c-4380-9ddd-6e52816370d1',admin_tier:'ALPHA',action_performed:'dismiss_testimonial',target_module:'testimonials_feedback'})})
    await fetch(`${SUPABASE_URL}/rest/v1/testimonials_feedback?id=eq.${id}`,{method:'DELETE',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`}})
    setTestimonials(ts=>ts.filter(t=>t.id!==id));setMsg('Dismissed');setTimeout(()=>setMsg(''),1500)
  },[])

  const saveVenture = async (v:Venture) => {
    await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs`,{method:'POST',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({admin_id:'91532c20-863c-4380-9ddd-6e52816370d1',admin_tier:'ALPHA',action_performed:'update_venture',target_module:'ventures'})})
    await fetch(`${SUPABASE_URL}/rest/v1/ventures?id=eq.${v.id}`,{method:'PATCH',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({venture_name:v.venture_name,category:v.category,description:v.description,hero_image_url:v.hero_image_url})})
    setVentures(vs=>vs.map(x=>x.id===v.id?{...x,...v}:x));setEditingVenture(null);setMsg('Venture saved');setTimeout(()=>setMsg(''),1500)
  }

  const savePlant = async (p:Plant) => {
    await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs`,{method:'POST',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({admin_id:'91532c20-863c-4380-9ddd-6e52816370d1',admin_tier:'ALPHA',action_performed:'update_plant',target_module:'plant_directory'})})
    await fetch(`${SUPABASE_URL}/rest/v1/plant_directory?id=eq.${p.id}`,{method:'PATCH',headers:{apikey:ANON_KEY,Authorization:`Bearer ${ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({common_name:p.common_name,category:p.category,sub_category:p.sub_category,description:p.description,growth_cycle_days:p.growth_cycle_days,water_needs:p.water_needs})})
    setPlants(ps=>ps.map(x=>x.id===p.id?{...x,...p}:x));setMsg('Plant saved');setTimeout(()=>setMsg(''),1500)
  }

  const tabs = [
    {id:'ventures',label:'Ventures',icon:<Package className="w-4 h-4"/>},
    {id:'plants',label:'Plants',icon:<Edit3 className="w-4 h-4"/>},
    {id:'testimonials',label:'Testimonials',icon:<Star className="w-4 h-4"/>},
    {id:'audit',label:'Audit',icon:<Shield className="w-4 h-4"/>},
    {id:'settings',label:'Settings',icon:<Settings className="w-4 h-4"/>},
  ]

  return (
    <div className="min-h-screen" style={{background:'var(--bg-primary)',color:'var(--text-primary)'}}>
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{background:'rgba(4,10,4,0.9)',borderColor:'var(--border-subtle)'}}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'rgba(196,164,74,0.15)',border:'1px solid rgba(196,164,74,0.2)'}}>
              <Shield className="w-5 h-5" style={{color:'var(--accent-gold)'}}/>
            </div>
            <div><h1 className="font-semibold text-sm">JeeVan Alpha</h1><p className="text-[10px] font-mono" style={{color:'var(--accent-gold)'}}>MASTER · {username}</p></div>
          </div>
          <button onClick={logout} className="btn-ghost text-xs"><LogOut className="w-3.5 h-3.5"/>Exit</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab===t.id?'bg-green-600/20 border border-green-500/30 text-green-300':'bg-white/[0.02] border border-transparent opacity-50 hover:opacity-80'}`}>{t.icon}{t.label}</button>))}
        </div>
        {msg && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="mb-4 px-4 py-2 rounded-lg text-xs" style={{background:'rgba(90,158,75,0.12)',border:'1px solid rgba(90,158,75,0.2)',color:'var(--accent-green)'}}>{msg}</motion.div>}

          <div className="mb-6"><AnalyticsOverview /></div>
        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.2}}>

          {/* Analytics Header — visible on all tabs */}
          <div className="mb-6"><AnalyticsOverview /></div>

          {/* VENTURES TAB */}
          {tab==='ventures'&&(
            <div>
              <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold">Ventures & Partners</h2><button onClick={loadAll} disabled={loading} className="btn-ghost text-xs"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/>Refresh</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ventures.map(v=>(
                  editingVenture?.id===v.id ? (
                    <div key={v.id} className="card p-5 space-y-3">
                      <input value={editingVenture.venture_name} onChange={e=>setEditingVenture({...editingVenture,venture_name:e.target.value})} className="input text-sm" placeholder="Name"/>
                      <input value={editingVenture.category} onChange={e=>setEditingVenture({...editingVenture,category:e.target.value})} className="input text-sm" placeholder="Category"/>
                      <textarea rows={3} value={editingVenture.description} onChange={e=>setEditingVenture({...editingVenture,description:e.target.value})} className="input text-sm resize-none" placeholder="Description"/>
                      <input value={editingVenture.hero_image_url||''} onChange={e=>setEditingVenture({...editingVenture,hero_image_url:e.target.value})} className="input text-sm" placeholder="Image URL (e.g. /ventures-nursery.jpg)"/>
                      <div className="flex gap-2"><button onClick={()=>saveVenture(editingVenture)} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditingVenture(null)} className="btn-ghost text-xs">Cancel</button></div>
                    </div>
                  ) : (
                    <div key={v.id} className="card p-4">
                      <div className="flex items-start justify-between mb-2"><div><p className="font-medium text-sm">{v.venture_name}</p><span className="badge-green text-[10px] mt-1">{v.category}</span></div><button onClick={()=>setEditingVenture(v)} className="btn-ghost p-1"><Edit3 className="w-3.5 h-3.5"/></button></div>
                      <p className="text-xs mb-2" style={{color:'var(--text-secondary)'}}>{v.description?.slice(0,120)}{v.description?.length>120?'...':''}</p>
                      <span className={`text-[10px] ${v.is_active?'text-green-400':'text-red-400'}`}>{v.is_active?'Active':'Inactive'}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* PLANTS TAB */}
          {tab==='plants'&&(
            <div>
              <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold">Plant Directory ({plants.length})</h2><button onClick={loadAll} disabled={loading} className="btn-ghost text-xs"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/>Refresh</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {plants.slice(0,30).map(p=>(
                  <div key={p.id} className="card p-3">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-xs">{p.common_name}</p>
                      <button onClick={async ()=>{
                        const name = prompt('Edit name:',p.common_name)
                        if(name){const desc=prompt('Edit description:',p.description||'');savePlant({...p,common_name:name,description:desc||p.description})}
                      }} className="btn-ghost p-1"><Edit3 className="w-3 h-3"/></button>
                    </div>
                    <p className="text-[10px] italic mb-1" style={{color:'var(--text-muted)'}}>{p.botanical_name}</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'var(--bg-secondary)'}}>{p.category}</span>
                      {p.water_needs&&<span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'var(--bg-secondary)'}}>{p.water_needs}</span>}
                      {p.growth_cycle_days&&<span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'var(--bg-secondary)'}}>{p.growth_cycle_days}d</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS TAB */}
          {tab==='testimonials'&&(
            <div>
              <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold">Feedback & Testimonials</h2><button onClick={loadAll} disabled={loading} className="btn-ghost text-xs"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/>Refresh</button></div>
              {testimonials.length===0?<div className="text-center py-16 text-xs" style={{color:'var(--text-muted)'}}>No testimonials yet.</div>:<div className="space-y-3">
                {testimonials.map(t=>(<div key={t.id} className="card p-4"><div className="flex items-start justify-between mb-2"><div><p className="font-medium text-sm">{t.user_name||'Anonymous'}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{t.location||'Unknown'} · {t.created_at?new Date(t.created_at).toLocaleDateString():''}</p></div><div className="flex gap-0.5">{[...Array(5)].map((_,i)=><Star key={i} className={`w-3 h-3 ${i<(t.rating||0)?'text-amber-400 fill-amber-400':'text-white/10'}`}/>)}</div></div><p className="text-xs mb-3" style={{color:'var(--text-secondary)'}}>&ldquo;{t.feedback_text}&rdquo;</p>{t.is_approved_by_alpha?<span className="badge-green text-[10px]"><Check className="w-3 h-3"/>Approved</span>:<div className="flex gap-2"><button onClick={()=>approveTestimonial(t.id)} className="text-[10px] px-3 py-1 rounded-full bg-green-600/20 hover:bg-green-600/40 border border-green-600/20"><Check className="w-3 h-3 inline mr-1"/>Approve</button><button onClick={()=>dismissTestimonial(t.id)} className="text-[10px] px-3 py-1 rounded-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/15"><X className="w-3 h-3 inline mr-1"/>Dismiss</button></div>}</div>))}
              </div>}
            </div>
          )}

          {/* AUDIT TAB */}
          {tab==='audit'&&(
            <div>
              <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold">Admin Audit Trail</h2><button onClick={loadAll} disabled={loading} className="btn-ghost text-xs"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/>Refresh</button></div>
              {auditLogs.length===0?<div className="text-center py-16 text-xs" style={{color:'var(--text-muted)'}}>No audit entries yet.</div>:<div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-subtle)'}}><table className="w-full text-xs"><thead><tr className="border-b" style={{borderColor:'var(--border-subtle)'}}><th className="p-3 text-left font-medium" style={{color:'var(--text-muted)'}}>Time</th><th className="p-3 text-left font-medium" style={{color:'var(--text-muted)'}}>Action</th><th className="p-3 text-left font-medium" style={{color:'var(--text-muted)'}}>Module</th><th className="p-3 text-left font-medium" style={{color:'var(--text-muted)'}}>Tier</th></tr></thead><tbody>{auditLogs.map(a=>(<tr key={a.id} className="border-b hover:bg-white/[0.02]" style={{borderColor:'var(--border-subtle)'}}><td className="p-3 font-mono" style={{color:'var(--text-muted)'}}>{a.timestamp?new Date(a.timestamp).toLocaleString():''}</td><td className="p-3">{a.action_performed}</td><td className="p-3" style={{color:'var(--text-secondary)'}}>{a.target_module}</td><td className="p-3">{a.admin_tier==='ALPHA'?<span style={{color:'var(--accent-gold)'}}>ALPHA</span>:<span className="text-blue-300">BETA</span>}</td></tr>))}</tbody></table></div>}
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab==='settings'&&(
            <div className="space-y-4 max-w-xl">
              <div className="card p-5">
                <h2 className="text-sm font-semibold mb-3">API Health</h2>
                <div className="space-y-2">
                  {Object.entries(apiHealth).map(([k,v])=>(
                    <div key={k} className="flex items-center justify-between py-1.5">
                      <span className="text-xs" style={{color:'var(--text-secondary)'}}>{k}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                        v==='healthy'||v==='configured'?'bg-green-600/15 text-green-300 border border-green-500/20':
                        v==='degraded'?'bg-amber-600/15 text-amber-300':'bg-red-600/15 text-red-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v==='healthy'||v==='configured'?'bg-green-400':v==='degraded'?'bg-amber-400 animate-pulse':'bg-red-400'}`}/>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={checkApiHealth} className="btn-ghost text-xs mt-3"><RefreshCw className="w-3 h-3"/>Refresh</button>
              </div>
              <div className="card p-5">
                <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
                <div className="space-y-2 text-xs" style={{color:'var(--text-secondary)'}}>
                  <p>• Edit any venture by clicking the pencil icon</p>
                  <p>• Edit any plant by clicking the pencil icon</p>
                  <p>• Approve/dismiss testimonials from the Testimonials tab</p>
                  <p>• All changes are audited in the Audit tab</p>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  )
}
