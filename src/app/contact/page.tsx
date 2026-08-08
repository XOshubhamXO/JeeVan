'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Mail, MessageCircle, Send, Check } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name:'', interest:'', message:'' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = encodeURIComponent(`JeeVan Inquiry from ${form.name}. Interest: ${form.interest}. Message: ${form.message}`)
    window.open(`https://wa.me/919009790421?text=${msg}`, '_blank')
    setSent(true)
  }

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="label" style={{color:'var(--accent-green)'}}>Get in Touch</span>
            <h1 style={{fontFamily:'var(--font-display)'}}>Contact JeeVan</h1>
            <p className="lead mt-3">Order saplings, inquire about services, or partner with us. We respond within 24 hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {icon:<Phone className="w-5 h-5"/>,label:'Phone / WhatsApp',value:'+91 XXXXXXXXXX',href:'https://wa.me/919009790421',color:'var(--accent-green)'},
              {icon:<MapPin className="w-5 h-5"/>,label:'Visit Us',value:'Vill-Mahamadpur, Nalanda, Bihar',color:'var(--accent-gold)'},
              {icon:<Mail className="w-5 h-5"/>,label:'Email',value:'meshubham943@gmail.com',href:'mailto:meshubham943@gmail.com',color:'var(--accent-sage)'},
            ].map(c=>(
              <div key={c.label} className="card p-6 text-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{background:'rgba(90,158,75,0.1)',color:c.color}}>{c.icon}</div>
                <p className="label mb-1">{c.label}</p>
                {c.href ? <a href={c.href} className="text-sm hover:underline" style={{color:'var(--text-secondary)'}}>{c.value}</a> : <p className="text-sm" style={{color:'var(--text-secondary)'}}>{c.value}</p>}
              </div>
            ))}
          </div>

          <div className="card p-8">
            <h2 className="mb-6" style={{fontFamily:'var(--font-display)'}}>Send a Message</h2>
            {sent ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-8">
                <Check className="w-12 h-12 mx-auto mb-4" style={{color:'var(--accent-green)'}}/>
                <p className="lead">Message sent! We&apos;ll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="label block mb-1">Name</label><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" placeholder="Your name"/></div>
                <div><label className="label block mb-1">Interest</label><select required value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})} className="input"><option value="">Select...</option><option>Plant Nursery / Saplings</option><option>Gardening Services</option><option>Tech Consulting</option><option>Creative Media</option><option>Partnership</option><option>Other</option></select></div>
                <div><label className="label block mb-1">Message</label><textarea rows={4} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="input resize-none" placeholder="Tell us what you need..."/></div>
                <button type="submit" className="btn-primary w-full justify-center">
                  <MessageCircle className="w-4 h-4"/> Send via WhatsApp <Send className="w-4 h-4"/>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="small">JeeVan · Vill-Mahamadpur, Nalanda, Bihar · Built with 🌱 by Shubham Saurabh</p>
      </footer>
    </div>
  )
}
