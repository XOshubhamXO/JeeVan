'use client'

/**
 * JeeVan Mini Survey Module
 *
 * Collects Name, Age, Detected Location, and Primary Interest
 * before entering the main JeeVan Hub.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  User, Calendar, MapPin, Sprout, Trees, Monitor,
  Handshake, Heart, ArrowRight, Loader2,
} from 'lucide-react'
import { useUserStore, type UserInterest } from '@/lib/store'
import { fetchGeolocation } from '@/lib/api/failover'

interface SurveyProps {
  onComplete: () => void
}

const INTERESTS: { id: UserInterest; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'natural_produce',
    label: 'Natural Produce',
    icon: <Sprout className="w-5 h-5" />,
    description: 'Fresh, chemical-free vegetables, fruits, and staples.',
  },
  {
    id: 'nursery_plants',
    label: 'Nursery Plants',
    icon: <Trees className="w-5 h-5" />,
    description: 'Saplings, seeds, ornamentals, and rare heirloom varieties.',
  },
  {
    id: 'tech_consulting',
    label: 'Tech & Consulting',
    icon: <Monitor className="w-5 h-5" />,
    description: 'Software, web apps, hardware, and startup advisory.',
  },
  {
    id: 'partnerships',
    label: 'Partnerships',
    icon: <Handshake className="w-5 h-5" />,
    description: 'Commercial collaboration and institutional partnerships.',
  },
  {
    id: 'social_causes',
    label: 'Social Causes',
    icon: <Heart className="w-5 h-5" />,
    description: 'Environmental awareness, zero-emission, circular economy.',
  },
]

export default function MiniSurvey({ onComplete }: SurveyProps) {
  const { session, setSurveyData, setInterest } = useUserStore()
  const [name, setName] = useState(session.name)
  const [age, setAge] = useState(session.age?.toString() || '')
  const [selectedInterest, setSelectedInterest] = useState<UserInterest | null>(session.interest)
  const [detecting, setDetecting] = useState(true)
  const [locationText, setLocationText] = useState('Detecting...')
  const hasDetected = useRef(false)

  // ─── Auto-detect location ───
  useEffect(() => {
    if (hasDetected.current) return
    hasDetected.current = true

    async function detectLocation() {
      try {
        const { data } = await fetchGeolocation<{ city: string; region: string; country: string; loc: string }>()
        const [lat, lng] = (data.loc || '25.13,85.44').split(',').map(Number)
        const loc = {
          lat,
          lng,
          city: data.city || 'Nalanda',
          region: data.region || 'Bihar',
          country: data.country || 'IN',
        }
        setSurveyData({ detectedLocation: loc })
        setLocationText(`${loc.city}, ${loc.region}, ${loc.country}`)
      } catch {
        // Fallback: use default Nalanda location
        setSurveyData({
          detectedLocation: {
            lat: 25.13,
            lng: 85.44,
            city: 'Nalanda',
            region: 'Bihar',
            country: 'IN',
          },
        })
        setLocationText('Nalanda, Bihar, IN')
      } finally {
        setDetecting(false)
      }
    }

    detectLocation()
  }, [setSurveyData])

  // ─── Handle completion ───
  const handleSubmit = () => {
    setSurveyData({
      name,
      age: age ? parseInt(age) : null,
    })
    if (selectedInterest) {
      setInterest(selectedInterest)
    }
    onComplete()
  }

  const isValid = name.trim().length > 0 && selectedInterest !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto px-4 py-12"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-900/20 backdrop-blur-md border border-amber-700/30 mb-6"
        >
          <User className="w-10 h-10 text-amber-400" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
          Tell us about yourself
        </h1>
        <p className="text-lg opacity-70">
          Just a few details to personalize your JeeVan experience.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium opacity-70 mb-2">
            <User className="w-4 h-4" /> Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
          />
        </div>

        {/* Age */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium opacity-70 mb-2">
            <Calendar className="w-4 h-4" /> Age (optional)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Your age"
            min="1"
            max="120"
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
          />
        </div>

        {/* Detected Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium opacity-70 mb-2">
            <MapPin className="w-4 h-4" /> Detected Location
          </label>
          <div className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2">
            {detecting ? (
              <Loader2 className="w-4 h-4 animate-spin opacity-60" />
            ) : (
              <MapPin className="w-4 h-4 text-green-400" />
            )}
            <span className={detecting ? 'opacity-50' : ''}>{locationText}</span>
          </div>
        </div>

        {/* Interest Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium opacity-70 mb-3">
            <Sprout className="w-4 h-4" /> What brings you to JeeVan?
          </label>
          <div className="grid gap-2">
            {INTERESTS.map((interest) => (
              <motion.button
                key={interest.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedInterest(interest.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedInterest === interest.id
                    ? 'bg-amber-600/30 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedInterest === interest.id ? 'bg-amber-500/30' : 'bg-white/10'
                }`}>
                  {interest.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{interest.label}</p>
                  <p className="text-sm opacity-60">{interest.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8 flex justify-end">
        <motion.button
          whileTap={isValid ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium transition-all ${
            isValid
              ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/30'
              : 'bg-white/10 opacity-30 cursor-not-allowed'
          }`}
        >
          Enter JeeVan Hub
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}
