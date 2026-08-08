/**
 * GET /api/weather — Current + 7-day forecast with 3-tier failover
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat') || '25.13'
  const lng = req.nextUrl.searchParams.get('lng') || '85.44'
  const days = req.nextUrl.searchParams.get('days') || '7'

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,sunrise,sunset&timezone=auto&forecast_days=${days}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`)
    const data = await res.json()

    // Format 7-day forecast
    const forecast = (data.daily?.time || []).map((date: string, i: number) => ({
      date,
      tempMax: data.daily?.temperature_2m_max?.[i] ?? null,
      tempMin: data.daily?.temperature_2m_min?.[i] ?? null,
      precipitation: data.daily?.precipitation_sum?.[i] ?? 0,
      weatherCode: data.daily?.weather_code?.[i] ?? 0,
      sunrise: data.daily?.sunrise?.[i] ?? null,
      sunset: data.daily?.sunset?.[i] ?? null,
    }))

    return NextResponse.json({
      current: data.current,
      forecast,
      source: 'Open-Meteo',
    })
  } catch {
    // Fallback: OpenWeatherMap
    const owmKey = process.env.OPENWEATHERMAP_API_KEY
    if (owmKey) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${owmKey}&exclude=minutely,hourly,alerts`,
          { signal: AbortSignal.timeout(8000) }
        )
        if (res.ok) {
          const data = await res.json()
          return NextResponse.json({ current: data.current, daily: data.daily, source: 'OpenWeatherMap' })
        }
      } catch {}
    }
    return NextResponse.json({ error: 'All weather sources unavailable' }, { status: 502 })
  }
}
