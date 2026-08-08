/**
 * JeeVan Admin Auth API
 * POST /api/admin/auth
 * Validates against Supabase admin_users. Falls back to env hashes. Last resort: static hash.
 */
import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import {
  checkRateLimit, recordAuthFailure, clearAuthFailures,
  detectBruteForce, extractClientIP, generateAdminToken, sanitizeInput,
} from '@/lib/security/auth-middleware'

// Static fallback — works even without Supabase or env vars
const STATIC_HASH = '$2b$12$dI9d9e/jNFhcFta/e5hhEOdJO.czpTBHaY0QtzdkcFB9xC1lOkerC' // JeeVan-Alpha-2024

export async function POST(request: NextRequest) {
  try {
    const ip = extractClientIP(request.headers, request.headers.get('x-forwarded-for'))

    const bruteCheck = detectBruteForce(ip)
    if (bruteCheck.blocked) {
      return NextResponse.json({ error: bruteCheck.reason }, { status: 429 })
    }
    const rateCheck = checkRateLimit(ip, 'ADMIN_AUTH')
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: `Too many attempts. Retry in ${rateCheck.retryAfter}s` }, { status: 429 })
    }

    const body = await request.json()
    const passkey = sanitizeInput(body.passkey || '')
    if (!passkey) return NextResponse.json({ error: 'Passkey required' }, { status: 400 })

    // Try Supabase first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && serviceKey) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/admin_users?select=*&is_active=is.true`, {
          headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
          signal: AbortSignal.timeout(5000),
        })
        if (res.ok) {
          const admins = await res.json()
          for (const admin of admins) {
            if (await compare(passkey, admin.passkey_hash)) {
              clearAuthFailures(ip)
              return NextResponse.json({
                success: true,
                token: generateAdminToken(admin.id, admin.admin_tier),
                admin: { id: admin.id, username: admin.username, tier: admin.admin_tier, ventures: admin.assigned_ventures },
              })
            }
          }
        }
      } catch {}
    }

    // Try env hashes
    const alphaHash = process.env.ADMIN_ALPHA_PASSKEY_HASH
    const betaHash = process.env.ADMIN_BETA_PASSKEY_HASH
    if (alphaHash) {
      const m = await compare(passkey, alphaHash)
      if (m) {
        clearAuthFailures(ip)
        return NextResponse.json({ success: true, token: generateAdminToken('91532c20-863c-4380-9ddd-6e52816370d1','ALPHA'), admin: { id:'91532c20-863c-4380-9ddd-6e52816370d1', username:'shubham', tier:'ALPHA', ventures:['nursery','gardening','tech','studio','marketplace'] }})
      }
    }
    if (betaHash) {
      const m = await compare(passkey, betaHash)
      if (m) {
        clearAuthFailures(ip)
        return NextResponse.json({ success: true, token: generateAdminToken('c9a8b410-fa3f-40c4-b755-49c274416145','BETA'), admin: { id:'c9a8b410-fa3f-40c4-b755-49c274416145', username:'partner_nursery', tier:'BETA', ventures:['nursery'] }})
      }
    }

    // Last resort: static hash
    if (await compare(passkey, STATIC_HASH)) {
      clearAuthFailures(ip)
      return NextResponse.json({ success: true, token: generateAdminToken('91532c20-863c-4380-9ddd-6e52816370d1','ALPHA'), admin: { id:'91532c20-863c-4380-9ddd-6e52816370d1', username:'shubham', tier:'ALPHA', ventures:['nursery','gardening','tech','studio','marketplace'] }})
    }

    recordAuthFailure(ip)
    return NextResponse.json({ error: 'Invalid passkey' }, { status: 401 })
  } catch (err) {
    console.error('[Auth]', err)
    return NextResponse.json({ error: 'Authentication service error' }, { status: 500 })
  }
}
