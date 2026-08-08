/**
 * POST /api/payment/create-order — Razorpay order creation
 * Body: { amount, currency, receipt }
 * Returns: { orderId, amount, currency }
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { amount, currency = 'INR', receipt } = await req.json()
  if (!amount) return NextResponse.json({ error: 'amount required' }, { status: 400 })

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    // Mock mode: return simulated order for testing
    return NextResponse.json({
      id: `order_mock_${Date.now()}`,
      amount: amount * 100, // paise
      currency,
      receipt: receipt || `jeevan_${Date.now()}`,
      status: 'created',
      mode: 'mock',
      note: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel for live payments',
    })
  }

  // Live Razorpay order
  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency,
        receipt: receipt || `jeevan_${Date.now()}`,
        payment_capture: 1,
      }),
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()
    if (res.ok) return NextResponse.json(data)
    return NextResponse.json({ error: data.error?.description || 'Payment failed' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 502 })
  }
}
