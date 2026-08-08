import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = 'https://iylyhdddvpsckinpnyxw.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHloZGRkdnBzY2tpbnBueXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjEyMDEsImV4cCI6MjEwMTU5NzIwMX0.SkAD08YZ_224wous50WUOi5x_BY6Nvg_BBOVf3N9XRU'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q')||'').trim()
  if (!q || q.length < 2) return NextResponse.json({ plants:[], ventures:[], total:0, query:q })

  const results: { plants:unknown[]; ventures:unknown[] } = { plants:[], ventures:[] }
  const headers = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }

  try {
    const pr = await fetch(`${SUPABASE_URL}/rest/v1/plant_directory?select=id,common_name,botanical_name,category,description&or=(common_name.ilike.*${encodeURIComponent(q)}*,botanical_name.ilike.*${encodeURIComponent(q)}*)&is_active=is.true&limit=8`, { headers, signal: AbortSignal.timeout(5000) })
    if (pr.ok) results.plants = await pr.json()
  } catch {}

  try {
    const vr = await fetch(`${SUPABASE_URL}/rest/v1/ventures?select=id,slug,venture_name,category,description&or=(venture_name.ilike.*${encodeURIComponent(q)}*,description.ilike.*${encodeURIComponent(q)}*)&limit=6`, { headers, signal: AbortSignal.timeout(5000) })
    if (vr.ok) results.ventures = await vr.json()
  } catch {}

  return NextResponse.json({ ...results, total: (results.plants as unknown[]).length + (results.ventures as unknown[]).length, query: q })
}
