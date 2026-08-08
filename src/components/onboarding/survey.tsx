/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Sprout, Heart, Check, ArrowRight } from 'lucide-react'
import { useUserStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n'

const INTERESTS = [
  { id: 'natural_produce', label: 'Natural Produce', icon: <Sprout className="w-4 h-4" />, desc: 'Fresh organic vegetables & fruits' },
  { id: 'nursery_plants', label: 'Nursery Plants', icon: <Sprout className="w-4 h-4" />, desc: 'Saplings, seeds & rare varieties' },
  { id: 'tech_consulting', label: 'Tech Consulting', icon: <Sprout className="w-4 h-4" />, desc: 'Software, PC builds & startup advice' },
  { id: 'partnerships', label: 'Partnerships', icon: <Heart className="w-4 h-4" />, desc: 'Collaborate with JeeVan' },
  { id: 'social_causes', label: 'Social Causes', icon: <Heart className="w-4 h-4" />, desc: 'Pedal4Planet & Adira Biocycle' },
]

export default function MiniSurvey({ onComplete }: { onComplete: () => void }) {
  const { session, setSurveyData, setInterest, completeOnboarding } = useUserStore()
  const { t } = useI18n()
  const [name, setName] = useState(session.name || '')
  const [age, setAge] = useState(session.age?.toString() || '')
  const [location, setLocation] = useState(session.countryName || '')
  const [interest, setInterestLocal] = useState<string | null>(session.interest || null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSurveyData({
      name: name || 'Friend',
      age: age ? parseInt(age) : null,
      countryName: location || session.countryName,
    })
    if (interest) setInterest(interest as any)
    
    // Send telemetry
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'onboarding',
        name: name || 'Friend',
        age: age || null,
        country: location || session.countryName,
        language: session.selectedLanguage,
        theme: session.selectedTheme,
        interest,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {})
    
    setSubmitted(true)
    setTimeout(() => {
      completeOnboarding()
      onComplete()
    }, 800)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'rgba(74,103,65,0.07)', border: '1px solid rgba(74,103,65,0.12)' }}>
          <User className="w-8 h-8" style={{ color: 'var(--accent-green)' }} />
        </motion.div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Tell us about yourself</h1>
        <p className="lead max-w-md mx-auto mt-3">Help us personalize your JeeVan experience. This helps us show relevant crops and content.</p>
      </div>

      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(74,103,65,0.1)' }}>
            <Check className="w-10 h-10" style={{ color: 'var(--accent-green)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-xl mb-2">Welcome to JeeVan, {name || 'Friend'}!</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Redirecting to your dashboard...</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="label flex items-center gap-2 mb-2"><User className="w-3.5 h-3.5" />{t('survey.name')}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input" />
          </div>

          {/* Age */}
          <div>
            <label className="label flex items-center gap-2 mb-2">{t('survey.age')}</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" min="1" max="120" className="input" />
          </div>

          {/* Location */}
          <div>
            <label className="label flex items-center gap-2 mb-2"><MapPin className="w-3.5 h-3.5" />{t('survey.location')}</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder={session.countryName || 'Detected location'} className="input" />
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Auto-detected from your country selection</p>
          </div>

          {/* Interests */}
          <div>
            <label className="label flex items-center gap-2 mb-3"><Heart className="w-3.5 h-3.5" />{t('survey.interest')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INTERESTS.map(i => (
                <motion.button key={i.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setInterestLocal(i.id === interest ? null : i.id)}
                  className="p-3.5 rounded-xl border transition-all duration-200 text-left flex items-center gap-2.5"
                  style={{
                    background: interest === i.id ? 'rgba(74,103,65,0.08)' : 'var(--bg-surface)',
                    borderColor: interest === i.id ? 'rgba(74,103,65,0.3)' : 'var(--border-subtle)',
                  }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(74,103,65,0.08)', color: 'var(--accent-green)' }}>{i.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{i.label}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{i.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button onClick={handleSubmit}
              className="px-10 py-3.5 rounded-full text-white font-medium transition-all hover:scale-105"
              style={{ background: 'var(--accent-green)', boxShadow: '0 4px 20px rgba(74,103,65,0.3)' }}>
              {t('survey.enter_hub')} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
