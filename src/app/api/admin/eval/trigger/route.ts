import { NextResponse } from 'next/server'
import { z } from 'zod'
import { runEval } from '@/lib/eval/runner'

export const maxDuration = 55

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

    const result = await runEval({ run_type })

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
