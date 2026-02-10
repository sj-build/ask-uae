import { NextResponse } from 'next/server'
import { z } from 'zod'
import { collectCandidates } from '@/lib/image-refresh'

export const maxDuration = 55

const RequestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(80),
  queries: z.array(z.string().max(200)).min(1).max(5).optional(),
  maxCandidates: z.number().int().min(1).max(10).default(6),
})

/**
 * POST /api/images/refresh
 * Collects candidates for a place slug. Does NOT auto-confirm.
 */
export async function POST(request: Request): Promise<NextResponse> {
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
