/**
 * POST /api/ai — AI Crop Advisory
 * Primary: Groq Llama → Fallback: Google Gemini → Final: Knowledge Base
 */
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are JeeVan AI, an agricultural advisory agent for Indian farmers. Provide practical, evidence-based crop recommendations. Consider: soil type, climate, rainfall, season, market demand. Always suggest organic/natural farming methods first. Keep answers concise (under 300 words). Include specific planting months for the Indian subcontinent.`

export async function POST(req: NextRequest) {
  const { query, context } = await req.json()
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const messages = [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: context ? `Context: ${JSON.stringify(context)}\n\nQuery: ${query}` : query },
  ]

  // Primary: Groq
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model: 'llama-3.1-70b-versatile', messages, temperature: 0.7, max_tokens: 800 }),
        signal: AbortSignal.timeout(25000),
      })
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json({
          response: data.choices?.[0]?.message?.content,
          model: 'Groq (Llama 3.1 70B)',
          tokens: data.usage?.total_tokens,
        })
      }
      console.warn('[AI] Groq returned', res.status, await res.text().catch(()=>''))
    } catch (e) { console.warn('[AI] Groq error:', e) }
  }

  // Fallback: Google Gemini
  const geminiKey = process.env.GOOGLE_AI_API_KEY
  if (geminiKey) {
    try {
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 800 } }),
          signal: AbortSignal.timeout(25000),
        }
      )
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json({
          response: data.candidates?.[0]?.content?.parts?.[0]?.text,
          model: 'Google Gemini Pro',
        })
      }
    } catch (e) { console.warn('[AI] Gemini error:', e) }
  }

  // Final fallback: Knowledge Base
  return NextResponse.json({ response: knowledgeBase(query), model: 'JeeVan Knowledge Base' })
}

function knowledgeBase(q: string): string {
  const lq = q.toLowerCase()
  if (lq.includes('rice')||lq.includes('paddy')||lq.includes('dhaan'))
    return 'For rice in Bihar: Start nursery in June, transplant in July. Use SRI method for 30% more yield with 40% less water. Varieties: Rajendra Bhagwati, Sabour Surbhit. Apply vermicompost at 5 tons/acre. Kharif (June-July) is best.\n\nOrganic tip: Use Azolla as bio-fertilizer in paddy fields — it fixes nitrogen naturally.'
  if (lq.includes('wheat')||lq.includes('gehu'))
    return 'Wheat in Bihar: Sow Nov 15 - Dec 15. Varieties: HD-2967, PBW-343. NPK 120:60:40 kg/ha. Irrigate at CRI (21 days), tillering, and grain-filling. Use zero-tillage with happy seeder after rice harvest — saves ₹3,000/acre.'
  if (lq.includes('vegetable')||lq.includes('tomato')||lq.includes('bhindi')||lq.includes('brinjal'))
    return 'Kitchen garden for Bihar: Tomato — sow nursery Aug-Sep, transplant Oct, yield 200-250 quintal/ha. Okra — sow Feb-Mar or Jun-Jul, harvest in 45-55 days. Brinjal — year-round with irrigation. Use raised beds with drip irrigation. Apply neem cake at 250 kg/ha for nematode control.'
  if (lq.includes('organic')||lq.includes('natural')||lq.includes('jeevamrut')||lq.includes('chemical'))
    return 'Natural farming inputs:\n1. Jeevamrut: 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg gram flour + 200L water. Ferment 5-7 days. Apply at 200L/acre.\n2. Bijamrit: seed treatment with cow dung + urine + lime.\n3. Mulching: crop residue reduces water need by 40%.\n4. Crop rotation: Rice-Wheat-Moong restores soil nitrogen.'
  return `Thank you for asking about "${q.slice(0,100)}". For personalized advice, please specify: your district, soil type, whether irrigated, and which crops interest you. You can check market rates at the Market tab and browse plants in the Plant Directory.`
}
