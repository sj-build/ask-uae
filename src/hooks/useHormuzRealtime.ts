'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import type {
  VesselPosition,
  OilPrice,
  MaritimeAlert,
  WarNewsItem,
  MapEvent,
} from '@/types/hormuz'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface HormuzRealtimeState {
  /** Latest vessel positions (new entries only, not full list) */
  newVessels: VesselPosition[]
  /** Latest oil price updates */
  latestOil: OilPrice | null
  /** New alerts */
  newAlerts: MaritimeAlert[]
  /** New war news */
  newNews: WarNewsItem[]
  /** New map events */
  newMapEvents: MapEvent[]
  /** Whether realtime is connected */
  connected: boolean
  /** Last update timestamp */
  lastUpdate: Date | null
}

/**
 * Subscribe to Supabase Realtime for Hormuz crisis data.
 * Returns new inserts only — combine with initial data fetch.
 */
export function useHormuzRealtime() {
  const [state, setState] = useState<HormuzRealtimeState>({
    newVessels: [],
    latestOil: null,
    newAlerts: [],
    newNews: [],
    newMapEvents: [],
    connected: false,
    lastUpdate: null,
  })

  const channelsRef = useRef<RealtimeChannel[]>([])

  const clearNew = useCallback(() => {
    setState(prev => ({
      ...prev,
      newVessels: [],
      newAlerts: [],
      newNews: [],
      newMapEvents: [],
    }))
  }, [])

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Oil price updates
    const oilChannel = supabase
      .channel('hormuz-oil')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'oil_price_tracking' },
        (payload) => {
          setState(prev => ({
            ...prev,
            latestOil: payload.new as OilPrice,
            lastUpdate: new Date(),
          }))
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setState(prev => ({ ...prev, connected: true }))
        }
      })

    // Maritime alerts
    const alertChannel = supabase
      .channel('hormuz-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'maritime_security_alerts' },
        (payload) => {
          setState(prev => ({
            ...prev,
            newAlerts: [payload.new as MaritimeAlert, ...prev.newAlerts].slice(0, 20),
            lastUpdate: new Date(),
          }))
        }
      )
      .subscribe()

    // War news
    const newsChannel = supabase
      .channel('hormuz-news')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'war_news_feed' },
        (payload) => {
          setState(prev => ({
            ...prev,
            newNews: [payload.new as WarNewsItem, ...prev.newNews].slice(0, 50),
            lastUpdate: new Date(),
          }))
        }
      )
      .subscribe()

    // Map events
    const mapChannel = supabase
      .channel('hormuz-map')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'map_events' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setState(prev => ({
              ...prev,
              newMapEvents: [payload.new as MapEvent, ...prev.newMapEvents].slice(0, 50),
              lastUpdate: new Date(),
            }))
          }
        }
      )
      .subscribe()

    channelsRef.current = [oilChannel, alertChannel, newsChannel, mapChannel]

    return () => {
      for (const channel of channelsRef.current) {
        supabase.removeChannel(channel)
      }
      channelsRef.current = []
    }
  }, [])

  return { ...state, clearNew }
}
