import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase'
import { runEval } from '@/lib/eval/runner'

export const maxDuration = 55

const EvalRunRequestSchema = z.object({
  run_type: z.enum(['daily_rules', 'weekly_factcheck', 'on_demand']),
  scope: z
    .object({
      pages: z.array(z.string()).optional(),
      documents: z.array(z.string()).optional(),
      since: z.string().optional(),
    })
    .optional(),
  dry_run: z.boolean().optional().default(false),
})

/**
 * POST /api/eval/run — Trigger an evaluation run
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const cronSecret = request.headers.get('x-cron-secret')
    const expectedCronSecret = process.env.CRON_SECRET

    if (!expectedCronSecret || cronSecret !== expectedCronSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parseResult = EvalRunRequestSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: parseResult.error.issues },
        { status: 400 }
      )
    }

    const { run_type, scope, dry_run } = parseResult.data

    const result = await runEval({ run_type, scope, dry_run })

    return NextResponse.json({
      success: true,
      ...result,
      run_type,
    })
  } catch (error) {
    console.error('Eval run error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

/**
 * GET /api/eval/run — Get recent eval runs
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const cronSecret = request.headers.get('x-cron-secret')
    const expectedCronSecret = process.env.CRON_SECRET

    if (!expectedCronSecret || cronSecret !== expectedCronSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)

    const supabase = getSupabaseAdmin()

    const { data: runs, error } = await supabase
      .from('eval_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(Math.min(limit, 50))

    if (error) {
      throw new Error(`Failed to fetch runs: ${error.message}`)
    }

    return NextResponse.json({ success: true, runs })
  } catch (error) {
    console.error('Get eval runs error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
