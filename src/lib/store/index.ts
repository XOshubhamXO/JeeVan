/**
 * JeeVan Platform State Management (Zustand)
 *
 * Centralized stores for platform-wide state:
 * - User session & onboarding state
 * - Theme & contrast engine state
 * - Nature engine controls
 * - Country & language selections
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ───

export type ThemeType = 'light' | 'dark' | 'nature'

export type UserInterest =
  | 'natural_produce'
  | 'nursery_plants'
  | 'tech_consulting'
  | 'partnerships'
  | 'social_causes'

export interface UserSession {
  name: string
  age: number | null
  countryCode: string
  countryName: string
  detectedLocation: {
    lat: number
    lng: number
    city: string
    region: string
    country: string
  } | null
  selectedLanguage: string
  selectedTheme: ThemeType
  interest: UserInterest | null
  onboardingCompleted: boolean
}

export interface WeatherData {
  temperature: number
  humidity: number
  condition: 'clear' | 'rain' | 'snow' | 'cloudy' | 'fog' | 'night'
  windSpeed: number
  isDaytime: boolean
  sunrise: string
  sunset: string
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'monsoon'
}

export interface NatureEngineState {
  enabled: boolean
  intensity: number // 0-1
  audioEnabled: boolean
  particleDensity: number // 0-1
  showButterflies: boolean
  showFireflies: boolean
  showLeaves: boolean
  rippleStrength: number // 0-1
  fogDensity: number // 0-1
}

// ─── User Session Store ───
export const useUserStore = create<{
  session: UserSession
  setCountry: (code: string, name: string) => void
  setLanguage: (lang: string) => void
  setTheme: (theme: ThemeType) => void
  setInterest: (interest: UserInterest) => void
  setSurveyData: (data: Partial<UserSession>) => void
  completeOnboarding: () => void
  reset: () => void
}>()(
  persist(
    (set) => ({
      session: {
        name: '',
        age: null,
        countryCode: '',
        countryName: '',
        detectedLocation: null,
        selectedLanguage: 'en',
        selectedTheme: 'nature',
        interest: null,
        onboardingCompleted: false,
      },
      setCountry: (code, name) =>
        set((state) => ({
          session: { ...state.session, countryCode: code, countryName: name },
        })),
      setLanguage: (lang) =>
        set((state) => ({
          session: { ...state.session, selectedLanguage: lang },
        })),
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = theme
        }
        set((state) => ({
          session: { ...state.session, selectedTheme: theme },
        }))
      },
      setInterest: (interest) =>
        set((state) => ({
          session: { ...state.session, interest },
        })),
      setSurveyData: (data) =>
        set((state) => ({
          session: { ...state.session, ...data },
        })),
      completeOnboarding: () =>
        set((state) => ({
          session: { ...state.session, onboardingCompleted: true },
        })),
      reset: () =>
        set({
          session: {
            name: '',
            age: null,
            countryCode: '',
            countryName: '',
            detectedLocation: null,
            selectedLanguage: 'en',
            selectedTheme: 'nature',
            interest: null,
            onboardingCompleted: false,
          },
        }),
    }),
    { name: 'jeevan-user-session' },
  ),
)

// ─── Weather Store ───
export const useWeatherStore = create<{
  weather: WeatherData | null
  loading: boolean
  error: string | null
  setWeather: (data: WeatherData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}>((set) => ({
  weather: null,
  loading: false,
  error: null,
  setWeather: (data) => set({ weather: data, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}))

// ─── Nature Engine Store ───
export const useNatureEngineStore = create<{
  engine: NatureEngineState
  toggleEngine: () => void
  setIntensity: (v: number) => void
  toggleAudio: () => void
  setParticleDensity: (v: number) => void
  toggleButterflies: () => void
  toggleFireflies: () => void
  toggleLeaves: () => void
  setRippleStrength: (v: number) => void
  setFogDensity: (v: number) => void
}>()(
  persist(
    (set) => ({
      engine: {
        enabled: true,
        intensity: 0.7,
        audioEnabled: false,
        particleDensity: 0.5,
        showButterflies: true,
        showFireflies: true,
        showLeaves: true,
        rippleStrength: 0.6,
        fogDensity: 0.3,
      },
      toggleEngine: () =>
        set((state) => ({
          engine: { ...state.engine, enabled: !state.engine.enabled },
        })),
      setIntensity: (v) =>
        set((state) => ({ engine: { ...state.engine, intensity: v } })),
      toggleAudio: () =>
        set((state) => ({
          engine: { ...state.engine, audioEnabled: !state.engine.audioEnabled },
        })),
      setParticleDensity: (v) =>
        set((state) => ({ engine: { ...state.engine, particleDensity: v } })),
      toggleButterflies: () =>
        set((state) => ({
          engine: { ...state.engine, showButterflies: !state.engine.showButterflies },
        })),
      toggleFireflies: () =>
        set((state) => ({
          engine: { ...state.engine, showFireflies: !state.engine.showFireflies },
        })),
      toggleLeaves: () =>
        set((state) => ({
          engine: { ...state.engine, showLeaves: !state.engine.showLeaves },
        })),
      setRippleStrength: (v) =>
        set((state) => ({ engine: { ...state.engine, rippleStrength: v } })),
      setFogDensity: (v) =>
        set((state) => ({ engine: { ...state.engine, fogDensity: v } })),
    }),
    { name: 'jeevan-nature-engine' },
  ),
)

// ─── Admin Auth Store ───
export const useAdminStore = create<{
  isAuthenticated: boolean
  tier: 'ALPHA' | 'BETA' | null
  adminId: string | null
  username: string | null
  login: (tier: 'ALPHA' | 'BETA', id: string, username: string) => void
  logout: () => void
}>((set) => ({
  isAuthenticated: false,
  tier: null,
  adminId: null,
  username: null,
  login: (tier, id, username) =>
    set({ isAuthenticated: true, tier, adminId: id, username }),
  logout: () =>
    set({ isAuthenticated: false, tier: null, adminId: null, username: null }),
}))

// ─── Country Data Store ───
export interface Country {
  code: string
  name: string
  flag: string
  region: string
  languages: string[]
  isAgricultural: boolean
}

export const useCountryStore = create<{
  countries: Country[]
  topAgricultural: Country[]
  selectedCountry: Country | null
  loading: boolean
  setCountries: (countries: Country[]) => void
  selectCountry: (code: string) => void
  setLoading: (loading: boolean) => void
}>((set, get) => ({
  countries: [],
  topAgricultural: [],
  selectedCountry: null,
  loading: false,
  setCountries: (countries) => {
    const top20 = [
      'IN', 'CN', 'US', 'BR', 'RU', 'FR', 'MX', 'ID',
      'NG', 'TR', 'AR', 'AU', 'CA', 'DE', 'TH', 'VN',
      'PK', 'EG', 'BD', 'JP',
    ]
    const topAgricultural = countries
      .filter((c) => top20.includes(c.code))
      .sort((a, b) => top20.indexOf(a.code) - top20.indexOf(b.code))
      .map((c) => ({ ...c, isAgricultural: true }))

    set({ countries, topAgricultural, loading: false })
  },
  selectCountry: (code) => {
    const country = get().countries.find((c) => c.code === code) || null
    set({ selectedCountry: country })
  },
  setLoading: (loading) => set({ loading }),
}))
