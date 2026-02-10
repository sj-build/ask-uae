'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ──────────────────────────────────────────────
interface Candidate {
  id: number
  place_slug: string
  provider: string
  provider_ref: string
  image_url: string
  thumb_url: string | null
  photographer: string | null
  photographer_url: string | null
  license: string | null
  source_url: string | null
  score: number
  meta: {
    width?: number
    height?: number
    likes?: number
    description?: string
    attribution?: string
  }
  created_at: string
}

interface SelectedImage {
  place_slug: string
  image_url: string
  source: Record<string, unknown>
  updated_at: string
}

// ─── Constants ──────────────────────────────────────────
const ALL_SLUGS = [
  'saadiyat-island',
  'al-maryah-island',
  'downtown-corniche',
  'yas-island',
  'al-reem-island',
  'masdar-city',
  'kizad',
  'difc',
  'downtown-dubai',
  'business-bay',
  'dubai-marina',
  'jlt',
  'internet-city-media-city',
  'deira-old-dubai',
  'dubai-south',
] as const

const SLUG_LABELS: Record<string, string> = {
  'saadiyat-island': 'Saadiyat Island',
  'al-maryah-island': 'Al Maryah Island',
  'downtown-corniche': 'Downtown / Corniche',
  'yas-island': 'Yas Island',
  'al-reem-island': 'Al Reem Island',
  'masdar-city': 'Masdar City',
  'kizad': 'KIZAD',
  'difc': 'DIFC',
  'downtown-dubai': 'Downtown Dubai',
  'business-bay': 'Business Bay',
  'dubai-marina': 'Dubai Marina',
  'jlt': 'JLT',
  'internet-city-media-city': 'Internet / Media City',
  'deira-old-dubai': 'Deira / Old Dubai',
  'dubai-south': 'Dubai South',
}

// ─── Page ───────────────────────────────────────────────
export default function PlaceImagesAdmin() {
  const [activeSlug, setActiveSlug] = useState<string>(ALL_SLUGS[0])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selected, setSelected] = useState<SelectedImage | null>(null)
  const [allSelected, setAllSelected] = useState<SelectedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selecting, setSelecting] = useState<number | null>(null)
  const [manualUrl, setManualUrl] = useState('')
  const [manualSubmitting, setManualSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Load overview on mount
  useEffect(() => {
    fetch('/api/admin/place-images')
      .then(r => r.json())
      .then(d => setAllSelected(d.selected ?? []))
      .catch(() => { /* ignore */ })
  }, [])

  // Load candidates for active slug
  const loadSlug = useCallback(async (slug: string) => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/place-images?slug=${slug}`)
      const data = await res.json()
      setCandidates(data.candidates ?? [])
      setSelected(data.selected ?? null)
    } catch {
      setCandidates([])
      setSelected(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSlug(activeSlug)
  }, [activeSlug, loadSlug])

  // Collect new candidates from Unsplash
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    setMessage(null)
    try {
      const res = await fetch('/api/images/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: activeSlug, maxCandidates: 6 }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'ok', text: `Collected ${data.saved} candidates (searched ${data.searched}, passed filter ${data.passed_filter})` })
        await loadSlug(activeSlug)
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Refresh failed' })
      }
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Refresh failed' })
    } finally {
      setRefreshing(false)
    }
  }, [activeSlug, loadSlug])

  // Select a candidate
  const handleSelect = useCallback(async (candidateId: number) => {
    setSelecting(candidateId)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/place-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: activeSlug, candidate_id: candidateId }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'ok', text: 'Image confirmed and mirrored to Storage' })
        setSelected({ place_slug: activeSlug, image_url: data.image_url, source: data.source, updated_at: new Date().toISOString() })
        setAllSelected(prev => {
          const filtered = prev.filter(s => s.place_slug !== activeSlug)
          return [...filtered, { place_slug: activeSlug, image_url: data.image_url, source: data.source, updated_at: new Date().toISOString() }]
        })
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Selection failed' })
      }
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Selection failed' })
    } finally {
      setSelecting(null)
    }
  }, [activeSlug])

  // Manual URL submit
  const handleManualSubmit = useCallback(async () => {
    if (!manualUrl.trim()) return
    setManualSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/place-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: activeSlug, manual_url: manualUrl.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'ok', text: 'Manual image confirmed and mirrored to Storage' })
        setManualUrl('')
        setSelected({ place_slug: activeSlug, image_url: data.image_url, source: data.source, updated_at: new Date().toISOString() })
        setAllSelected(prev => {
          const filtered = prev.filter(s => s.place_slug !== activeSlug)
          return [...filtered, { place_slug: activeSlug, image_url: data.image_url, source: data.source, updated_at: new Date().toISOString() }]
        })
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Manual submit failed' })
      }
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Manual submit failed' })
    } finally {
      setManualSubmitting(false)
    }
  }, [activeSlug, manualUrl])

  const selectedSlugs = new Set(allSelected.map(s => s.place_slug))

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-gold">Place Images</h1>
        <p className="text-t3 text-xs mt-1">
          Select representative images for each neighborhood.
          {' '}{selectedSlugs.size}/{ALL_SLUGS.length} confirmed.
        </p>
      </div>

      {/* Place selector */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {ALL_SLUGS.map(slug => {
          const isActive = slug === activeSlug
          const hasImage = selectedSlugs.has(slug)
          return (
            <button
              key={slug}
              onClick={() => setActiveSlug(slug)}
              className={`
                px-2.5 py-1.5 text-xs rounded-md border transition-all duration-200
                ${isActive
                  ? 'bg-gold/15 text-gold border-gold/30'
                  : hasImage
                    ? 'bg-accent-green/8 text-accent-green border-accent-green/20 hover:bg-accent-green/15'
                    : 'bg-bg3 text-t3 border-brd hover:text-t2 hover:bg-bg3/80'
                }
              `}
            >
              {hasImage ? '\u2713 ' : ''}{SLUG_LABELS[slug] ?? slug}
            </button>
          )
        })}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 px-3 py-2 rounded-lg text-xs ${
          message.type === 'ok' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : 'bg-accent-red/10 text-accent-red border border-accent-red/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Current selected image */}
      <div className="mb-6 p-4 bg-bg2 border border-brd rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-t1">
            {SLUG_LABELS[activeSlug] ?? activeSlug}
            {selected && <span className="text-accent-green ml-2 text-xs font-normal">Confirmed</span>}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 text-xs font-medium bg-gold/10 text-gold border border-gold/20 rounded-md hover:bg-gold/20 disabled:opacity-40 transition-all duration-200"
          >
            {refreshing ? 'Collecting...' : 'Collect Candidates'}
          </button>
        </div>

        {selected ? (
          <div className="flex gap-4">
            <img
              src={selected.image_url}
              alt={activeSlug}
              className="w-64 h-36 object-cover rounded-lg border border-brd"
            />
            <div className="text-xs text-t3 space-y-1">
              <p>Updated: {new Date(selected.updated_at).toLocaleDateString()}</p>
              {selected.source && typeof selected.source === 'object' && (
                <>
                  {(selected.source as Record<string, string>).photographer && (
                    <p>Photo by {(selected.source as Record<string, string>).photographer}</p>
                  )}
                  {(selected.source as Record<string, string>).provider && (
                    <p>Provider: {(selected.source as Record<string, string>).provider}</p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-t4 text-xs">No image confirmed yet. Collect candidates or add a manual URL below.</p>
        )}
      </div>

      {/* Candidates grid */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-t2 mb-3">
          Candidates {loading ? '...' : `(${candidates.length})`}
        </h3>

        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-bg3 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {candidates.map(c => (
              <div key={c.id} className="bg-bg2 border border-brd rounded-xl overflow-hidden group">
                <div className="relative">
                  <img
                    src={c.thumb_url ?? c.image_url}
                    alt={c.meta?.description ?? c.place_slug}
                    className="w-full h-36 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-bg/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-gold">
                    {Math.round(c.score)}
                  </div>
                </div>
                <div className="p-2.5 space-y-1.5">
                  <p className="text-[11px] text-t2 line-clamp-2">
                    {c.meta?.description ?? 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-t4">
                      {c.photographer ?? 'Unknown'}
                      {c.meta?.likes ? ` · ${c.meta.likes} likes` : ''}
                    </span>
                    <button
                      onClick={() => handleSelect(c.id)}
                      disabled={selecting !== null}
                      className={`
                        px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all duration-200
                        ${selecting === c.id
                          ? 'bg-gold/20 text-gold border-gold/30 opacity-60'
                          : 'bg-accent-green/10 text-accent-green border-accent-green/20 hover:bg-accent-green/20'
                        }
                      `}
                    >
                      {selecting === c.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-t4 text-xs">No candidates. Click "Collect Candidates" to search Unsplash.</p>
        )}
      </div>

      {/* Manual URL input */}
      <div className="p-4 bg-bg2 border border-brd rounded-xl">
        <h3 className="text-sm font-semibold text-t2 mb-2">Manual URL</h3>
        <p className="text-t4 text-[10px] mb-2">
          Paste any image URL to use as the place image. It will be downloaded and mirrored to Supabase Storage.
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-3 py-2 bg-bg3 border border-brd rounded-lg text-xs text-t1 placeholder:text-t4 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all duration-200"
          />
          <button
            onClick={handleManualSubmit}
            disabled={manualSubmitting || !manualUrl.trim()}
            className="px-4 py-2 text-xs font-medium bg-gold/10 text-gold border border-gold/20 rounded-lg hover:bg-gold/20 disabled:opacity-40 transition-all duration-200"
          >
            {manualSubmitting ? 'Uploading...' : 'Confirm URL'}
          </button>
        </div>
      </div>
    </div>
  )
}
