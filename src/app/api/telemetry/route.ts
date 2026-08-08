/**
 * JeeVan Telemetry API
 *
 * Captures user session data: entry/exit timestamps, clickstreams,
 * mouse trails, dwell times, and location information.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      session_id,
      event_type,
      page_path,
    } = body

    // In production: insert full telemetry into Supabase/PostgreSQL user_telemetry table
    console.log('[JeeVan Telemetry]', {
      session_id,
      event_type,
      page_path,
      timestamp: new Date().toISOString(),
      full_payload: body,
    })

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 },
    )
  }
}

export async function GET() {
  // Health check
  return NextResponse.json({
    service: 'JeeVan Telemetry API',
    status: 'operational',
    version: '1.0.0',
  })
}
