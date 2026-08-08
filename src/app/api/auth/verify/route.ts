import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const { token, type, identifier } = await req.json()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/verify`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:JSON.stringify({type:type==='email'?'email':'sms',[type==='email'?'email':'phone']:identifier,token,create_user:true})})
    const data = await r.json()
    return NextResponse.json({success:r.ok,user:data},{status:r.ok?200:400})
  } catch { return NextResponse.json({success:false},{status:500}) }
}
