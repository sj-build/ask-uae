import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase configuration missing')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

/**
 * GET /api/admin/eval
 *
 * Get eval runs and issues for admin dashboard
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = getSupabaseAdmin()

    // Fetch recent runs
    const { data: runs, error: runsError } = await supabase
      .from('eval_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(20)

    if (runsError) {
      throw new Error(`Failed to fetch runs: ${runsError.message}`)
    }

    // Fetch recent issues
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
