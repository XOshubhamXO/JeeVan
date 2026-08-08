'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore()

  const handleCheckout = () => {
    const lines = items.map(i => `${i.quantity}x ${i.name} (${i.price})`).join('\n')
    const msg = encodeURIComponent(`Hi JeeVan! I'd like to order:\n\n${lines}\n\nTotal: ${totalPrice()}\n\nPlease share payment details.`)
    window.open(`https://wa.me/919009790421?text=${msg}`, '_blank')
    clearCart()
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative btn-ghost p-2" aria-label={`Cart: ${totalItems()} items`}>
        <ShoppingBag className="w-5 h-5" />
        {totalItems() > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
            {totalItems()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]" onClick={() => setOpen(false)} />
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:25,stiffness:200}}
              className="fixed right-0 top-0 h-full w-full max-w-md z-[160] flex flex-col" style={{background:'var(--bg-primary)',borderLeft:'1px solid var(--border-subtle)'}}>
              <div className="flex items-center justify-between p-6 border-b" style={{borderColor:'var(--border-subtle)'}}>
                <h2 className="text-lg font-semibold" style={{fontFamily:'var(--font-display)'}}>Your Cart ({totalItems()})</h2>
                <button onClick={() => setOpen(false)} className="btn-ghost p-1"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-sm" style={{color:'var(--text-muted)'}}>
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                    <p className="text-xs mt-1">Browse the shop to add items</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-xl" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)'}}>
                      <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0" style={{backgroundImage:`url(${item.image})`}} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-[10px] mt-0.5" style={{color:'var(--text-muted)'}}>{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded hover:bg-white/10"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded hover:bg-white/10"><Plus className="w-3 h-3" /></button>
                          <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-white/10 ml-auto" style={{color:'var(--text-muted)'}}><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t space-y-3" style={{borderColor:'var(--border-subtle)'}}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total</span>
                    <span className="text-lg font-bold" style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>{totalPrice()}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn-primary w-full justify-center">
                    <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                  </button>
                  <button onClick={clearCart} className="btn-ghost w-full text-xs" style={{color:'var(--text-muted)'}}>Clear cart</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
