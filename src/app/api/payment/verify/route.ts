import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) return NextResponse.json({ verified: true, mode: 'mock' })
  const sign = razorpay_order_id + '|' + razorpay_payment_id
  const expected = crypto.createHmac('sha256', keySecret).update(sign).digest('hex')
  return NextResponse.json({ verified: expected === razorpay_signature })
}
