import { NextResponse } from 'next/server'

function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) {
    return process.env.NODE_ENV === 'development'
  }
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://askuae.vercel.app'
    const secret = process.env.CRON_SECRET || ''

    const response = await fetch(`${baseUrl}/api/eval/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': secret,
      },
      body: JSON.stringify({ type: 'weekly_factcheck' }),
    })

    const result = await response.json()

    return NextResponse.json({
      success: response.ok,
      triggered: 'weekly_factcheck',
      result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Eval weekly cron failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
