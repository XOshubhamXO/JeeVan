'use client'

/**
 * JeeVan Alpha Admin Page
 *
 * Master Admin (α) — Full platform control.
 * Restores session from sessionStorage on page refresh.
 */

import React, { useEffect, useState } from 'react'
import { useAdminStore } from '@/lib/store'
import AlphaDashboard from '@/components/admin/alpha-dashboard'

export default function AlphaAdminPage() {
  const { isAuthenticated, tier, login } = useAdminStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Restore admin session from storage on page refresh
    if (!isAuthenticated && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('jeevan_admin')
      if (stored) {
        try {
          const admin = JSON.parse(stored)
          login(admin.tier, admin.id, admin.username)
        } catch {
          sessionStorage.removeItem('jeevan_admin')
        }
      }
    }
    setReady(true)
  }, [isAuthenticated, login])

  useEffect(() => {
    if (ready && (!isAuthenticated || tier !== 'ALPHA')) {
      window.location.href = '/'
    }
  }, [ready, isAuthenticated, tier])

  if (!ready || !isAuthenticated || tier !== 'ALPHA') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="opacity-50">Authenticating...</p>
      </div>
    )
  }

  return <AlphaDashboard />
}
