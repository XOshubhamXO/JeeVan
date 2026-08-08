/**
 * GET /api/market — Mandi Rates
 * Primary: Agmarknet (Data.gov.in) → Fallback: cached Bihar prices
 */
import { NextRequest, NextResponse } from 'next/server'

const CACHE: Record<string, { min:number;max:number;modal:number;market:string;state:string;district:string;unit:string }[]> = {
  rice: [
    {min:2800,max:4200,modal:3500,market:'Patna',state:'Bihar',district:'Patna',unit:'quintal'},
    {min:2600,max:4000,modal:3200,market:'Nalanda',state:'Bihar',district:'Nalanda',unit:'quintal'},
    {min:3000,max:4500,modal:3700,market:'Azadpur',state:'Delhi',district:'North Delhi',unit:'quintal'},
  ],
  wheat: [
    {min:2200,max:2800,modal:2500,market:'Patna',state:'Bihar',district:'Patna',unit:'quintal'},
    {min:2100,max:2700,modal:2400,market:'Nalanda',state:'Bihar',district:'Nalanda',unit:'quintal'},
  ],
  maize: [{min:1800,max:2400,modal:2100,market:'Begusarai',state:'Bihar',district:'Begusarai',unit:'quintal'}],
  turmeric: [
    {min:8000,max:14000,modal:11000,market:'Nizamabad',state:'Telangana',district:'Nizamabad',unit:'quintal'},
    {min:7500,max:13000,modal:10500,market:'Erode',state:'Tamil Nadu',district:'Erode',unit:'quintal'},
  ],
  onion: [
    {min:1200,max:2200,modal:1800,market:'Lasalgaon',state:'Maharashtra',district:'Nashik',unit:'quintal'},
    {min:1400,max:2400,modal:2000,market:'Patna',state:'Bihar',district:'Patna',unit:'quintal'},
  ],
  potato: [
    {min:1000,max:1800,modal:1400,market:'Agra',state:'UP',district:'Agra',unit:'quintal'},
    {min:1100,max:1900,modal:1500,market:'Nalanda',state:'Bihar',district:'Nalanda',unit:'quintal'},
  ],
  tomato: [{min:800,max:2000,modal:1400,market:'Kolar',state:'Karnataka',district:'Kolar',unit:'quintal'}],
  mango: [{min:3000,max:8000,modal:5000,market:'Malda',state:'West Bengal',district:'Malda',unit:'quintal'}],
  ginger: [{min:4000,max:7000,modal:5500,market:'Kochi',state:'Kerala',district:'Ernakulam',unit:'quintal'}],
}

export async function GET(req: NextRequest) {
  const commodity = (req.nextUrl.searchParams.get('commodity')||'').toLowerCase()
  const state = (req.nextUrl.searchParams.get('state')||'').toLowerCase()

  // Primary: Agmarknet live API
  const agmarknetKey = process.env.AGMARKNET_API_KEY
  if (agmarknetKey && commodity) {
    try {
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${agmarknetKey}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}`
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (r.ok) {
        const d = await r.json()
        if (d.records && d.records.length > 0) {
          // Store for history
          storeHistory(commodity, d.records)
          return NextResponse.json({ data: d.records, source: 'Agmarknet (Data.gov.in) — Live' })
        }
      }
    } catch (e) { console.warn('[Market] Agmarknet error:', e) }
  }

  // Fallback: cached prices
  if (commodity && CACHE[commodity]) {
    let prices = CACHE[commodity]
    if (state) prices = prices.filter(p => p.state.toLowerCase().includes(state) || p.district.toLowerCase().includes(state))
    return NextResponse.json({ data: prices, source: 'JeeVan Market Database (cached)' })
  }

  return NextResponse.json({ available: Object.keys(CACHE), hint: 'Use ?commodity=rice&state=bihar', source: 'JeeVan' })
}

async function storeHistory(commodity: string, records: unknown[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || !records?.length) return
  try {
    for (const r of records as Record<string,unknown>[]) {
      await fetch(`${url}/rest/v1/market_rates`, {
        method: 'POST',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          commodity_name: commodity, market_name: (r.market as string)||'',
          state: (r.state as string)||'', district: (r.district as string)||'',
          min_price: parseFloat((r.min_price as string)||'0'), max_price: parseFloat((r.max_price as string)||'0'),
          modal_price: parseFloat((r.modal_price as string)||'0'), unit: 'quintal',
          recorded_date: new Date().toISOString().slice(0,10), source_api: 'Agmarknet',
        }),
      })
    }
  } catch {}
}
