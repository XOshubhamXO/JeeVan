import { NextRequest, NextResponse } from 'next/server'

/* Firebase Auth — free phone (10K/mo) + email (unlimited) */
const FIREBASE_KEY = process.env.FIREBASE_API_KEY || ''
const FIREBASE_URL = 'https://identitytoolkit.googleapis.com/v1'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export async function POST(req: NextRequest) {
  const { email, phone, type } = await req.json()
  if (!email && !phone) return NextResponse.json({ error: 'email or phone required' }, { status: 400 })

  /* Try Firebase first (free tier) */
  if (FIREBASE_KEY) {
    try {
      const body: Record<string, string> = { returnSecureToken: 'true' }
      if (type === 'email' && email) {
        body.email = email
        body.requestType = 'EMAIL_SIGNIN'
      } else if (phone) {
        body.phoneNumber = phone
        body.recaptchaToken = 'demo'
      }
      const r = await fetch(`${FIREBASE_URL}/accounts:signUp?key=${FIREBASE_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      })
      if (r.ok) return NextResponse.json({ success: true, auth: 'Firebase' })
    } catch {}
  }

  /* Fallback: Supabase (email only — free) */
  if (type === 'email' && email) {
    try {
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
      const r = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
        method: 'POST',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, create_user: true }),
      })
      return NextResponse.json({ success: r.ok, auth: 'Supabase' }, { status: r.ok ? 200 : 400 })
    } catch {}
  }

  /* Guest mode — always succeeds */
  return NextResponse.json({ success: true, auth: 'Guest' })
}
