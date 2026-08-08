/**
 * POST /api/match — Soil & Climate Crop Matching Engine
 * Body: { lat, lng, month, soilType? }
 * Scores all 50+ plants against climate/soil and returns top 10
 */
import { NextRequest, NextResponse } from 'next/server'

// Expanded Knowledge Base — 10 crops per zone (used when Supabase unavailable)
const KB: Record<string, string[]> = {
  monsoon: ['Rice (Basmati)', 'Maize', 'Okra (Bhindi)', 'Ginger', 'Turmeric', 'Moringa', 'Pigeon Pea', 'Banana', 'Papaya', 'Sunn Hemp'],
  tropical_wet: ['Rice (Basmati)', 'Moringa', 'Turmeric', 'Banana', 'Papaya', 'Coconut', 'Black Pepper', 'Cardamom', 'Ginger', 'Tulsi'],
  tropical_dry: ['Pearl Millet', 'Pigeon Pea', 'Mango', 'Guava', 'Lemon', 'Neem Tree', 'Chickpea', 'Sunn Hemp', 'Amla', 'Cashew'],
  temperate: ['Wheat (Durum)', 'Chickpea', 'Mustard', 'Potato', 'Garlic', 'Finger Millet', 'Marigold', 'Desi Rose', 'Berseem', 'Tea'],
  arid: ['Pearl Millet', 'Sunn Hemp', 'Neem Tree', 'Aloe Vera', 'Chickpea', 'Dhaincha', 'Lemon', 'Guava', 'Marigold', 'Amla'],
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const lat = parseFloat(body.lat) || 25.13
  const month = parseInt(body.month) || new Date().getMonth() + 1
  const soilType = body.soilType || ''

  // Climate classification
  const absLat = Math.abs(lat)
  let climateZone = 'temperate'
  if (absLat < 23.5) climateZone = 'tropical_wet'
  else if (absLat < 30) climateZone = 'tropical_dry'
  else if (absLat < 45) climateZone = 'temperate'
  else climateZone = 'arid'
  if (absLat < 30 && month >= 6 && month <= 9) climateZone = 'monsoon'

  // Try Supabase for precision scoring
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  let supabaseFailed = false

  if (supabaseUrl && anonKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/plant_directory?select=*&is_active=is.true&limit=30`,
        {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
          signal: AbortSignal.timeout(8000),
        }
      )
      if (res.ok) {
        const plants = await res.json()
        if (Array.isArray(plants) && plants.length > 0) {
          interface Plant { common_name: string; category: string; optimal_climate?: Record<string,number>; soil_requirements?: Record<string,unknown>; growth_cycle_days?: number; water_needs?: string; description?: string; exotic_variety?: boolean; heirloom?: boolean }
          const temp = 25 + (absLat < 20 ? 5 : absLat > 30 ? -3 : 0)
          const rain = (month >= 6 && month <= 9) ? 1500 : 500

          const scored = (plants as Plant[]).map((p: Plant) => {
            let score = 0
            const c = p.optimal_climate
            if (c) {
              if (c.temp_min != null && c.temp_max != null && temp >= c.temp_min && temp <= c.temp_max) score += 3
              if (c.rainfall_min != null && c.rainfall_max != null && rain >= c.rainfall_min && rain <= c.rainfall_max) score += 3
            }
            if (soilType && p.soil_requirements) {
              const s = p.soil_requirements as Record<string,unknown>
              const types = (s.type as string[]) || []
              if (types.some((t: string) => t.toLowerCase().includes(soilType.toLowerCase()))) score += 2
            }
            // Bonus for heirloom/exotic
            if (p.heirloom) score += 1
            if (p.exotic_variety) score += 1
            // Bonus for short growth cycle (faster recommendation)
            if (p.growth_cycle_days && p.growth_cycle_days < 90) score += 1
            return { common_name: p.common_name, category: p.category, score, growth_cycle_days: p.growth_cycle_days, water_needs: p.water_needs, description: p.description?.slice(0, 120), heirloom: p.heirloom, exotic: p.exotic_variety }
          })

          scored.sort((a, b) => b.score - a.score)
          const top10 = scored.slice(0, 10)
          if (top10.length > 0 && top10[0].score > 0) {
            return NextResponse.json({
              recommendations: top10,
              climateZone,
              soilType: soilType || 'unspecified',
              source: 'Supabase Plant Directory',
              totalPlants: plants.length,
            })
          }
        }
      }
    } catch (e) {
      supabaseFailed = true
      console.error('[Match API] Supabase query failed:', e instanceof Error ? e.message : String(e))
    }
  }

  // KB fallback
  const crops = KB[climateZone] || KB.temperate
  return NextResponse.json({
    recommendations: crops.map((name, i) => ({
      common_name: name,
      score: 10 - i,
      category: 'recommended',
    })),
    climateZone,
    soilType: soilType || 'unspecified',
    source: supabaseFailed ? 'JeeVan Knowledge Base (Supabase unreachable)' : 'JeeVan Knowledge Base',
    note: supabaseFailed ? 'Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel env vars for precision matching with 50+ plants.' : undefined,
  })
}
