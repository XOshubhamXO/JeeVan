import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  /* 1. Brevo — primary (free: 300 emails/day, unlimited contacts) */
  const brevoKey = process.env.BREVO_API_KEY
  const brevoList = process.env.BREVO_LIST_ID
  if (brevoKey && brevoList) {
    try {
      const r = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST', headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, attributes: { FNAME: name || '' }, listIds: [parseInt(brevoList)] }),
        signal: AbortSignal.timeout(8000),
      })
      if (r.ok || r.status === 204) return NextResponse.json({ success: true, source: 'Brevo' })
    } catch {}
  }

  /* 2. Mailchimp — backup */
  const mcKey = process.env.MAILCHIMP_API_KEY
  const mcList = process.env.MAILCHIMP_LIST_ID
  const dc = mcKey?.split('-')[1]
  if (mcKey && mcList && dc) {
    try {
      const r = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${mcList}/members`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `apikey ${mcKey}` },
        body: JSON.stringify({ email_address: email, status: 'subscribed', merge_fields: { FNAME: name || '' } }),
        signal: AbortSignal.timeout(8000),
      })
      if (r.ok) return NextResponse.json({ success: true, source: 'Mailchimp' })
    } catch {}
  }

  /* 3. Supabase — final fallback */
  try {
    const SU = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iylyhdddvpsckinpnyxw.supabase.co'
    const AK = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    await fetch(`${SU}/rest/v1/newsletter_subscribers`, {
      method: 'POST', headers: { apikey: AK, Authorization: `Bearer ${AK}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email, subscribed_at: new Date().toISOString() }),
    })
    return NextResponse.json({ success: true, source: 'Supabase' })
  } catch { return NextResponse.json({ success: false }, { status: 500 }) }
}
