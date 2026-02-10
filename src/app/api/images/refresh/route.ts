import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { collectCandidates } from '@/lib/image-refresh'

export const maxDuration = 55

const RequestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(80),
  queries: z.array(z.string().max(200)).min(1).max(5).optional(),
  maxCandidates: z.number().int().min(1).max(10).default(6),
})

async function checkAuth(request: Request): Promise<boolean> {
  // Cookie-based (admin UI)
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value) {
    const { valid } = verifySessionToken(session.value)
    if (valid) return true
  }
  // Header-based (cron/scripts)
  const secret = request.headers.get('x-admin-secret')
    || request.headers.get('authorization')?.replace('Bearer ', '')
  const expected = process.env.ADMIN_PASSWORD ?? process.env.CRON_SECRET
  return Boolean(expected && secret === expected)
}

/**
 * POST /api/images/refresh
 * Collects candidates for a place slug. Does NOT auto-confirm.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const result = await collectCandidates({
      slug: parsed.data.slug,
      queries: parsed.data.queries,
      maxCandidates: parsed.data.maxCandidates,
    })

    return NextResponse.json(result, { status: result.success ? 200 : 404 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image refresh failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
