import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const { email, phone, type } = await req.json()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/otp`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:JSON.stringify(type==='email'?{email,create_user:true}:{phone,create_user:true})})
    return NextResponse.json({success:r.ok},{status:r.ok?200:400})
  } catch { return NextResponse.json({success:false},{status:500}) }
}
