'use client'

/**
 * JeeVan Beta Admin Page
 */

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminStore } from '@/lib/store'
import { Shield, LogOut, Package, Image as ImageIcon, DollarSign, Clock } from 'lucide-react'

const BETA_TABS = [
  { id: 'products', label: 'My Products', icon: <Package className="w-4 h-4" /> },
  { id: 'media', label: 'Media', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'history', label: 'Activity Log', icon: <Clock className="w-4 h-4" /> },
]

export default function BetaAdminPage() {
  const { isAuthenticated, tier, username, logout } = useAdminStore()
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    if (!isAuthenticated || tier !== 'BETA') {
      window.location.href = '/'
    }
  }, [isAuthenticated, tier])

  if (!isAuthenticated || tier !== 'BETA') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="opacity-50">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-700/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="font-semibold">JeeVan Beta Panel</h1>
              <p className="text-xs text-blue-400/70 font-mono">PARTNER ADMIN · {username}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto">
          {BETA_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                  : 'bg-white/5 border border-transparent hover:bg-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-30" />
          <h2 className="text-xl font-semibold mb-2">Partner Dashboard</h2>
          <p className="opacity-50 max-w-md mx-auto mb-4">
            You have restricted access to manage assigned venture content.
            All modifications are tracked and visible to the Master Admin (α).
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-300 text-sm">
            <Clock className="w-4 h-4" />
            Activity audited in real-time
          </div>
        </motion.div>
      </div>
    </div>
  )
}
