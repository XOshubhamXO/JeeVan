'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Mail, MessageCircle, Send, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name:'', interest:'', message:'' })
  const { t } = useI18n()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = encodeURIComponent(`JeeVan Inquiry from ${form.name}. Interest: ${form.interest}. Message: ${form.message}`)
    window.open(`https://wa.me/919009790421?text=${msg}`, '_blank')
    setSent(true)
  }

  const interests = [
    t('contact.form.interest.nursery'),
    t('contact.form.interest.gardening'),
    t('contact.form.interest.tech'),
    t('contact.form.interest.media'),
    t('contact.form.interest.partnership'),
    t('contact.form.interest.other'),
  ]

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="label" style={{color:'var(--accent-green)'}}>{t('contact.label')}</span>
            <h1 style={{fontFamily:'var(--font-display)'}}>{t('contact.heading')}</h1>
            <p className="lead mt-3">{t('contact.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {icon:<Phone className="w-5 h-5"/>,label:t('contact.phone.label'),value:t('contact.phone.value'),href:'https://wa.me/919009790421',color:'var(--accent-green)'},
              {icon:<MapPin className="w-5 h-5"/>,label:t('contact.location.label'),value:t('contact.location.value'),color:'var(--accent-gold)'},
              {icon:<Mail className="w-5 h-5"/>,label:t('contact.email.label'),value:t('contact.email.value'),href:'mailto:meshubham943@gmail.com',color:'var(--accent-sage)'},
            ].map(c=>(
              <div key={c.label} className="card p-6 text-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{background:'rgba(90,158,75,0.1)',color:c.color}}>{c.icon}</div>
                <p className="label mb-1">{c.label}</p>
                {c.href ? <a href={c.href} className="text-sm hover:underline" style={{color:'var(--text-secondary)'}}>{c.value}</a> : <p className="text-sm" style={{color:'var(--text-secondary)'}}>{c.value}</p>}
              </div>
            ))}
          </div>

          <div className="card p-8">
            <h2 className="mb-6" style={{fontFamily:'var(--font-display)'}}>{t('contact.form.heading')}</h2>
            {sent ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-8">
                <Check className="w-12 h-12 mx-auto mb-4" style={{color:'var(--accent-green)'}}/>
                <p className="lead">{t('contact.form.sent')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="label block mb-1">{t('contact.form.name')}</label><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" placeholder={t('contact.form.name.placeholder')}/></div>
                <div><label className="label block mb-1">{t('contact.form.interest')}</label><select required value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})} className="input"><option value="">{t('contact.form.interest.select')}</option>{interests.map(i=><option key={i}>{i}</option>)}</select></div>
                <div><label className="label block mb-1">{t('contact.form.message')}</label><textarea rows={4} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="input resize-none" placeholder={t('contact.form.message.placeholder')}/></div>
                <button type="submit" className="btn-primary w-full justify-center">
                  <MessageCircle className="w-4 h-4"/> {t('contact.form.submit')} <Send className="w-4 h-4"/>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <footer className="py-12 px-6 text-center border-t" style={{borderColor:'var(--border-subtle)'}}>
        <p className="small">{t('footer.tagline')}</p>
      </footer>
    </div>
  )
}
