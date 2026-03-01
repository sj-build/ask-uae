import { NextResponse } from 'next/server'
import { evaluateAlerts } from '@/lib/hormuz/alerts'

export const maxDuration = 55

function verifyCronSecret(request: Request): boolean {
  const cronSecret = request.headers.get('x-cron-secret')
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) {
    return process.env.NODE_ENV === 'development'
  }
  return (
    cronSecret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  )
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await evaluateAlerts()

    return NextResponse.json({
      success: true,
      message: `Alerts evaluated: ${result.totalChecked} checked, ${result.alertsFired} fired, ${result.alertsSent} sent, ${result.cooldownSkipped} skipped (cooldown)`,
      count: result.alertsSent,
      details: {
        totalChecked: result.totalChecked,
        alertsFired: result.alertsFired,
        alertsSent: result.alertsSent,
        cooldownSkipped: result.cooldownSkipped,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Alert evaluation failed'
    console.error('evaluate-alerts error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
