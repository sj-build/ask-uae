import { NextResponse } from 'next/server'
import WebSocket from 'ws'
import {
  upsertVesselPositions,
  upsertTrafficSummary,
} from '@/lib/hormuz/queries'
import type {
  VesselType,
  VesselStatus,
  HormuzZone,
  VesselPosition,
} from '@/types/hormuz'

export const maxDuration = 55

// --- Bounding boxes for Hormuz region ---
const BOUNDING_BOXES = [
  // Strait of Hormuz core
  [[25.0, 55.5], [27.0, 57.0]],
  // Persian Gulf (east)
  [[24.0, 51.0], [27.5, 55.5]],
  // Gulf of Oman
  [[22.5, 57.0], [26.0, 62.0]],
] as const

// --- Zone classification by coordinates ---
function classifyZone(lat: number, lon: number): HormuzZone {
  if (lat >= 25.5 && lat <= 27.0 && lon >= 55.5 && lon <= 57.5) return 'hormuz'
  if (lat >= 24.0 && lat <= 30.0 && lon >= 48.0 && lon <= 55.5) return 'persian_gulf'
  if (lat >= 22.0 && lat <= 26.0 && lon >= 57.0 && lon <= 62.0) return 'gulf_of_oman'
  if (lat >= 12.0 && lat <= 20.0 && lon >= 36.0 && lon <= 44.0) return 'red_sea'
  if (lat >= 10.0 && lat <= 15.0 && lon >= 43.0 && lon <= 51.0) return 'gulf_of_aden'
  return 'persian_gulf'
}

// --- AIS ship type code → VesselType ---
function classifyVesselType(shipType: number): VesselType {
  if (shipType >= 80 && shipType <= 89) return 'tanker'
  if (shipType >= 70 && shipType <= 79) return 'cargo'
  if (shipType >= 60 && shipType <= 69) return 'passenger'
  if (shipType >= 40 && shipType <= 49) return 'cargo' // HSC
  if (shipType === 35) return 'military'
  if (shipType >= 90 && shipType <= 99) return 'other' // includes fishing
  return 'other'
}

// --- Auth ---
function verifyCronSecret(request: Request): boolean {
  const cronSecret = request.headers.get('x-cron-secret')
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) {
    return process.env.NODE_ENV === 'development'
  }
  return (
    cronSecret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  )
}

interface AISMessage {
  MetaData: {
    MMSI: number
    MMSI_String: string
    ShipName: string
    latitude: number
    longitude: number
    time_utc: string
  }
  Message: {
    PositionReport?: {
      Sog: number
      TrueHeading: number
      Cog: number
      NavigationalStatus: number
      SpecialManoeuvreIndicator: number
    }
    ShipStaticData?: {
      Type: number
      ImoNumber: number
      Destination: string
      Draught: number
      CallSign: string
      MaximumStaticDraught: number
    }
  }
  MessageType: string
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.AISSTREAM_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'AISSTREAM_API_KEY not configured' },
      { status: 500 }
    )
  }

  const positions: Omit<VesselPosition, 'id' | 'created_at'>[] = []
  const headingHistory = new Map<string, number>() // MMSI → last heading
  const uTurnDetected = new Set<string>()
  const COLLECT_DURATION_MS = 45_000

  try {
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')
      const timeout = setTimeout(() => {
        ws.close()
        resolve()
      }, COLLECT_DURATION_MS)

      ws.on('open', () => {
        const subscription = {
          Apikey: apiKey,
          BoundingBoxes: BOUNDING_BOXES.map(bb => [
            [bb[0][0], bb[0][1]],
            [bb[1][0], bb[1][1]],
          ]),
          FilterMessageTypes: ['PositionReport', 'ShipStaticData'],
        }
        ws.send(JSON.stringify(subscription))
      })

      ws.on('message', (raw: Buffer) => {
        try {
          const msg = JSON.parse(raw.toString()) as AISMessage
          const meta = msg.MetaData
          if (!meta?.MMSI_String || !meta.latitude || !meta.longitude) return

          const mmsi = meta.MMSI_String
          const posReport = msg.Message?.PositionReport
          const staticData = msg.Message?.ShipStaticData

          const speed = posReport?.Sog ?? 0
          const heading = posReport?.TrueHeading ?? null
          const course = posReport?.Cog ?? null
          const navStatus = posReport?.NavigationalStatus

          // U-turn detection
          if (heading !== null && heading < 360) {
            const prevHeading = headingHistory.get(mmsi)
            if (prevHeading !== undefined) {
              const delta = Math.abs(heading - prevHeading)
              const angleDiff = delta > 180 ? 360 - delta : delta
              if (angleDiff > 90) {
                uTurnDetected.add(mmsi)
              }
            }
            headingHistory.set(mmsi, heading)
          }

          let status: VesselStatus = 'transiting'
          if (uTurnDetected.has(mmsi)) status = 'u_turn'
          else if (speed < 0.5) status = 'stopped'

          const shipType = staticData?.Type ?? 0
          const vesselType = classifyVesselType(shipType)
          const zone = classifyZone(meta.latitude, meta.longitude)

          positions.push({
            mmsi,
            vessel_name: meta.ShipName?.trim() || null,
            vessel_type: vesselType,
            imo: staticData?.ImoNumber ? String(staticData.ImoNumber) : null,
            flag: null,
            latitude: meta.latitude,
            longitude: meta.longitude,
            speed_knots: speed,
            heading,
            course,
            nav_status: navStatus !== undefined ? String(navStatus) : null,
            status,
            destination: staticData?.Destination?.trim() || null,
            draught: staticData?.Draught ?? staticData?.MaximumStaticDraught ?? null,
            cargo_type: null,
            estimated_cargo_volume_barrels: null,
            zone,
            timestamp: meta.time_utc || new Date().toISOString(),
          })
        } catch {
          // Skip malformed messages
        }
      })

      ws.on('error', (err) => {
        clearTimeout(timeout)
        reject(err)
      })

      ws.on('close', () => {
        clearTimeout(timeout)
        resolve()
      })
    })

    // Deduplicate by MMSI (keep latest)
    const deduped = new Map<string, Omit<VesselPosition, 'id' | 'created_at'>>()
    for (const pos of positions) {
      deduped.set(pos.mmsi, pos)
    }
    const uniquePositions = Array.from(deduped.values())

    // Batch upsert
    let upsertSuccess = false
    if (uniquePositions.length > 0) {
      upsertSuccess = await upsertVesselPositions(uniquePositions)
    }

    // Compute hourly traffic summary
    const now = new Date()
    const periodStart = new Date(now)
    periodStart.setMinutes(0, 0, 0)

    const tankerCount = uniquePositions.filter(v => v.vessel_type === 'tanker').length
    const lngCount = uniquePositions.filter(v => v.vessel_type === 'lng_carrier').length
    const containerCount = uniquePositions.filter(v => v.vessel_type === 'container').length
    const otherCount = uniquePositions.length - tankerCount - lngCount - containerCount
    const stoppedCount = uniquePositions.filter(v => v.status === 'stopped').length
    const uTurnCount = uniquePositions.filter(v => v.status === 'u_turn').length
    const darkCount = uniquePositions.filter(v => v.status === 'dark').length
    const transitingCount = uniquePositions.filter(v => v.status === 'transiting').length

    const speeds = uniquePositions
      .map(v => v.speed_knots)
      .filter((s): s is number => s !== null && s > 0)
    const avgSpeed = speeds.length > 0
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length
      : null

    // Rough direction: heading 0-180 = eastbound, 180-360 = westbound
    const eastbound = uniquePositions.filter(v =>
      v.heading !== null && v.heading >= 0 && v.heading < 180
    ).length
    const westbound = uniquePositions.filter(v =>
      v.heading !== null && v.heading >= 180 && v.heading < 360
    ).length

    await upsertTrafficSummary({
      period_type: 'hourly',
      period_start: periodStart.toISOString(),
      zone: 'hormuz',
      total_vessels: uniquePositions.length,
      tanker_count: tankerCount,
      lng_carrier_count: lngCount,
      container_count: containerCount,
      other_count: otherCount,
      transiting_count: transitingCount,
      stopped_count: stoppedCount,
      u_turn_count: uTurnCount,
      dark_vessel_count: darkCount,
      eastbound_count: eastbound,
      westbound_count: westbound,
      avg_speed_knots: avgSpeed ? Math.round(avgSpeed * 10) / 10 : null,
      estimated_crude_barrels: tankerCount * 2_000_000, // ~2M bbl per VLCC
      estimated_lng_tonnes: lngCount * 70_000,
      traffic_change_pct: null,
      anomaly_flag: uTurnCount >= 3 || stoppedCount > uniquePositions.length * 0.3,
      anomaly_description:
        uTurnCount >= 3
          ? `${uTurnCount} vessel u-turns detected`
          : stoppedCount > uniquePositions.length * 0.3
            ? `${stoppedCount} vessels stopped (${Math.round((stoppedCount / uniquePositions.length) * 100)}%)`
            : null,
    })

    return NextResponse.json({
      success: upsertSuccess || uniquePositions.length === 0,
      message: `AIS ingest complete: ${uniquePositions.length} vessels, ${uTurnCount} u-turns`,
      count: uniquePositions.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AIS ingest failed'
    console.error('ingest-ais error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
