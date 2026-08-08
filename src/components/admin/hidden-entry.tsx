'use client'

/**
 * JeeVan Hidden Admin Entry Point
 *
 * A nearly invisible, semi-transparent trigger node positioned
 * in the bottom-left corner. Reveals an encrypted passkey prompt.
 * Authenticates via POST /api/admin/auth with bcrypt verification.
 *
 * Alpha passkey: JeeVan-Alpha-2024
 * Beta passkey:  JeeVan-Beta-2024
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, EyeOff, Lock, ArrowRight } from 'lucide-react'
import { useAdminStore } from '@/lib/store'

export default function HiddenAdminEntry() {
  const [showPasskey, setShowPasskey] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [showPasskeyText, setShowPasskeyText] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminStore()

  // ─── Handle passkey submission ───
  const handleSubmit = useCallback(async () => {
    if (!passkey.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      // Store token in sessionStorage for page refreshes
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('jeevan_admin_token', data.token)
        sessionStorage.setItem('jeevan_admin', JSON.stringify(data.admin))
      }

      login(
        data.admin.tier,
        data.admin.id,
        data.admin.username,
      )

      setShowPasskey(false)
      setPasskey('')

      // Redirect to admin dashboard
      if (data.admin.tier === 'ALPHA') {
        window.location.href = '/admin/alpha'
      } else {
        window.location.href = '/admin/beta'
      }
    } catch {
      setError('Network error. Please try again.')
    }

    setLoading(false)
  }, [passkey, login])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setShowPasskey(false)
      setError('')
    }
  }

  return (
    <>
      {/* Hidden Trigger Node */}
      <div className="fixed bottom-4 left-4 z-50">
        <motion.button
          onClick={() => setShowPasskey(true)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-30 hover:opacity-60 transition-all duration-300 group"
          title=""
          aria-label="Admin access"
        >
          <Shield className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      {/* Passkey Modal */}
      <AnimatePresence>
        {showPasskey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPasskey(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-green-900/30 border border-green-700/30 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mb-2">
                Admin Authentication
              </h2>
              <p className="text-sm opacity-50 text-center mb-6">
                Enter your encrypted passkey to access the control panel.
              </p>

              {/* Passkey Input */}
              <div className="relative mb-4">
                <input
                  type={showPasskeyText ? 'text' : 'password'}
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value)
                    setError('')
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter passkey..."
                  autoFocus
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
                <button
                  onClick={() => setShowPasskeyText(!showPasskeyText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPasskeyText ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm mb-4 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading || !passkey.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all ${
                  loading || !passkey.trim()
                    ? 'bg-white/10 opacity-30 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/30'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Authenticate
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Close */}
              <button
                onClick={() => {
                  setShowPasskey(false)
                  setError('')
                }}
                className="w-full mt-3 py-2 text-sm opacity-40 hover:opacity-70 transition-opacity"
              >
                Cancel
              </button>

              {/* Tier indicator */}
              <div className="mt-6 pt-4 border-t border-white/10 flex gap-2 text-xs opacity-30">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Alpha: Master Admin
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Beta: Partner Admin
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
