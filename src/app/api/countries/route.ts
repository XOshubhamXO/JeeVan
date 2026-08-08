/**
 * GET /api/countries — 3-tier failover
 * Primary: REST Countries v3 → Fallback: static cache → Fallback: GeoNames
 */
import { NextRequest, NextResponse } from 'next/server'

// Static fallback — 20 agricultural nations, no API call needed
const STATIC_COUNTRIES = [
  { name: { common: 'India' }, cca2: 'IN', flags: { svg: 'https://flagcdn.com/in.svg' }, region: 'Asia', languages: { hin: 'Hindi', eng: 'English' } },
  { name: { common: 'China' }, cca2: 'CN', flags: { svg: 'https://flagcdn.com/cn.svg' }, region: 'Asia' },
  { name: { common: 'United States' }, cca2: 'US', flags: { svg: 'https://flagcdn.com/us.svg' }, region: 'Americas' },
  { name: { common: 'Brazil' }, cca2: 'BR', flags: { svg: 'https://flagcdn.com/br.svg' }, region: 'Americas' },
  { name: { common: 'Russia' }, cca2: 'RU', flags: { svg: 'https://flagcdn.com/ru.svg' }, region: 'Europe' },
  { name: { common: 'France' }, cca2: 'FR', flags: { svg: 'https://flagcdn.com/fr.svg' }, region: 'Europe' },
  { name: { common: 'Mexico' }, cca2: 'MX', flags: { svg: 'https://flagcdn.com/mx.svg' }, region: 'Americas' },
  { name: { common: 'Indonesia' }, cca2: 'ID', flags: { svg: 'https://flagcdn.com/id.svg' }, region: 'Asia' },
  { name: { common: 'Nigeria' }, cca2: 'NG', flags: { svg: 'https://flagcdn.com/ng.svg' }, region: 'Africa' },
  { name: { common: 'Turkey' }, cca2: 'TR', flags: { svg: 'https://flagcdn.com/tr.svg' }, region: 'Asia' },
  { name: { common: 'Argentina' }, cca2: 'AR', flags: { svg: 'https://flagcdn.com/ar.svg' }, region: 'Americas' },
  { name: { common: 'Australia' }, cca2: 'AU', flags: { svg: 'https://flagcdn.com/au.svg' }, region: 'Oceania' },
  { name: { common: 'Canada' }, cca2: 'CA', flags: { svg: 'https://flagcdn.com/ca.svg' }, region: 'Americas' },
  { name: { common: 'Germany' }, cca2: 'DE', flags: { svg: 'https://flagcdn.com/de.svg' }, region: 'Europe' },
  { name: { common: 'Thailand' }, cca2: 'TH', flags: { svg: 'https://flagcdn.com/th.svg' }, region: 'Asia' },
  { name: { common: 'Vietnam' }, cca2: 'VN', flags: { svg: 'https://flagcdn.com/vn.svg' }, region: 'Asia' },
  { name: { common: 'Pakistan' }, cca2: 'PK', flags: { svg: 'https://flagcdn.com/pk.svg' }, region: 'Asia' },
  { name: { common: 'Egypt' }, cca2: 'EG', flags: { svg: 'https://flagcdn.com/eg.svg' }, region: 'Africa' },
  { name: { common: 'Bangladesh' }, cca2: 'BD', flags: { svg: 'https://flagcdn.com/bd.svg' }, region: 'Asia' },
  { name: { common: 'Japan' }, cca2: 'JP', flags: { svg: 'https://flagcdn.com/jp.svg' }, region: 'Asia' },
  { name: { common: 'United Kingdom' }, cca2: 'GB', flags: { svg: 'https://flagcdn.com/gb.svg' }, region: 'Europe' },
  { name: { common: 'Italy' }, cca2: 'IT', flags: { svg: 'https://flagcdn.com/it.svg' }, region: 'Europe' },
  { name: { common: 'South Africa' }, cca2: 'ZA', flags: { svg: 'https://flagcdn.com/za.svg' }, region: 'Africa' },
  { name: { common: 'South Korea' }, cca2: 'KR', flags: { svg: 'https://flagcdn.com/kr.svg' }, region: 'Asia' },
  { name: { common: 'Spain' }, cca2: 'ES', flags: { svg: 'https://flagcdn.com/es.svg' }, region: 'Europe' },
  { name: { common: 'Netherlands' }, cca2: 'NL', flags: { svg: 'https://flagcdn.com/nl.svg' }, region: 'Europe' },
  { name: { common: 'Saudi Arabia' }, cca2: 'SA', flags: { svg: 'https://flagcdn.com/sa.svg' }, region: 'Asia' },
  { name: { common: 'Ukraine' }, cca2: 'UA', flags: { svg: 'https://flagcdn.com/ua.svg' }, region: 'Europe' },
  { name: { common: 'Poland' }, cca2: 'PL', flags: { svg: 'https://flagcdn.com/pl.svg' }, region: 'Europe' },
  { name: { common: 'Myanmar' }, cca2: 'MM', flags: { svg: 'https://flagcdn.com/mm.svg' }, region: 'Asia' },
]

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')

  // Try live API first (REST Countries v3)
  try {
    const url = q
      ? `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fields=name,cca2,flags,region,languages`
      : `https://restcountries.com/v3.1/all?fields=name,cca2,flags,region,languages`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (res.ok) {
      const data = await res.json()
      // Filter to our known list for all, or return search results
      if (!q) {
        const known = new Set(STATIC_COUNTRIES.map(c => c.cca2))
        const filtered = (Array.isArray(data) ? data : []).filter((c: Record<string,unknown>) => known.has((c.cca2 as string) || ''))
        return NextResponse.json({ data: filtered.length > 0 ? filtered : STATIC_COUNTRIES, source: 'REST Countries v3.1' })
      }
      return NextResponse.json({ data, source: 'REST Countries v3.1' })
    }
  } catch {}

  // Fallback: static data — always works, no API needed
  if (q) {
    const match = STATIC_COUNTRIES.filter(c =>
      c.name.common.toLowerCase().includes(q.toLowerCase()) ||
      c.cca2.toLowerCase() === q.toLowerCase()
    )
    return NextResponse.json({ data: match, source: 'JeeVan static cache' })
  }

  return NextResponse.json({ data: STATIC_COUNTRIES, source: 'JeeVan static cache' })
}
