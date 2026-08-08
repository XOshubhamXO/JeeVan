import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: string
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => string
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set(state => {
        const existing = state.items.find(i => i.id === item.id)
        if (existing) {
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, qty) => set(state => ({
        items: qty <= 0 ? state.items.filter(i => i.id !== id) : state.items.map(i => i.id === id ? { ...i, quantity: qty } : i)
      })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => {
        const total = get().items.reduce((sum, i) => {
          const price = parseInt(i.price.replace(/[^0-9]/g, '')) || 0
          return sum + price * i.quantity
        }, 0)
        return '₹' + total.toLocaleString()
      },
    }),
    { name: 'jeevan-cart' }
  )
)
