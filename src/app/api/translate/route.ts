/**
 * POST /api/translate — Proxy with 2-tier failover
 * Primary: LibreTranslate → Fallback: DeepL Free
 * Body: { text, source, target }
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, source, target } = await req.json()
  if (!text || !target) {
    return NextResponse.json({ error: 'text and target required' }, { status: 400 })
  }

  // Primary: LibreTranslate
  try {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: source || 'auto', target, format: 'text' }),
      signal: AbortSignal.timeout(10000),
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({ translatedText: data.translatedText, source: 'LibreTranslate' })
    }
  } catch {}

  // Fallback: DeepL
  const deeplKey = process.env.DEEPL_API_KEY
  if (deeplKey) {
    try {
      const dlTarget = target.toUpperCase() === 'EN' ? 'EN' : target.toUpperCase()
      const res = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `DeepL-Auth-Key ${deeplKey}`,
        },
        body: new URLSearchParams({
          text,
          target_lang: dlTarget,
          ...(source && source !== 'auto' ? { source_lang: source.toUpperCase() } : {}),
        }).toString(),
        signal: AbortSignal.timeout(10000),
      })
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json({
          translatedText: data.translations?.[0]?.text,
          source: 'DeepL',
        })
      }
    } catch {}
  }

  // Return original text as fallback
  return NextResponse.json({
    translatedText: text,
    source: 'none (original text returned)',
  })
}
