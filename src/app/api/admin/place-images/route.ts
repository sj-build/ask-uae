import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase'

export const maxDuration = 55

/**
 * GET /api/admin/place-images?slug=difc
 * Returns candidates and current selection for a place.
 * Without slug: returns all places overview.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const supabase = getSupabaseAdmin()

    if (slug) {
      const [candidates, selected] = await Promise.all([
        supabase
          .from('place_image_candidates')
          .select('*')
          .eq('place_slug', slug)
          .order('score', { ascending: false }),
        supabase
          .from('place_image_selected')
          .select('*')
          .eq('place_slug', slug)
          .single(),
      ])

      return NextResponse.json({
        slug,
        candidates: candidates.data ?? [],
        selected: selected.data ?? null,
      })
    }

    // Overview: all selected images
    const { data: allSelected } = await supabase
      .from('place_image_selected')
      .select('place_slug, image_url, updated_at')
      .order('place_slug')

    return NextResponse.json({
      selected: allSelected ?? [],
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const SelectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(80),
  candidate_id: z.number().int().positive().optional(),
  manual_url: z.string().url().optional(),
})

/**
 * POST /api/admin/place-images
 * Select a candidate: download -> mirror to Storage -> upsert place_image_selected
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const parsed = SelectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { slug, candidate_id, manual_url } = parsed.data

    if (!candidate_id && !manual_url) {
      return NextResponse.json(
        { error: 'Either candidate_id or manual_url required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    let imageUrl: string
    let sourceInfo: Record<string, unknown>

    if (manual_url) {
      // Manual URL — download and mirror to Storage
      const imageResponse = await fetch(manual_url, {
        signal: AbortSignal.timeout(15000),
      })

      if (!imageResponse.ok) {
        return NextResponse.json(
          { error: `Failed to download image: ${imageResponse.status}` },
          { status: 502 }
        )
      }

      const arrayBuffer = await imageResponse.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const storagePath = `place-selected/${slug}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('neighborhood-images')
        .upload(storagePath, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: `Storage upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      const { data: urlData } = supabase.storage
        .from('neighborhood-images')
        .getPublicUrl(storagePath)

      imageUrl = urlData.publicUrl
      sourceInfo = { provider: 'manual', url: manual_url }
    } else {
      // Select from candidates
      const { data: candidate, error } = await supabase
        .from('place_image_candidates')
        .select('*')
        .eq('id', candidate_id)
        .single()

      if (error || !candidate) {
        return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
      }

      // Download the image
      const imageResponse = await fetch(candidate.image_url, {
        signal: AbortSignal.timeout(15000),
      })

      if (!imageResponse.ok) {
        return NextResponse.json(
          { error: `Failed to download image: ${imageResponse.status}` },
          { status: 502 }
        )
      }

      const arrayBuffer = await imageResponse.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const storagePath = `place-selected/${slug}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('neighborhood-images')
        .upload(storagePath, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: `Storage upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      const { data: urlData } = supabase.storage
        .from('neighborhood-images')
        .getPublicUrl(storagePath)

      imageUrl = urlData.publicUrl
      sourceInfo = {
        provider: candidate.provider,
        provider_ref: candidate.provider_ref,
        photographer: candidate.photographer,
        photographer_url: candidate.photographer_url,
        license: candidate.license,
        source_url: candidate.source_url,
        attribution: candidate.meta?.attribution,
      }
    }

    // Upsert place_image_selected
    const { error: upsertError } = await supabase
      .from('place_image_selected')
      .upsert({
        place_slug: slug,
        image_url: imageUrl,
        source: sourceInfo,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'place_slug',
      })

    if (upsertError) {
      return NextResponse.json(
        { error: `Failed to save selection: ${upsertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      slug,
      image_url: imageUrl,
      source: sourceInfo,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Selection failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
