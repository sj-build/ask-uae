'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Map, AlertTriangle } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { useHormuzRealtime } from '@/hooks/useHormuzRealtime'
import { getLatestVessels, getActiveMapEvents, getActiveAlerts } from '@/lib/hormuz/queries'
import { MapControls } from '@/components/hormuz/MapControls'
import { MapLegend } from '@/components/hormuz/MapLegend'
import { MapSidebar } from '@/components/hormuz/MapSidebar'
import type { VesselPosition, MapEvent, MaritimeAlert, MapLayerConfig } from '@/types/hormuz'

// Dynamic import — Leaflet MUST NOT run on server
const CrisisMapClient = dynamic(
  () => import('@/components/hormuz/CrisisMapClient'),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
)

function MapLoadingSkeleton() {
  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] rounded-lg overflow-hidden border border-[#1a1b23] bg-[#0c0d14] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="relative">
          <Map className="w-12 h-12 text-[#c8a44e]/30 mx-auto animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#c8a44e]/40 border-t-[#c8a44e] rounded-full animate-spin" />
          </div>
        </div>
        <p className="text-sm text-gray-500">Loading Crisis Map...</p>
      </div>
    </div>
  )
}

export default function CrisisMapPage() {
  const { locale } = useLocale()
  const isKo = locale === 'ko'

  // --- Data state ---
  const [vessels, setVessels] = useState<VesselPosition[]>([])
  const [events, setEvents] = useState<MapEvent[]>([])
  const [alerts, setAlerts] = useState<MaritimeAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- Layer toggles ---
  const [layers, setLayers] = useState<MapLayerConfig>({
    vessels: true,
    warEvents: true,
    securityZones: true,
    infrastructure: true,
  })

  // --- Auto-refresh ---
  const [autoRefresh, setAutoRefresh] = useState(true)

  // --- Realtime updates ---
  const realtime = useHormuzRealtime()

  // --- Fetch initial data ---
  const fetchData = useCallback(async () => {
    try {
      const [v, e, a] = await Promise.all([
        getLatestVessels(6),
        getActiveMapEvents(100),
        getActiveAlerts(10),
      ])
      setVessels(v)
      setEvents(e)
      setAlerts(a)
      setError(null)
    } catch (err) {
      console.error('Crisis map data fetch error:', err)
      setError(isKo ? '데이터를 불러오지 못했습니다' : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [isKo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- Merge realtime updates ---
  useEffect(() => {
    if (realtime.newVessels.length > 0 && autoRefresh) {
      setVessels(prev => {
        const updated = [...prev]
        for (const newV of realtime.newVessels) {
          const idx = updated.findIndex(v => v.mmsi === newV.mmsi)
          if (idx >= 0) {
            updated[idx] = newV
          } else {
            updated.push(newV)
          }
        }
        return updated
      })
    }
  }, [realtime.newVessels, autoRefresh])

  useEffect(() => {
    if (realtime.newMapEvents.length > 0 && autoRefresh) {
      setEvents(prev => {
        const ids = new Set(prev.map(e => e.id))
        const newOnes = realtime.newMapEvents.filter(e => !ids.has(e.id))
        return [...newOnes, ...prev]
      })
    }
  }, [realtime.newMapEvents, autoRefresh])

  // --- Auto-refresh interval (polling fallback) ---
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchData, 60_000) // Poll every 60s
    return () => clearInterval(interval)
  }, [autoRefresh, fetchData])

  // --- Layer toggle handler ---
  const handleToggleLayer = useCallback((layer: keyof MapLayerConfig) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Page header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <div>
              <h1 className="text-lg font-bold text-gray-100 tracking-tight">
                {isKo ? '호르무즈 위기 지도' : 'Hormuz Crisis Map'}
              </h1>
              <p className="text-[12px] text-gray-500">
                {isKo
                  ? '실시간 선박 위치, 전쟁 이벤트, 보안 구역 모니터링'
                  : 'Real-time vessel positions, war events & security zones'}
              </p>
            </div>
          </div>

          {/* Alert banner if any critical alerts */}
          {alerts.some(a => a.threat_level === 'critical') && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-md">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-[11px] text-red-400 font-medium">
                {isKo ? '긴급 보안 경보 활성' : 'Critical Security Alert Active'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Map area with overlays */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Error state */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
            <button
              onClick={fetchData}
              className="text-xs text-red-300 underline hover:text-red-200 ml-2"
            >
              {isKo ? '재시도' : 'Retry'}
            </button>
          </div>
        )}

        <div className="relative flex">
          {/* Map container */}
          <div className="flex-1 relative">
            {isLoading ? (
              <MapLoadingSkeleton />
            ) : (
              <CrisisMapClient
                vessels={vessels}
                events={events}
                layers={layers}
              />
            )}

            {/* Map overlays */}
            <MapControls
              layers={layers}
              onToggleLayer={handleToggleLayer}
              isConnected={realtime.connected}
              autoRefresh={autoRefresh}
              onToggleAutoRefresh={() => setAutoRefresh(prev => !prev)}
              vesselCount={vessels.length}
              eventCount={events.length}
            />
            <MapLegend />
          </div>

          {/* Sidebar — desktop only (mobile uses absolute overlay from MapSidebar) */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-0 h-[calc(100vh-200px)] min-h-[500px] bg-[#0c0d14] border border-[#1a1b23] border-l-0 rounded-r-lg overflow-hidden">
              <MapSidebar
                vessels={vessels}
                events={events}
                lastUpdate={realtime.lastUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
