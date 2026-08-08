/**
 * JeeVan API Failover Circuit Breaker
 *
 * Pattern: 1 Primary + 2 Fallback APIs with automatic circuit breaking.
 * When the primary fails, the middleware seamlessly transitions to fallbacks
 * and reports degradation to the telemetry pipeline.
 */

export type ApiEndpoint = {
  name: string
  baseUrl: string
  key?: string
  keyHeader?: string       // 'Authorization', 'appid', 'key', etc.
  keyInQuery?: boolean     // true for Google-style APIs where key goes in ?key=
  timeout: number
  maxRetries: number
}

export type ApiDomain = {
  domain: string
  primary: ApiEndpoint
  fallbacks: ApiEndpoint[]
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  failureCount: number
  lastFailureAt: number | null
  consecutiveSuccesses: number
}

// ─── API Endpoint Registry ───
export const API_REGISTRY: Record<string, ApiDomain> = {
  countries: {
    domain: 'Country Data & Flags',
    primary: {
      name: 'REST Countries',
      baseUrl: 'https://restcountries.com/v3',
      timeout: 8000,
      maxRetries: 2,
    },
    fallbacks: [
      {
        name: 'GeoNames',
        baseUrl: 'https://secure.geonames.org',
        key: process.env.GEONAMES_USERNAME,
        keyHeader: 'username',
        timeout: 10000,
        maxRetries: 1,
      },
      {
        name: 'World Bank',
        baseUrl: 'https://api.worldbank.org/v2',
        timeout: 10000,
        maxRetries: 1,
      },
    ],
    circuitState: 'CLOSED',
    failureCount: 0,
    lastFailureAt: null,
    consecutiveSuccesses: 0,
  },
  geolocation: {
    domain: 'IP & Geolocation',
    primary: {
      name: 'IPinfo',
      baseUrl: 'https://ipinfo.io',
      key: process.env.IPINFO_API_KEY,
      keyHeader: 'Authorization',
      timeout: 5000,
      maxRetries: 1,
    },
    fallbacks: [
      {
        name: 'ipapi',
        baseUrl: 'https://ipapi.co',
        timeout: 8000,
        maxRetries: 1,
      },
    ],
    circuitState: 'CLOSED',
    failureCount: 0,
    lastFailureAt: null,
    consecutiveSuccesses: 0,
  },
  weather: {
    domain: 'Weather & Environmental',
    primary: {
      name: 'Open-Meteo',
      baseUrl: 'https://api.open-meteo.com/v1',
      timeout: 8000,
      maxRetries: 2,
    },
    fallbacks: [
      {
        name: 'OpenWeatherMap',
        baseUrl: 'https://api.openweathermap.org/data/3.0',
        key: process.env.OPENWEATHERMAP_API_KEY,
        keyHeader: 'appid',
        timeout: 10000,
        maxRetries: 1,
      },
      {
        name: 'NASA POWER',
        baseUrl: 'https://power.larc.nasa.gov/api/temporal',
        timeout: 15000,
        maxRetries: 1,
      },
    ],
    circuitState: 'CLOSED',
    failureCount: 0,
    lastFailureAt: null,
    consecutiveSuccesses: 0,
  },
  translation: {
    domain: 'Translation',
    primary: {
      name: 'LibreTranslate',
      baseUrl: 'https://libretranslate.com',
      timeout: 10000,
      maxRetries: 2,
    },
    fallbacks: [
      {
        name: 'DeepL Free',
        baseUrl: 'https://api-free.deepl.com/v2',
        key: process.env.DEEPL_API_KEY,
        keyHeader: 'Authorization',
        timeout: 10000,
        maxRetries: 1,
      },
    ],
    circuitState: 'CLOSED',
    failureCount: 0,
    lastFailureAt: null,
    consecutiveSuccesses: 0,
  },
  marketRates: {
    domain: 'Market Rates',
    primary: {
      name: 'Agmarknet (Data.gov.in)',
      baseUrl: 'https://api.data.gov.in/resource',
      timeout: 12000,
      maxRetries: 2,
    },
    fallbacks: [
      {
        name: 'Open Food Facts',
        baseUrl: 'https://world.openfoodfacts.org/api/v2',
        timeout: 10000,
        maxRetries: 1,
      },
    ],
    circuitState: 'CLOSED',
    failureCount: 0,
    lastFailureAt: null,
    consecutiveSuccesses: 0,
  },
  ai: {
    domain: 'AI Crop Intelligence',
    primary: {
      name: 'Groq (DeepSeek/Llama)',
      baseUrl: 'https://api.groq.com/openai/v1',
      key: process.env.GROQ_API_KEY,
      keyHeader: 'Authorization',
      timeout: 30000,
      maxRetries: 1,
    },
    fallbacks: [
      {
        name: 'Google Gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        key: process.env.GOOGLE_AI_API_KEY,
        keyHeader: 'key',
        keyInQuery: true,
        timeout: 30000,
        maxRetries: 1,
      },
    ],
    circuitState: 'CLOSED',
    failureCount: 0,
    lastFailureAt: null,
    consecutiveSuccesses: 0,
  },
}

// ─── Circuit Breaker Parameters ───
const CIRCUIT_BREAKER_THRESHOLD = 3
const CIRCUIT_RESET_TIMEOUT_MS = 60000 // 1 minute
const HALF_OPEN_MAX_REQUESTS = 2

// ─── In-memory circuit state tracker ───
const circuitStateTracker = new Map<string, ApiDomain>()

function getDomain(key: string): ApiDomain {
  const existing = circuitStateTracker.get(key)
  if (existing) return existing
  const domain = structuredClone(API_REGISTRY[key])
  if (domain) circuitStateTracker.set(key, domain)
  return domain
}

// ─── Core fetch with circuit breaker ───
export async function fetchWithFailover<T>(
  domainKey: string,
  path: string,
  options: RequestInit = {},
): Promise<{ data: T; source: string; degraded: boolean }> {
  const domain = getDomain(domainKey)
  if (!domain) {
    throw new Error(`Unknown API domain: ${domainKey}`)
  }

  const endpoints = [domain.primary, ...domain.fallbacks]
  const errors: Error[] = []

  for (const endpoint of endpoints) {
    // Check circuit state
    if (domain.circuitState === 'OPEN') {
      const timeSinceLastFailure = Date.now() - (domain.lastFailureAt || 0)
      if (timeSinceLastFailure > CIRCUIT_RESET_TIMEOUT_MS) {
        domain.circuitState = 'HALF_OPEN'
        domain.consecutiveSuccesses = 0
      } else {
        continue // Skip this endpoint, try next
      }
    }

    if (domain.circuitState === 'HALF_OPEN' && domain.consecutiveSuccesses >= HALF_OPEN_MAX_REQUESTS) {
      // Allow limited requests in half-open state
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout)

      let url = `${endpoint.baseUrl}${path}`

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      }

      if (endpoint.key && endpoint.keyHeader) {
        if (endpoint.keyInQuery) {
          // Google-style: key goes as query parameter
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}${endpoint.keyHeader}=${endpoint.key}`
        } else {
          const prefix = endpoint.keyHeader === 'Authorization' ? 'Bearer ' : ''
          headers[endpoint.keyHeader] = `${prefix}${endpoint.key}`
        }
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`${endpoint.name} returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Success! Reset circuit
      domain.circuitState = 'CLOSED'
      domain.failureCount = 0
      domain.consecutiveSuccesses++

      const isDegraded = endpoint.name !== domain.primary.name
      if (isDegraded) {
        console.warn(`[JeeVan API] Degraded: using ${endpoint.name} for ${domainKey}`)
      }

      return { data: data as T, source: endpoint.name, degraded: isDegraded }
    } catch (error) {
      errors.push(error as Error)
      domain.failureCount++
      domain.lastFailureAt = Date.now()

      if (domain.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
        domain.circuitState = 'OPEN'
        console.error(`[JeeVan API] Circuit OPEN for ${domainKey}: ${domain.failureCount} failures`)
      }
    }
  }

  // All endpoints failed
  throw new Error(
    `All endpoints failed for ${domainKey}. Errors: ${errors.map((e) => e.message).join('; ')}`,
  )
}

// ─── Domain-specific convenience functions ───

export async function fetchCountries<T>(path: string): Promise<{ data: T; source: string; degraded: boolean }> {
  return fetchWithFailover<T>('countries', path)
}

export async function fetchWeather<T>(path: string): Promise<{ data: T; source: string; degraded: boolean }> {
  return fetchWithFailover<T>('weather', path)
}

export async function fetchGeolocation<T>(path: string = '/json'): Promise<{ data: T; source: string; degraded: boolean }> {
  return fetchWithFailover<T>('geolocation', path)
}

export async function fetchTranslation<T>(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<{ data: T; source: string; degraded: boolean }> {
  return fetchWithFailover<T>('translation', '/translate', {
    method: 'POST',
    body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: 'text' }),
  })
}

export async function fetchMarketRates<T>(path: string): Promise<{ data: T; source: string; degraded: boolean }> {
  return fetchWithFailover<T>('marketRates', path)
}

export async function fetchAIAdvisory<T>(messages: unknown[]): Promise<{ data: T; source: string; degraded: boolean }> {
  // Try Groq first (OpenAI-compatible format)
  try {
    return await fetchWithFailover<T>('ai', '/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })
  } catch (groqError) {
    // Groq failed — try Gemini with its native format
    console.warn('[JeeVan AI] Groq failed, trying Gemini fallback:', (groqError as Error).message)

    // Convert OpenAI-format messages to Gemini format
    const geminiMessages = (messages as { role: string; content: string }[])
    const prompt = geminiMessages.map((m) => `${m.role}: ${m.content}`).join('\n')

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      },
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini fallback failed: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    return {
      data: geminiData as T,
      source: 'Google Gemini (fallback)',
      degraded: true,
    }
  }
}

// ─── Health Check ───
export async function checkAllApiHealth(): Promise<Record<string, { status: string; source: string }>> {
  const health: Record<string, { status: string; source: string }> = {}
  for (const key of Object.keys(API_REGISTRY)) {
    try {
      const result = await fetchWithFailover(key, key === 'countries' ? '/all?fields=name' : '/health')
      health[key] = { status: 'healthy', source: result.source }
    } catch {
      health[key] = { status: 'unhealthy', source: 'none' }
    }
  }
  return health
}
