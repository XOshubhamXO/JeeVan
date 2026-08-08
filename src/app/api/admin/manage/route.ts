import { NextRequest, NextResponse } from 'next/server'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
export async function POST(req: NextRequest) {
  const { table, action, data, id } = await req.json()
  try {
    const h = { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' }
    let res
    if (action === 'create') res = await fetch(SUPABASE_URL + '/rest/v1/' + table, { method: 'POST', headers: h, body: JSON.stringify(data) })
    else if (action === 'update') res = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?id=eq.' + id, { method: 'PATCH', headers: h, body: JSON.stringify(data) })
    else if (action === 'delete') res = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?id=eq.' + id, { method: 'DELETE', headers: h })
    else if (action === 'list') res = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?select=*&limit=100', { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } })
    else return NextResponse.json({ error: 'invalid action' }, { status: 400 })
    const result = await res.json().catch(() => ({}))
    return NextResponse.json({ success: res.ok, data: result }, { status: res.ok ? 200 : 400 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
