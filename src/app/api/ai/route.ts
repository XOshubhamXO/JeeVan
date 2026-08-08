import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = 'You are JeeVan AI, an agricultural advisory agent for Indian farmers. Provide practical, evidence-based crop recommendations. Consider: soil type, climate, rainfall, season, market demand. Always suggest organic/natural farming methods first. Keep answers concise (under 300 words). Include specific planting months for the Indian subcontinent.'

export async function POST(req: NextRequest) {
  const { query, context } = await req.json()
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const msgs = [{ role: 'system', content: SYSTEM }, { role: 'user', content: context ? `Context: ${JSON.stringify(context)}\n\nQuery: ${query}` : query }]

  /* 1. Groq — primary (free, 30 req/min) */
  const groq = process.env.GROQ_API_KEY
  if (groq) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groq}` }, body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: msgs, temperature: 0.7, max_tokens: 800 }), signal: AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response: d.choices?.[0]?.message?.content, model: 'Groq Llama 3.3 (primary)' }) }
    } catch {}
  }

  /* 2. Together AI — backup (free Llama, 60 req/min) */
  const together = process.env.TOGETHER_AI_API_KEY
  if (together) {
    try {
      const r = await fetch('https://api.together.xyz/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${together}` }, body: JSON.stringify({ model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', messages: msgs, temperature: 0.7, max_tokens: 800 }), signal: AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response: d.choices?.[0]?.message?.content, model: 'Together AI Llama 3.3 (backup)' }) }
    } catch {}
  }

  /* 3. Google Gemini — third fallback */
  const gemini = process.env.GOOGLE_AI_API_KEY
  if (gemini) {
    try {
      const prompt = msgs.map(m => `${m.role}: ${m.content}`).join('\n')
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${gemini}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 800 } }), signal: AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response: d.candidates?.[0]?.content?.parts?.[0]?.text, model: 'Gemini Pro (fallback)' }) }
    } catch {}
  }

  /* 4. JeeVan Knowledge Base — final local fallback */
  return NextResponse.json({ response: knowledgeBase(query), model: 'JeeVan KB (local)' })
}

function knowledgeBase(q: string): string {
  const lq = q.toLowerCase()
  if (lq.includes('rice')||lq.includes('paddy')) return 'Rice Bihar: Nursery June, transplant July. SRI method = 30% more yield, 40% less water. Varieties: Rajendra Bhagwati, Sabour Surbhit. Vermicompost 5 tons/acre. Kharif best. Organic: Azolla bio-fertilizer.'
  if (lq.includes('wheat')||lq.includes('gehu')) return 'Wheat Bihar: Sow Nov 15-Dec 15. HD-2967, PBW-343. Zero-tillage happy seeder saves Rs 3000/acre. Irrigate at 21 days (CRI), tillering, grain-filling.'
  if (lq.includes('vegetable')||lq.includes('tomato')||lq.includes('bhindi')) return 'Kitchen Garden Bihar: Tomato nursery Aug-Sep, transplant Oct. Okra Feb-Mar or Jun-Jul, harvest 45-55 days. Neem cake 250 kg/ha for nematodes.'
  if (lq.includes('organic')||lq.includes('jeevamrut')||lq.includes('natural')) return 'Jeevamrut: 10kg dung + 10L urine + 2kg jaggery + 2kg gram flour + 200L water. Ferment 5-7 days. Apply 200L/acre. Bijamrit + mulching + crop rotation.'
  return `JeeVan AI: For "${q.slice(0,100)}" — please specify your district, soil type, and which crops interest you. Browse our Plant Directory and Market Rates for more data.`
}
