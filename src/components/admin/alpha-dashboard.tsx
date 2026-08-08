/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Settings, LogOut, Check, X, RefreshCw, Save, Edit3, Package, Image, Users, ShoppingBag, Eye, UserPlus, Trash2, Upload, Camera } from 'lucide-react'
import { useAdminStore } from '@/lib/store'
import AnalyticsOverview from '@/components/analytics-overview'

const SUPABASE_URL = 'https://iylyhdddvpsckinpnyxw.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjAyMTIwMSwiZXhwIjoyMTAxNTk3MjAxfQ.AQbz8sfGgtm2blETObGzu6O4mm7kpvuCbY9ePI1b4PE'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU'
const H = (k: string) => ({ apikey: k, Authorization: `Bearer ${k}`, 'Content-Type': 'application/json', Prefer: 'return=representation' })

export default function AlphaDashboard() {
  const { username, logout } = useAdminStore()
  const [tab, setTab] = useState('media')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState<any>(null)
  const [apiHealth, setApiHealth] = useState<Record<string,string>>({})
  const [newBeta, setNewBeta] = useState({ username:'', passkey:'' })
  const [newItem, setNewItem] = useState<Record<string,string>>({})

  const callApi = async (table:string, action:string, payload?:any, id?:string) => {
    const body = JSON.stringify({table, action, data:payload, id})
    try {
      if (action === 'list') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=200`, { headers: H(SERVICE_KEY) })
        return r.json()
      }
      if (action === 'create') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:'POST', headers:H(SERVICE_KEY), body:JSON.stringify({...payload, created_at:new Date().toISOString()}) })
        return r.json()
      }
      if (action === 'update') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:'PATCH', headers:H(SERVICE_KEY), body:JSON.stringify(payload) })
        return r.ok
      }
      if (action === 'delete') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:'DELETE', headers:H(SERVICE_KEY) })
        return r.ok
      }
    } catch { return null }
  }

  const loadData = async (table:string) => { setLoading(true); const r = await callApi(table, 'list'); setData(r || []); setLoading(false) }
  useEffect(() => { loadData(tab === 'media'?'media_assets':tab==='shop'?'shop_products':tab==='ventures'?'ventures':tab==='plants'?'plant_directory':tab==='beta'?'admin_users':tab==='users'?'user_sessions':tab==='testimonials'?'testimonials_feedback':tab==='audit'?'admin_audit_logs':tab==='health'?'plant_directory':'ventures') }, [tab])

  const handleSave = async (item:any, table:string) => {
    if (item.id) await callApi(table, 'update', item, item.id)
    else await callApi(table, 'create', item)
    setEditing(null); setNewItem({}); setMsg('Saved'); setTimeout(()=>setMsg(''),1500); loadData(table)
  }

  const handleDelete = async (id:string, table:string) => { await callApi(table, 'delete', null, id); setMsg('Deleted'); setTimeout(()=>setMsg(''),1500); loadData(table) }

  const createBeta = async () => {
    await callApi('admin_users', 'create', {...newBeta, tier:'BETA', is_active:true, created_at:new Date().toISOString()})
    setNewBeta({username:'',passkey:''}); setMsg('Beta admin created!'); setTimeout(()=>setMsg(''),2000); loadData('admin_users')
  }

  const checkHealth = async () => {
    const h:Record<string,string>={}
    try{const r=await fetch('https://restcountries.com/v3.1/name/india',{signal:AbortSignal.timeout(5000)});h['REST Countries']=r.ok?'healthy':'degraded'}catch{h['REST Countries']='unreachable'}
    try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=25&longitude=85&current=temperature_2m',{signal:AbortSignal.timeout(5000)});h['Open-Meteo']=r.ok?'healthy':'degraded'}catch{h['Open-Meteo']='unreachable'}
    try{await callApi('plant_directory','list');h['Supabase']='healthy'}catch{h['Supabase']='unreachable'}
    h['Groq']=process.env.GROQ_API_KEY?'configured':'missing'
    h['Mistral']=process.env.MISTRAL_API_KEY?'configured':'missing'
    h['HuggingFace']=process.env.HUGGINGFACE_API_KEY?'configured':'missing'
    h['Gemini']=process.env.GOOGLE_AI_API_KEY?'configured':'missing'
    h['Razorpay']=process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?'configured':'missing'
    h['Mailchimp']=process.env.MAILCHIMP_API_KEY?'configured':'missing'
    h['Brevo']=process.env.BREVO_API_KEY?'configured':'missing'
    h['Agmarknet']=process.env.AGMARKNET_API_KEY?'configured':'missing'
    h['Firebase Auth']=process.env.FIREBASE_API_KEY?'configured':'missing'
    setApiHealth(h)
  }

  const tabs = [
    {id:'media',label:'Media',icon:<Image className="w-3.5 h-3.5"/>},
    {id:'shop',label:'Shop',icon:<ShoppingBag className="w-3.5 h-3.5"/>},
    {id:'plants',label:'Plants',icon:<Edit3 className="w-3.5 h-3.5"/>},
    {id:'ventures',label:'Ventures',icon:<Package className="w-3.5 h-3.5"/>},
    {id:'testimonials',label:'Reviews',icon:<Eye className="w-3.5 h-3.5"/>},
    {id:'beta',label:'Beta Admins',icon:<UserPlus className="w-3.5 h-3.5"/>},
    {id:'users',label:'Users',icon:<Users className="w-3.5 h-3.5"/>},
    {id:'audit',label:'Audit',icon:<Shield className="w-3.5 h-3.5"/>},
    {id:'health',label:'Health',icon:<Settings className="w-3.5 h-3.5"/>},
  ]

  return (
    <div className="min-h-screen" style={{background:'var(--bg-primary)',color:'var(--text-primary)'}}>
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{background:'rgba(253,250,245,0.95)',borderColor:'var(--border-subtle)'}}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'rgba(196,155,74,0.12)',border:'1px solid rgba(196,155,74,0.2)'}}>
              <Shield className="w-5 h-5" style={{color:'var(--accent-gold)'}}/>
            </div>
            <div><h1 className="font-semibold text-sm">JeeVan Alpha</h1><p className="text-[10px] font-mono" style={{color:'var(--accent-gold)'}}>MASTER · {username}</p></div>
          </div>
          <button onClick={logout} className="btn-ghost text-xs"><LogOut className="w-3.5 h-3.5"/>Exit</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <AnalyticsOverview />
        <div className="flex gap-1 my-6 overflow-x-auto pb-1 flex-wrap">
          {tabs.map(t=>(<button key={t.id} onClick={()=>{setTab(t.id);loadData(t.id==='media'?'media_assets':t.id==='shop'?'shop_products':t.id==='ventures'?'ventures':t.id==='plants'?'plant_directory':t.id==='beta'?'admin_users':t.id==='users'?'user_sessions':t.id==='testimonials'?'testimonials_feedback':t.id==='audit'?'admin_audit_logs':'plant_directory')}} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${tab===t.id?'bg-green-600/20 border border-green-500/30 text-green-300':'bg-white/[0.02] border border-transparent opacity-50 hover:opacity-80'}`}>{t.icon}{t.label}</button>))}
        </div>
        {msg && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="mb-4 px-4 py-2 rounded-lg text-xs" style={{background:'rgba(74,103,65,0.08)',border:'1px solid rgba(74,103,65,0.15)',color:'var(--accent-green)'}}>{msg}</motion.div>}

        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">{tabs.find(t=>t.id===tab)?.label} ({data.length})</h2>
            <div className="flex gap-2">
              {['media','shop','plants','ventures'].includes(tab) && <button onClick={()=>setEditing({})} className="btn-primary text-[10px] px-3 py-1.5">+ Add New</button>}
              <button onClick={()=>loadData(tab==='media'?'media_assets':tab==='shop'?'shop_products':tab==='ventures'?'ventures':tab==='plants'?'plant_directory':tab==='beta'?'admin_users':tab==='users'?'user_sessions':tab==='testimonials'?'testimonials_feedback':tab==='audit'?'admin_audit_logs':'plant_directory')} disabled={loading} className="btn-ghost text-xs"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/></button>
            </div>
          </div>

          {/* MEDIA ASSETS TAB — image/inventory manager */}
          {tab==='media'&&(<div>
            {editing&&(<div className="card p-5 space-y-3 mb-4 max-w-lg"><input value={editing.filename||''} onChange={e=>setEditing({...editing,filename:e.target.value})} className="input text-sm" placeholder="Filename (e.g. hero-farm.jpg)"/><input value={editing.file_path||''} onChange={e=>setEditing({...editing,file_path:e.target.value})} className="input text-sm" placeholder="Path (e.g. /public/hero-farm.jpg)"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category (hero, venture, plant, cause)"/><input value={editing.alt_text||''} onChange={e=>setEditing({...editing,alt_text:e.target.value})} className="input text-sm" placeholder="Alt text description"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'media_assets')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No media assets yet. Add images to manage them here.</p>:<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">{data.map((m:any)=>(<div key={m.id} className="card p-2 group relative"><div className="w-full h-24 rounded-lg bg-cover bg-center mb-2" style={{backgroundImage:`url(${m.file_path})`,background:'var(--bg-secondary)'}}/><p className="text-[10px] font-medium truncate">{m.filename}</p><p className="text-[9px]" style={{color:'var(--text-muted)'}}>{m.category||'uncategorized'}</p><div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>setEditing(m)} className="p-1 rounded bg-black/60 text-white"><Edit3 className="w-3 h-3"/></button><button onClick={()=>handleDelete(m.id,'media_assets')} className="p-1 rounded bg-black/60 text-red-400"><Trash2 className="w-3 h-3"/></button></div></div>))}</div>}
          </div>)}

          {/* SHOP INVENTORY */}
          {tab==='shop'&&(<div>
            {editing&&(<div className="card p-5 space-y-3 mb-4 max-w-lg"><input value={editing.name||''} onChange={e=>setEditing({...editing,name:e.target.value})} className="input text-sm" placeholder="Product Name"/><input value={editing.price||''} onChange={e=>setEditing({...editing,price:e.target.value})} className="input text-sm" placeholder="Price (₹250)"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category"/><input value={editing.image||''} onChange={e=>setEditing({...editing,image:e.target.value})} className="input text-sm" placeholder="Image path"/><textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className="input text-sm" placeholder="Description"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'shop_products')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No products. Click + Add New.</p>:data.map((p:any)=>(<div key={p.id} className="card p-3 flex items-center justify-between mb-2"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" style={{backgroundImage:`url(${p.image})`,background:'var(--bg-secondary)'}}/><div><p className="font-medium text-xs">{p.name}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{p.category} · {p.price}</p></div></div><div className="flex gap-1"><button onClick={()=>setEditing(p)} className="btn-ghost p-1"><Edit3 className="w-3 h-3"/></button><button onClick={()=>handleDelete(p.id,'shop_products')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3 h-3"/></button></div></div>))}
          </div>)}

          {/* PLANTS */}
          {tab==='plants'&&(<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {editing&&(<div className="card p-5 space-y-2 col-span-full"><input value={editing.common_name||''} onChange={e=>setEditing({...editing,common_name:e.target.value})} className="input text-sm" placeholder="Common name"/><input value={editing.botanical_name||''} onChange={e=>setEditing({...editing,botanical_name:e.target.value})} className="input text-sm" placeholder="Botanical name"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category"/><input value={editing.image||''} onChange={e=>setEditing({...editing,image:e.target.value})} className="input text-sm" placeholder="Image path"/><textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className="input text-sm" placeholder="Description"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'plant_directory')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.slice(0,60).map((p:any)=>(<div key={p.id} className="card p-3"><p className="font-medium text-xs">{p.common_name}</p><p className="text-[10px] italic" style={{color:'var(--text-muted)'}}>{p.botanical_name}</p><div className="flex gap-1 mt-2"><span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'var(--bg-secondary)'}}>{p.category}</span>{p.image&&<span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'rgba(74,103,65,0.08)',color:'var(--accent-green)'}}>image</span>}</div><div className="flex gap-1 mt-2"><button onClick={()=>setEditing(p)} className="btn-ghost p-1"><Edit3 className="w-3 h-3"/></button><button onClick={()=>handleDelete(p.id,'plant_directory')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3 h-3"/></button></div></div>))}
          </div>)}

          {/* VENTURES */}
          {tab==='ventures'&&(<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing&&(<div className="card p-5 space-y-3"><input value={editing.name||editing.venture_name||''} onChange={e=>setEditing({...editing,name:e.target.value,venture_name:e.target.value})} className="input text-sm" placeholder="Name"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category"/><textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className="input text-sm" placeholder="Description"/><input value={editing.image||editing.hero_image_url||''} onChange={e=>setEditing({...editing,image:e.target.value,hero_image_url:e.target.value})} className="input text-sm" placeholder="Image path"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'ventures')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.map((v:any)=>(<div key={v.id} className="card p-4 flex justify-between"><div><p className="font-medium text-sm">{v.name||v.venture_name}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{v.category} {v.image||v.hero_image_url?`· ${(v.image||v.hero_image_url).slice(0,20)}`:''}</p></div><div className="flex gap-1"><button onClick={()=>setEditing({...v,name:v.name||v.venture_name,image:v.image||v.hero_image_url})} className="btn-ghost p-1"><Edit3 className="w-3.5 h-3.5"/></button><button onClick={()=>handleDelete(v.id,'ventures')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></div></div>))}
          </div>)}

          {/* BETA ADMINS */}
          {tab==='beta'&&(<div className="space-y-6">
            <div className="card p-5 max-w-md"><h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4"/>Create Beta Admin</h3><div className="space-y-3"><input value={newBeta.username} onChange={e=>setNewBeta({...newBeta,username:e.target.value})} className="input text-sm" placeholder="Username (partner_nursery)"/><input value={newBeta.passkey} onChange={e=>setNewBeta({...newBeta,passkey:e.target.value})} className="input text-sm" placeholder="Passkey"/><button onClick={createBeta} disabled={!newBeta.username||!newBeta.passkey} className="btn-primary text-xs w-full justify-center">Create Beta Admin</button></div></div>
            <div className="space-y-2">{data.map((a:any)=>(<div key={a.id} className="card p-3 flex items-center justify-between"><div><p className="font-medium text-xs">{a.username}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{a.tier} · {a.is_active?'Active':'Inactive'}</p></div><button onClick={()=>handleDelete(a.id,'admin_users')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></div>))}</div>
          </div>)}

          {/* HEALTH */}
          {tab==='health'&&(<div className="card p-5 max-w-lg" style={{borderColor:'var(--border-subtle)'}}>
            <h3 className="text-sm font-semibold mb-3">API Health</h3>
            <div className="grid grid-cols-2 gap-2">{Object.entries(apiHealth).map(([k,v])=>(<div key={k} className="flex items-center justify-between py-1.5 px-2 rounded" style={{background:'var(--bg-secondary)'}}><span className="text-[11px]" style={{color:'var(--text-secondary)'}}>{k}</span><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${v==='healthy'||v==='configured'?'bg-green-600/10 text-green-600':'bg-red-600/10 text-red-500'}`}>{v}</span></div>))}</div>
            <button onClick={checkHealth} className="btn-ghost text-xs mt-3"><RefreshCw className="w-3 h-3"/>Refresh</button>
          </div>)}

          {/* REVIEWS, USERS, AUDIT — simple tables */}
          {tab==='testimonials'&&(<div className="space-y-3">{data.map((t:any)=>(<div key={t.id} className="card p-4"><div className="flex items-start justify-between mb-2"><div><p className="font-medium text-sm">{t.user_name||'Anonymous'}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{t.location} · {t.created_at?.slice(0,10)}</p></div><div className="flex">{[...Array(5)].map((_,i)=><span key={i} className={i<(t.rating||0)?'text-amber-400':'text-white/10'}>★</span>)}</div></div><p className="text-xs mb-3" style={{color:'var(--text-secondary)'}}>{t.feedback_text}</p>{t.is_approved_by_alpha?<span className="badge-green text-[10px]"><Check className="w-3 h-3"/>Approved</span>:<div className="flex gap-2"><button onClick={async()=>{await callApi('testimonials_feedback','update',{is_approved_by_alpha:true},t.id);loadData('testimonials_feedback')}} className="text-[10px] px-3 py-1 rounded-full bg-green-600/20">✓ Approve</button><button onClick={()=>handleDelete(t.id,'testimonials_feedback')} className="text-[10px] px-3 py-1 rounded-full bg-red-600/10 text-red-400">✕ Dismiss</button></div>}</div>))}</div>)}

          {tab==='users'&&(<div>{data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No visitors yet.</p>:<div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-subtle)'}}><table className="w-full text-xs"><thead><tr className="border-b"><th className="p-3 text-left">Time</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Country</th><th className="p-3 text-left">Language</th><th className="p-3 text-left">Interest</th></tr></thead><tbody>{data.slice(0,50).map((u:any)=>(<tr key={u.id} className="border-b hover:bg-white/[0.02]"><td className="p-3 font-mono" style={{color:'var(--text-muted)'}}>{u.created_at?.slice(0,16)}</td><td className="p-3">{u.name||'—'}</td><td className="p-3">{u.country||'—'}</td><td className="p-3">{u.language||'—'}</td><td className="p-3">{u.interest||'—'}</td></tr>))}</tbody></table></div>}</div>)}

          {tab==='audit'&&(<div>{data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No audit entries.</p>:<div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-subtle)'}}><table className="w-full text-xs"><thead><tr className="border-b"><th className="p-3 text-left">Time</th><th className="p-3 text-left">Admin</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Target</th></tr></thead><tbody>{data.slice(0,50).map((a:any)=>(<tr key={a.id} className="border-b hover:bg-white/[0.02]"><td className="p-3 font-mono" style={{color:'var(--text-muted)'}}>{a.timestamp?.slice(0,16)||a.created_at?.slice(0,16)}</td><td className="p-3">{a.admin_tier==='ALPHA'?<span style={{color:'var(--accent-gold)'}}>ALPHA</span>:<span className="text-blue-300">BETA</span>}</td><td className="p-3">{a.action_performed}</td><td className="p-3" style={{color:'var(--text-secondary)'}}>{a.target_module}</td></tr>))}</tbody></table></div>}</div>)}
        </motion.div>
      </div>
    </div>
  )
}
