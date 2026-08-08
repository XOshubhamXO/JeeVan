import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  const dc = apiKey?.split('-')[1]

  if (apiKey && listId && dc) {
    try {
      const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `apikey ${apiKey}` },
        body: JSON.stringify({ email_address: email, status: 'subscribed', merge_fields: { FNAME: name || '' } }),
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) return NextResponse.json({ success: true, source: 'Mailchimp' })
    } catch {}
  }

  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iylyhdddvpsckinpnyxw.supabase.co'
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU'
    await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email, subscribed_at: new Date().toISOString() }),
    })
    return NextResponse.json({ success: true, source: 'Supabase' })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
