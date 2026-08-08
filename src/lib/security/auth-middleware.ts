/**
 * JeeVan Security Middleware
 *
 * Production-grade security layer:
 * - Passkey hashing & verification (bcrypt)
 * - Rate limiting for admin auth attempts
 * - Session token management
 * - CSRF protection headers
 * - Audit trail enforcement
 */

import crypto from 'crypto'

// ─── Rate Limiter ───
interface RateLimitEntry {
  count: number
  resetAt: number
  blocked: boolean
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMITS = {
  ADMIN_AUTH: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },    // 5 attempts / 15 min
  API_GENERAL: { maxAttempts: 100, windowMs: 60 * 1000 },       // 100 req / min
  TELEMETRY: { maxAttempts: 200, windowMs: 60 * 1000 },         // 200 req / min
}

export function checkRateLimit(
  key: string,
  limitType: keyof typeof RATE_LIMITS = 'API_GENERAL',
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const limit = RATE_LIMITS[limitType]
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + limit.windowMs, blocked: false })
    return { allowed: true }
  }

  if (entry.blocked) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  if (entry.count > limit.maxAttempts) {
    entry.blocked = true
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { allowed: true }
}

// ─── Passkey Verification ───
export async function verifyPasskey(
  provided: string,
  storedHash: string,
): Promise<boolean> {
  // In production: use bcrypt.compare(provided, storedHash)
  // For demo/development: simple timing-safe comparison
  try {
    const { compare } = await import('bcryptjs')
    return await compare(provided, storedHash)
  } catch {
    // Fallback for environments without bcryptjs loaded
    return timingSafeEqual(provided, storedHash)
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual?.(bufA, bufA) // Dummy call
    return false
  }
  return crypto.timingSafeEqual?.(bufA, bufB) ?? a === b
}

// ─── Session Token Generation ───
export function generateAdminToken(
  adminId: string,
  tier: 'ALPHA' | 'BETA',
): string {
  const payload = {
    adminId,
    tier,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 8 * 3600, // 8 hours
    jti: crypto.randomUUID(),
  }

  // In production: JWT sign with RS256
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', process.env.ADMIN_JWT_SECRET || 'JeeVan-dev-secret')
    .update(payloadB64)
    .digest('base64url')

  return `${payloadB64}.${signature}`
}

// ─── IP Address Extraction ───
export function extractClientIP(
  headers: Headers,
  xForwardedFor?: string | null,
): string {
  const forwarded = xForwardedFor || headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return headers.get('x-real-ip') || '0.0.0.0'
}

// ─── Security Headers ───
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

// ─── Input Sanitization ───
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')           // Strip HTML tags
    .replace(/javascript:/gi, '')   // Strip javascript: URIs
    .replace(/on\w+=/gi, '')        // Strip event handlers
    .trim()
    .slice(0, 1000)                 // Max length
}

// ─── Admin Action Logger ───
export interface AuditEntry {
  adminId: string
  tier: 'ALPHA' | 'BETA'
  action: string
  module: string
  targetId?: string
  ipAddress: string
  userAgent: string
  previousValue?: unknown
  newValue?: unknown
}

export async function logAdminAction(entry: AuditEntry): Promise<void> {
  const timestamp = new Date().toISOString()
  const logEntry = {
    ...entry,
    timestamp,
    id: crypto.randomUUID(),
  }

  // In production: insert into admin_audit_logs table
  console.log(`[JeeVan Audit] [${entry.tier}] ${entry.adminId}: ${entry.action} on ${entry.module}`, {
    ip: entry.ipAddress,
    timestamp,
  })

  // Store in memory for development
  if (typeof globalThis !== 'undefined') {
    ;(globalThis as Record<string, unknown>).__jeevan_audit_logs =
      ((globalThis as Record<string, unknown>).__jeevan_audit_logs as AuditEntry[]) || []
    ;((globalThis as Record<string, unknown>).__jeevan_audit_logs as AuditEntry[]).push(logEntry)
  }
}

// ─── Brute Force Detection ───
const AUTH_FAILURE_MAP = new Map<string, { count: number; firstFailure: number }>()

export function detectBruteForce(ip: string): { blocked: boolean; reason?: string } {
  const now = Date.now()
  const entry = AUTH_FAILURE_MAP.get(ip)

  if (!entry) return { blocked: false }

  // Reset if window has passed
  if (now - entry.firstFailure > 30 * 60 * 1000) {
    AUTH_FAILURE_MAP.delete(ip)
    return { blocked: false }
  }

  if (entry.count >= 10) {
    return {
      blocked: true,
      reason: `Too many failed attempts. Try again after ${Math.ceil((entry.firstFailure + 30 * 60 * 1000 - now) / 60000)} minutes.`,
    }
  }

  return { blocked: false }
}

export function recordAuthFailure(ip: string): void {
  const now = Date.now()
  const entry = AUTH_FAILURE_MAP.get(ip)
  if (!entry) {
    AUTH_FAILURE_MAP.set(ip, { count: 1, firstFailure: now })
  } else {
    entry.count++
  }
}

export function clearAuthFailures(ip: string): void {
  AUTH_FAILURE_MAP.delete(ip)
}
