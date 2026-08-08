'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Shield, Loader2, Check, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n'

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  error?: { description: string }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  modal: { ondismiss: () => void }
}

interface RazorpayInstance {
  on: (event: string, callback: (response: RazorpayResponse) => void) => void
  open: () => void
}

declare global { interface Window { Razorpay: new (options: RazorpayOptions) => RazorpayInstance } }

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCartStore()
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const total = items.reduce((sum, i) => {
    const p = parseInt(i.price.replace(/[^0-9]/g, '')) || 0
    return sum + p
  }, 0)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => setRazorpayLoaded(false)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const handleRazorpay = useCallback(async () => {
    if (!razorpayLoaded) return setError('Payment gateway loading. Please wait or use WhatsApp.')
    setLoading(true)
    setError('')

    try {
      const orderRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100, currency: 'INR' }),
      })
      const orderData = await orderRes.json()

      if (!orderData.id) throw new Error('Failed to create order')

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'JeeVan',
        description: `${items.length} items from JeeVan Store`,
        order_id: orderData.id,
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.verified) {
            setSuccess(true)
            clearCart()
          } else {
            setError('Payment verification failed. Please contact support.')
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#5A9E4B' },
        modal: { ondismiss: () => setLoading(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response: RazorpayResponse) => {
        setError(`Payment failed: ${response.error?.description || 'Unknown error'}`)
        setLoading(false)
      })
      rzp.open()
      setLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }, [razorpayLoaded, total, items, clearCart])

  const handleWhatsApp = () => {
    const msg = items.map(i => `${i.name} (${i.price})`).join(', ')
    const totalMsg = `Total: ₹${total}`
    window.open(`https://wa.me/919009790421?text=${encodeURIComponent(`JeeVan Order:\n${msg}\n${totalMsg}`)}`, '_blank')
  }

  if (items.length === 0 && !success) {
    return (
      <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="lead">{t('cart.empty')}</p>
          <a href="/shop" className="btn-primary mt-4 inline-flex"><ArrowLeft className="w-4 h-4" /> Back to Shop</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'var(--bg-primary)',color:'var(--text-primary)'}} className="min-h-screen">
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-lg mx-auto">
          <a href="/shop" className="inline-flex items-center gap-1 text-xs mb-8 hover:underline" style={{color:'var(--text-muted)'}}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </a>

          {success ? (
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="card p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(90,158,75,0.15)'}}>
                <Check className="w-8 h-8" style={{color:'var(--accent-green)'}} />
              </div>
              <h2 className="text-xl mb-2" style={{fontFamily:'var(--font-display)'}}>Payment Successful!</h2>
              <p className="small mb-6" style={{color:'var(--text-secondary)'}}>{`Thank you for your order. We'll process it within 24 hours and contact you via WhatsApp.`}</p>
              <a href="/shop" className="btn-primary inline-flex">Continue Shopping</a>
            </motion.div>
          ) : (
            <>
              <h1 style={{fontFamily:'var(--font-display)'}} className="mb-6">Checkout</h1>

              <div className="card p-5 mb-6">
                <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" style={{color:'var(--accent-green)'}} /> Order Summary ({items.length} items)
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="font-medium" style={{color:'var(--accent-green)'}}>{item.price}</span>
                        <button onClick={() => removeItem(item.id)} className="text-[10px] hover:underline" style={{color:'var(--text-muted)'}}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold" style={{borderColor:'var(--border-subtle)'}}>
                  <span>Total</span>
                  <span style={{color:'var(--accent-green)',fontFamily:'var(--font-display)'}}>₹{total}</span>
                </div>
              </div>

              <div className="card p-5 mb-6">
                <h2 className="font-semibold text-sm mb-4">Payment Method</h2>

                <button
                  onClick={handleRazorpay}
                  disabled={loading}
                  className="btn-primary w-full justify-center mb-3 py-3"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Pay ₹{total} Online (Razorpay)
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{background:'var(--border-subtle)'}} />
                  <span className="text-[10px]" style={{color:'var(--text-muted)'}}>OR</span>
                  <div className="flex-1 h-px" style={{background:'var(--border-subtle)'}} />
                </div>

                <button onClick={handleWhatsApp} className="btn-secondary w-full justify-center py-3">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Order via WhatsApp
                </button>

                {error && (
                  <div className="mt-4 px-4 py-3 rounded-lg text-xs" style={{background:'rgba(200,60,60,0.1)',border:'1px solid rgba(200,60,60,0.2)',color:'#e88'}}>
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-5 text-[10px]" style={{color:'var(--text-muted)'}}>
                  <Shield className="w-3.5 h-3.5" /> Secure payment via Razorpay. Your data is encrypted.
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
