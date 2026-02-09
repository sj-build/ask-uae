import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

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

const UpdateIssueSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['open', 'triaged', 'fixed', 'dismissed']),
})

/**
 * PATCH /api/admin/eval/issues
 *
 * Update issue status
 */
export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const parseResult = UpdateIssueSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { id, status } = parseResult.data
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('eval_issues')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to update issue: ${error.message}`)
    }

    return NextResponse.json({ success: true, id, status })
  } catch (error) {
    console.error('Admin eval issues error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
