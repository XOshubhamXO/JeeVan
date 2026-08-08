/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Shield, Settings, LogOut, Check, X, RefreshCw, Save, Edit3, Package, Image, Users, ShoppingBag, Eye, Clock, UserPlus, Trash2 } from 'lucide-react'
import { useAdminStore } from '@/lib/store'
import AnalyticsOverview from '@/components/analytics-overview'

const API = '/api/admin/manage'

export default function AlphaDashboard() {
  const { username, logout } = useAdminStore()
  const [tab, setTab] = useState('ventures')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState<any>(null)
  const [apiHealth, setApiHealth] = useState<Record<string,string>>({})
  const [newBeta, setNewBeta] = useState({ username:'', passkey:'' })
  const [newItem, setNewItem] = useState<any>({})

  const callApi = async (table:string, action:string, payload?:any, id?:string) => {
    const r = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({table,action,data:payload,id}) })
    return r.json()
  }

  const loadData = async (table:string) => {
    setLoading(true)
    const r = await callApi(table, 'list')
    setData(r.data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (tab === 'ventures') loadData('ventures')
    else if (tab === 'plants') loadData('plant_directory')
    else if (tab === 'testimonials') loadData('testimonials_feedback')
    else if (tab === 'shop') loadData('shop_products')
    else if (tab === 'beta') loadData('admin_users')
    else if (tab === 'users') loadData('user_sessions')
    else if (tab === 'audit') loadData('admin_audit_logs')
    else if (tab === 'settings') checkHealth()
  }, [tab])

  const handleSave = async (item:any, table:string) => {
    if (item.id) await callApi(table, 'update', item, item.id)
    else await callApi(table, 'create', item)
    setEditing(null); setNewItem({})
    setMsg('Saved!'); setTimeout(()=>setMsg(''),1500)
    loadData(table)
  }

  const handleDelete = async (id:string, table:string) => {
    await callApi(table, 'delete', null, id)
    setMsg('Deleted'); setTimeout(()=>setMsg(''),1500)
    loadData(table)
  }

  const createBeta = async () => {
    await callApi('admin_users', 'create', { ...newBeta, tier:'BETA', is_active:true, created_at:new Date().toISOString() })
    setNewBeta({username:'',passkey:''})
    setMsg('Beta admin created!'); setTimeout(()=>setMsg(''),2000)
    loadData('admin_users')
  }

  const checkHealth = async () => {
    const h:Record<string,string>={}
    try{const r=await fetch('https://restcountries.com/v3.1/name/india',{signal:AbortSignal.timeout(5000)});h['REST Countries']=r.ok?'healthy':'degraded'}catch{h['REST Countries']='unreachable'}
    try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=25&longitude=85&current=temperature_2m',{signal:AbortSignal.timeout(5000)});h['Open-Meteo']=r.ok?'healthy':'degraded'}catch{h['Open-Meteo']='unreachable'}
    try{await callApi('plant_directory','list');h['Supabase']='healthy'}catch{h['Supabase']='unreachable'}
    h['DeepL']=process.env.DEEPL_API_KEY?'configured':'missing'
    h['Groq']=process.env.GROQ_API_KEY?'configured':'missing'
    h['Razorpay']=process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?'configured':'missing'
    h['Mailchimp']=process.env.MAILCHIMP_API_KEY?'configured':'missing'
    h['Agmarknet']=process.env.AGMARKNET_API_KEY?'configured':'missing'
    setApiHealth(h)
  }

  const tabs = [
    {id:'ventures',label:'Ventures',icon:<Package className="w-3.5 h-3.5"/>},
    {id:'plants',label:'Plants',icon:<Edit3 className="w-3.5 h-3.5"/>},
    {id:'shop',label:'Shop',icon:<ShoppingBag className="w-3.5 h-3.5"/>},
    {id:'testimonials',label:'Reviews',icon:<Star className="w-3.5 h-3.5"/>},
    {id:'beta',label:'Beta Admins',icon:<UserPlus className="w-3.5 h-3.5"/>},
    {id:'users',label:'Users',icon:<Users className="w-3.5 h-3.5"/>},
    {id:'audit',label:'Audit',icon:<Eye className="w-3.5 h-3.5"/>},
    {id:'settings',label:'Health',icon:<Settings className="w-3.5 h-3.5"/>},
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
        <AnalyticsOverview />
        
        <div className="flex gap-1 my-6 overflow-x-auto pb-1 flex-wrap">
          {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${tab===t.id?'bg-green-600/20 border border-green-500/30 text-green-300':'bg-white/[0.02] border border-transparent opacity-50 hover:opacity-80'}`}>{t.icon}{t.label}</button>))}
        </div>

        {msg && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="mb-4 px-4 py-2 rounded-lg text-xs" style={{background:'rgba(90,158,75,0.12)',border:'1px solid rgba(90,158,75,0.2)',color:'var(--accent-green)'}}>{msg}</motion.div>}

        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">{tabs.find(t=>t.id===tab)?.label} ({data.length})</h2>
            <div className="flex gap-2">
              {['ventures','plants','shop'].includes(tab) && (
                <button onClick={()=>setEditing({})} className="btn-primary text-[10px] px-3 py-1.5">+ Add New</button>
              )}
              <button onClick={()=>setTab(tab)} disabled={loading} className="btn-ghost text-xs"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/></button>
            </div>
          </div>

          {/* VENTURES */}
          {tab==='ventures'&&(<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing&&(<div className="card p-5 space-y-3"><input value={editing.venture_name||''} onChange={e=>setEditing({...editing,venture_name:e.target.value})} className="input text-sm" placeholder="Name"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category"/><textarea rows={3} value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className="input text-sm" placeholder="Description"/><input value={editing.hero_image_url||''} onChange={e=>setEditing({...editing,hero_image_url:e.target.value})} className="input text-sm" placeholder="Image URL"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'ventures')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.map((v:any)=>(<div key={v.id} className="card p-4 flex justify-between"><div><p className="font-medium text-sm">{v.venture_name}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{v.category} · {v.hero_image_url||'no image'}</p></div><div className="flex gap-1"><button onClick={()=>setEditing(v)} className="btn-ghost p-1"><Edit3 className="w-3.5 h-3.5"/></button><button onClick={()=>handleDelete(v.id,'ventures')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></div></div>))}
          </div>)}

          {/* PLANTS */}
          {tab==='plants'&&(<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {editing&&(<div className="card p-5 space-y-2 col-span-full"><input value={editing.common_name||''} onChange={e=>setEditing({...editing,common_name:e.target.value})} className="input text-sm" placeholder="Common name"/><input value={editing.botanical_name||''} onChange={e=>setEditing({...editing,botanical_name:e.target.value})} className="input text-sm" placeholder="Botanical name"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category"/><input value={editing.image||''} onChange={e=>setEditing({...editing,image:e.target.value})} className="input text-sm" placeholder="Image path e.g. /plants/moringa.jpg"/><textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className="input text-sm" placeholder="Description"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'plant_directory')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.slice(0,60).map((p:any)=>(<div key={p.id} className="card p-3"><p className="font-medium text-xs">{p.common_name}</p><p className="text-[10px] italic" style={{color:'var(--text-muted)'}}>{p.botanical_name}</p><div className="flex gap-1 mt-2"><span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'var(--bg-secondary)'}}>{p.category}</span>{p.image&&<span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:'rgba(90,158,75,0.1)',color:'var(--accent-green)'}}>has image</span>}</div><div className="flex gap-1 mt-2"><button onClick={()=>setEditing(p)} className="btn-ghost p-1"><Edit3 className="w-3 h-3"/></button><button onClick={()=>handleDelete(p.id,'plant_directory')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3 h-3"/></button></div></div>))}
          </div>)}

          {/* SHOP INVENTORY */}
          {tab==='shop'&&(<div>
            {editing&&(<div className="card p-5 space-y-3 mb-4"><input value={editing.name||''} onChange={e=>setEditing({...editing,name:e.target.value})} className="input text-sm" placeholder="Product name"/><input value={editing.price||''} onChange={e=>setEditing({...editing,price:e.target.value})} className="input text-sm" placeholder="Price (e.g. ₹250)"/><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className="input text-sm" placeholder="Category"/><input value={editing.image||''} onChange={e=>setEditing({...editing,image:e.target.value})} className="input text-sm" placeholder="Image path"/><textarea value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className="input text-sm" placeholder="Description"/><div className="flex gap-2"><button onClick={()=>handleSave(editing,'shop_products')} className="btn-primary text-xs"><Save className="w-3 h-3"/>Save</button><button onClick={()=>setEditing(null)} className="btn-ghost text-xs">Cancel</button></div></div>)}
            {data.length===0?<p className="text-xs text-center py-8" style={{color:'var(--text-muted)'}}>No products yet. Click + Add New to create one.</p>:data.map((p:any)=>(<div key={p.id} className="card p-3 flex items-center justify-between mb-2"><div><p className="font-medium text-xs">{p.name}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{p.category} · {p.price} {p.image?'· has image':''}</p></div><div className="flex gap-1"><button onClick={()=>setEditing(p)} className="btn-ghost p-1"><Edit3 className="w-3 h-3"/></button><button onClick={()=>handleDelete(p.id,'shop_products')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3 h-3"/></button></div></div>))}
          </div>)}

          {/* TESTIMONIALS */}
          {tab==='testimonials'&&(<div className="space-y-3">
            {data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No feedback yet.</p>:data.map((t:any)=>(<div key={t.id} className="card p-4"><div className="flex items-start justify-between mb-2"><div><p className="font-medium text-sm">{t.user_name||'Anonymous'}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{t.location||'Unknown'} · {t.created_at?.slice(0,10)}</p></div><div className="flex">{[...Array(5)].map((_,i)=><Star key={i} className={`w-3 h-3 ${i<(t.rating||0)?'text-amber-400 fill-amber-400':'text-white/10'}`}/>)}</div></div><p className="text-xs mb-3" style={{color:'var(--text-secondary)'}}>{t.feedback_text}</p>{t.is_approved_by_alpha?<span className="badge-green text-[10px]"><Check className="w-3 h-3"/>Approved</span>:<div className="flex gap-2"><button onClick={async()=>{await callApi('testimonials_feedback','update',{is_approved_by_alpha:true,approved_at:new Date().toISOString()},t.id);loadData('testimonials_feedback');setMsg('Approved')}} className="text-[10px] px-3 py-1 rounded-full bg-green-600/20 hover:bg-green-600/40 border border-green-600/20"><Check className="w-3 h-3 inline mr-1"/>Approve</button><button onClick={async()=>{await handleDelete(t.id,'testimonials_feedback')}} className="text-[10px] px-3 py-1 rounded-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/15"><X className="w-3 h-3 inline mr-1"/>Dismiss</button></div>}</div>))}
          </div>)}

          {/* BETA ADMIN MANAGEMENT */}
          {tab==='beta'&&(<div className="space-y-6">
            <div className="card p-5 max-w-md"><h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4"/>Create Beta Admin</h3><div className="space-y-3"><input value={newBeta.username} onChange={e=>setNewBeta({...newBeta,username:e.target.value})} className="input text-sm" placeholder="Username (e.g. partner_nursery)"/><input value={newBeta.passkey} onChange={e=>setNewBeta({...newBeta,passkey:e.target.value})} className="input text-sm" placeholder="Passkey"/><button onClick={createBeta} disabled={!newBeta.username||!newBeta.passkey} className="btn-primary text-xs w-full justify-center">Create Beta Admin</button></div></div>
            <div className="space-y-2"><h3 className="text-sm font-semibold">Existing Admins</h3>{data.map((a:any)=>(<div key={a.id} className="card p-3 flex items-center justify-between"><div><p className="font-medium text-xs">{a.username}</p><p className="text-[10px]" style={{color:'var(--text-muted)'}}>{a.tier} · {a.is_active?'Active':'Inactive'} · {a.created_at?.slice(0,10)}</p></div><button onClick={()=>handleDelete(a.id,'admin_users')} className="btn-ghost p-1 text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></div>))}</div>
          </div>)}

          {/* USER TRACKING */}
          {tab==='users'&&(<div>{data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No user sessions yet. Data appears when visitors land.</p>:<div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-subtle)'}}><table className="w-full text-xs"><thead><tr className="border-b" style={{borderColor:'var(--border-subtle)'}}><th className="p-3 text-left">Time</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Country</th><th className="p-3 text-left">Language</th><th className="p-3 text-left">Theme</th><th className="p-3 text-left">Interest</th></tr></thead><tbody>{data.slice(0,50).map((u:any)=>(<tr key={u.id} className="border-b hover:bg-white/[0.02]" style={{borderColor:'var(--border-subtle)'}}><td className="p-3 font-mono" style={{color:'var(--text-muted)'}}>{u.created_at?.slice(0,16)}</td><td className="p-3">{u.name||'—'}</td><td className="p-3">{u.country||'—'}</td><td className="p-3">{u.language||'—'}</td><td className="p-3">{u.theme||'—'}</td><td className="p-3">{u.interest||'—'}</td></tr>))}</tbody></table></div>}</div>)}

          {/* AUDIT */}
          {tab==='audit'&&(<div>{data.length===0?<p className="text-xs text-center py-16" style={{color:'var(--text-muted)'}}>No audit entries yet.</p>:<div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-subtle)'}}><table className="w-full text-xs"><thead><tr className="border-b" style={{borderColor:'var(--border-subtle)'}}><th className="p-3 text-left">Time</th><th className="p-3 text-left">Admin</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Target</th></tr></thead><tbody>{data.slice(0,50).map((a:any)=>(<tr key={a.id} className="border-b hover:bg-white/[0.02]" style={{borderColor:'var(--border-subtle)'}}><td className="p-3 font-mono" style={{color:'var(--text-muted)'}}>{a.timestamp?.slice(0,16)||a.created_at?.slice(0,16)}</td><td className="p-3">{a.admin_tier==='ALPHA'?<span style={{color:'var(--accent-gold)'}}>ALPHA</span>:<span className="text-blue-300">BETA</span>}</td><td className="p-3">{a.action_performed}</td><td className="p-3" style={{color:'var(--text-secondary)'}}>{a.target_module}</td></tr>))}</tbody></table></div>}</div>)}

          {/* SETTINGS */}
          {tab==='settings'&&(<div className="card p-5 max-w-lg">
            <h3 className="text-sm font-semibold mb-3">API Health</h3>
            <div className="space-y-2">{Object.entries(apiHealth).map(([k,v])=>(<div key={k} className="flex items-center justify-between py-1.5"><span className="text-xs" style={{color:'var(--text-secondary)'}}>{k}</span><span className={`text-[10px] px-2 py-0.5 rounded-full ${v==='healthy'||v==='configured'?'bg-green-600/15 text-green-300':'bg-red-600/15 text-red-300'}`}>{v}</span></div>))}</div>
            <button onClick={checkHealth} className="btn-ghost text-xs mt-3"><RefreshCw className="w-3 h-3"/>Refresh</button>
          </div>)}
        </motion.div>
      </div>
    </div>
  )
}
