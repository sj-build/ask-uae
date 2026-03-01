import { NextResponse } from 'next/server'
import { runEval } from '@/lib/eval/runner'

export const maxDuration = 55

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
    const result = await runEval({ run_type: 'daily_rules' })

    return NextResponse.json({
      success: true,
      triggered: 'daily_rules',
      result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Eval daily cron failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
