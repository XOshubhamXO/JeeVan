'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Globe, Sprout, LogOut, Save, Check, ShoppingBag, Heart } from 'lucide-react'
import { useAuthStore, type User as UserType } from '@/lib/store/auth'
import { useUserStore } from '@/lib/store'

export default function AccountPage() {
  const { user, isAuthenticated, login, updateProfile, logout } = useAuthStore()
  const { session } = useUserStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UserType>({
    id: Date.now().toString(),
    name: session.name || '',
    email: '',
    phone: '+919009790421',
    country: session.countryName || 'India',
    language: session.selectedLanguage || 'en',
    theme: session.selectedTheme || 'nature',
    interests: session.interest ? [session.interest] : [],
    createdAt: new Date().toISOString(),
  })
  const [saved, setSaved] = useState(false)

  // Auto-login from session if available
  React.useEffect(() => {
    if (session.onboardingCompleted && !isAuthenticated) {
      login({ ...form, name: session.name || 'Friend', country: session.countryName || 'India', language: session.selectedLanguage || 'en', theme: session.selectedTheme || 'nature' })
    }
  }, [session.onboardingCompleted])

  const handleSave = () => {
    updateProfile(form)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const interests = ['natural_produce','nursery_plants','tech_consulting','partnerships','social_causes']
  const interestLabels: Record<string,string> = { natural_produce:'Natural Produce', nursery_plants:'Nursery Plants', tech_consulting:'Tech Consulting', partnerships:'Partnerships', social_causes:'Social Causes' }

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{background:'var(--bg-secondary)',border:'2px solid var(--accent-green)',color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <h1 style={{fontFamily:'var(--font-display)'}}>My Account</h1>
            <p className="text-sm mt-2" style={{color:'var(--text-muted)'}}>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'today'}</p>
          </div>

          {saved && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6 px-4 py-3 rounded-lg text-center text-sm flex items-center justify-center gap-2" style={{background:'rgba(90,158,75,0.1)',border:'1px solid rgba(90,158,75,0.2)',color:'var(--accent-green)'}}>
              <Check className="w-4 h-4" /> Profile updated
            </motion.div>
          )}

          <div className="card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Profile</h2>
              <button onClick={() => setEditing(!editing)} className="text-xs" style={{color:'var(--accent-green)'}}>
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label:'Name', icon:<User className="w-4 h-4"/>, key:'name', type:'text' },
                { label:'Email', icon:<Mail className="w-4 h-4"/>, key:'email', type:'email' },
                { label:'Phone', icon:<Phone className="w-4 h-4"/>, key:'phone', type:'tel' },
                { label:'Country', icon:<Globe className="w-4 h-4"/>, key:'country', type:'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="label flex items-center gap-1.5 mb-1.5">{field.icon}{field.label}</label>
                  {editing ? (
                    <input type={field.type} value={form[field.key as keyof UserType] as string} onChange={e => setForm({...form, [field.key]: e.target.value})} className="input text-sm" />
                  ) : (
                    <p className="text-sm" style={{color:'var(--text-secondary)'}}>{(user || form)[field.key as keyof UserType] as string || '—'}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="label flex items-center gap-1.5 mb-2"><Sprout className="w-4 h-4" /> Interests</label>
              <div className="flex flex-wrap gap-2">
                {interests.map(i => {
                  const active = (user || form).interests.includes(i)
                  return editing ? (
                    <button key={i} onClick={() => {
                      const current = [...form.interests]
                      const idx = current.indexOf(i)
                      if (idx >= 0) current.splice(idx, 1)
                      else current.push(i)
                      setForm({...form, interests: current})
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      active ? 'bg-green-600/20 border border-green-500/30 text-green-300' : 'border text-white/40'
                    }`}
                    style={active ? {} : {borderColor:'var(--border-subtle)'}}>{interestLabels[i]}</button>
                  ) : active ? (
                    <span key={i} className="badge-green">{interestLabels[i]}</span>
                  ) : null
                })}
              </div>
            </div>

            {editing && (
              <button onClick={handleSave} className="btn-primary w-full justify-center">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <a href="/shop" className="card p-4 text-center hover-lift">
              <ShoppingBag className="w-6 h-6 mx-auto mb-2" style={{color:'var(--accent-green)'}} />
              <p className="text-xs font-medium">My Orders</p>
            </a>
            <a href="/contact" className="card p-4 text-center hover-lift">
              <Heart className="w-6 h-6 mx-auto mb-2" style={{color:'var(--accent-green)'}} />
              <p className="text-xs font-medium">Support</p>
            </a>
          </div>

          <div className="mt-6 text-center">
            <button onClick={logout} className="btn-ghost text-xs" style={{color:'var(--text-muted)'}}>
              <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
