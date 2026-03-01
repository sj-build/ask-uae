import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/eval
 *
 * Get eval runs and issues for admin dashboard
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = getSupabaseAdmin()

    const { data: runs, error: runsError } = await supabase
      .from('eval_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(20)

    if (runsError) {
      throw new Error(`Failed to fetch runs: ${runsError.message}`)
    }

    const { data: issues, error: issuesError } = await supabase
      .from('eval_issues')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (issuesError) {
      throw new Error(`Failed to fetch issues: ${issuesError.message}`)
    }

    return NextResponse.json({
      success: true,
      runs: runs || [],
      issues: issues || [],
    })
  } catch (error) {
    console.error('Admin eval error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
