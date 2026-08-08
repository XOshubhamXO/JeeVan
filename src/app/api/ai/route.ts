import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = 'You are JeeVan AI, an agricultural advisory agent for Indian farmers. Provide practical, evidence-based crop recommendations. Consider: soil type, climate, rainfall, season, market demand. Always suggest organic/natural farming methods first. Keep answers concise (under 300 words). Include specific planting months for the Indian subcontinent.'

export async function POST(req: NextRequest) {
  const { query, context } = await req.json()
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })
  const msgs = [{ role: 'system', content: SYSTEM }, { role: 'user', content: context ? `Context: ${JSON.stringify(context)}\n\nQuery: ${query}` : query }]

  /* 1. Groq — 30 req/min free, no card, fastest inference */
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.GROQ_API_KEY}`}, body:JSON.stringify({ model:'llama-3.3-70b-versatile', messages:msgs, temperature:0.7, max_tokens:800 }), signal:AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response:d.choices?.[0]?.message?.content, model:'Groq Llama 3.3 70B (primary)' }) }
    } catch {}
  }

  /* 2. Mistral — 1B tokens/month FREE, no credit card, phone verify only */
  if (process.env.MISTRAL_API_KEY) {
    try {
      const r = await fetch('https://api.mistral.ai/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.MISTRAL_API_KEY}`}, body:JSON.stringify({ model:'mistral-small-latest', messages:msgs, temperature:0.7, max_tokens:800 }), signal:AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response:d.choices?.[0]?.message?.content, model:'Mistral Small (backup #1)' }) }
    } catch {}
  }

  /* 3. HuggingFace — free serverless inference, 1000s of models, no card */
  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      const prompt = msgs.map(m => `${m.role}: ${m.content}`).join('\n')
      const r = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.HUGGINGFACE_API_KEY}`}, body:JSON.stringify({ inputs:prompt, parameters:{max_new_tokens:800, temperature:0.7} }), signal:AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response:d[0]?.generated_text?.split('\n\n').slice(-3).join('\n\n') || d[0]?.generated_text, model:'HuggingFace Mistral 7B (backup #2)' }) }
    } catch {}
  }

  /* 4. Gemini — 1500 req/day free */
  if (process.env.GOOGLE_AI_API_KEY) {
    try {
      const prompt = msgs.map(m => `${m.role}: ${m.content}`).join('\n')
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.7, maxOutputTokens:800} }), signal:AbortSignal.timeout(25000) })
      if (r.ok) { const d = await r.json(); return NextResponse.json({ response:d.candidates?.[0]?.content?.parts?.[0]?.text, model:'Gemini Flash (backup #3)' }) }
    } catch {}
  }

  /* 5. JeeVan Knowledge Base — always available */
  return NextResponse.json({ response: knowledgeBase(query), model:'JeeVan KB (local)' })
}

function knowledgeBase(q: string): string {
  const lq = q.toLowerCase()
  if (lq.includes('rice')||lq.includes('paddy')) return 'Rice Bihar: Nursery June, transplant July. SRI = 30% more yield, 40% less water. Rajendra Bhagwati, Sabour Surbhit. Vermicompost 5 tons/acre. Organic: Azolla bio-fertilizer fixes nitrogen naturally.'
  if (lq.includes('wheat')||lq.includes('gehu')) return 'Wheat Bihar: Sow Nov 15-Dec 15. HD-2967, PBW-343. Zero-tillage happy seeder saves Rs 3000/acre. Irrigate at 21 days (CRI), tillering, grain-filling.'
  if (lq.includes('tomato')||lq.includes('bhindi')||lq.includes('vegetable')) return 'Kitchen Garden Bihar: Tomato nursery Aug-Sep, transplant Oct. Okra Feb-Mar/Jun-Jul, harvest 45-55 days. Raised beds + drip. Neem cake 250 kg/ha.'
  if (lq.includes('organic')||lq.includes('jeevamrut')||lq.includes('natural')) return 'Jeevamrut: 10kg dung + 10L urine + 2kg jaggery + 2kg gram flour + 200L water. Ferment 5-7 days. Apply 200L/acre. Bijamrit + mulching + crop rotation restores soil.'
  return `JeeVan AI: For "${q.slice(0,100)}" — specify your district, soil type, irrigation status, and crops of interest. Browse Plant Directory and Market Rates for more data.`
}
