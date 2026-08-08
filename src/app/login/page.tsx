'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'email'|'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'input'|'otp'>('input')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(mode==='email'?{email,type:'email'}:{phone,type:'phone'}) })
      if (r.ok) setStep('otp')
    } catch {}
    setLoading(false)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await fetch('/api/auth/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({token:otp,type:mode,identifier:mode==='email'?email:phone}) })
      if (r.ok) window.location.href = '/hub'
    } catch {}
    setLoading(false)
  }

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(90,158,75,0.1)',border:'1px solid rgba(90,158,75,0.2)'}}><LogIn className="w-7 h-7" style={{color:'var(--accent-green)'}}/></div>
          <h1 className="text-xl" style={{fontFamily:'var(--font-display)'}}>{step==='input'?'Sign In':'Verify OTP'}</h1>
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={()=>{setMode('email');setStep('input')}} className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${mode==='email'?'bg-green-600/20 border border-green-500/30 text-green-300':'border text-white/40'}`} style={mode==='email'?{}:{borderColor:'var(--border-subtle)'}}><Mail className="w-4 h-4 inline mr-1"/>Email</button>
          <button onClick={()=>{setMode('phone');setStep('input')}} className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${mode==='phone'?'bg-green-600/20 border border-green-500/30 text-green-300':'border text-white/40'}`} style={mode==='phone'?{}:{borderColor:'var(--border-subtle)'}}><Phone className="w-4 h-4 inline mr-1"/>Phone</button>
        </div>
        {step==='input'?(
          <form onSubmit={handleSendOtp} className="space-y-4">
            {mode==='email'?<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="input"/>:<input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 90097 90421" className="input"/>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading?'Sending...':'Send OTP'}</button>
          </form>
        ):(
          <form onSubmit={handleVerify} className="space-y-4">
            <input type="text" required value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 6-digit code" className="input text-center text-lg tracking-widest" maxLength={6}/>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading?'Verifying...':'Verify & Login'}</button>
          </form>
        )}
        <p className="text-[10px] text-center mt-6" style={{color:'var(--text-muted)'}}>Free OTP via REST API. Email + Phone supported. No passwords.</p>
        <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px" style={{background:'var(--border-subtle)'}}/><span className="text-[10px]" style={{color:'var(--text-muted)'}}>OR</span><div className="flex-1 h-px" style={{background:'var(--border-subtle)'}}/></div>
        <button onClick={()=>{window.location.href='/hub'}} className="btn-secondary w-full justify-center text-xs">Continue as Guest</button>
      </motion.div>
    </div>
  )
}
