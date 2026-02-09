import { NextResponse } from 'next/server'
import { z } from 'zod'

const TriggerSchema = z.object({
  run_type: z.enum(['daily_rules', 'weekly_factcheck', 'on_demand']),
})

/**
 * POST /api/admin/eval/trigger
 *
 * Trigger an eval run from admin dashboard
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const parseResult = TriggerSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { run_type } = parseResult.data
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      return NextResponse.json(
        { success: false, error: 'CRON_SECRET not configured' },
        { status: 503 }
      )
    }

    // Call the eval/run endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/eval/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': cronSecret,
      },
      body: JSON.stringify({ run_type }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to trigger run')
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Admin eval trigger error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
