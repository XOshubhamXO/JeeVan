import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  country: string
  language: string
  theme: string
  interests: string[]
  createdAt: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  updateProfile: (updates: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      updateProfile: (updates) => set(state => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'jeevan-auth' }
  )
)
