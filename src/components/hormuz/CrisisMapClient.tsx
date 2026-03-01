'use client'

import { useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Marker, Polygon, Popup, useMap } from 'react-leaflet'
import { useLocale } from '@/hooks/useLocale'
import { KEY_LOCATIONS, SECURITY_ZONES, EVENT_ICONS, VESSEL_ICONS } from '@/data/hormuz/scenarios'
import type { VesselPosition, MapEvent, MapLayerConfig } from '@/types/hormuz'

// Fix Leaflet default icon issue in webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
})

// --- Dark tile URL ---
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'

// --- Helpers ---
function getVesselColor(vessel: VesselPosition): string {
  if (vessel.status === 'u_turn') return VESSEL_ICONS.tanker_u_turn.color
  if (vessel.status === 'stopped') return VESSEL_ICONS.tanker_stopped.color
  if (vessel.vessel_type === 'lng_carrier') return VESSEL_ICONS.lng_carrier.color
  if (vessel.status === 'dark') return VESSEL_ICONS.dark_vessel.color
  if (vessel.vessel_type === 'military') return VESSEL_ICONS.military.color
  if (vessel.vessel_type === 'tanker' && vessel.status === 'transiting') return VESSEL_ICONS.tanker_transiting.color
  if (vessel.vessel_type === 'container') return VESSEL_ICONS.container.color
  return VESSEL_ICONS.other.color
}

function getVesselRadius(vessel: VesselPosition): number {
  if (vessel.vessel_type === 'tanker' || vessel.vessel_type === 'lng_carrier') return 6
  return 4
}

function getSeverityColor(severity: string | null): string {
  switch (severity) {
    case 'critical': return '#ef4444'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#94a3b8'
  }
}

function createEventIcon(eventType: string): L.DivIcon {
  const eventMeta = EVENT_ICONS[eventType]
  const emoji = eventMeta?.icon ?? '📍'
  return L.divIcon({
    html: `<span style="font-size:20px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.8))">${emoji}</span>`,
    className: 'crisis-map-event-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function createLocationIcon(icon: string): L.DivIcon {
  return L.divIcon({
    html: `<span style="font-size:16px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.8))">${icon}</span>`,
    className: 'crisis-map-location-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString('en-GB', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      hour12: false,
    })
  } catch {
    return ts
  }
}

// --- Map auto-fit component ---
function MapBoundsUpdater({ vessels }: { readonly vessels: VesselPosition[] }) {
  const map = useMap()
  useMemo(() => {
    if (vessels.length > 0) {
      const bounds = L.latLngBounds(vessels.map(v => [v.latitude, v.longitude]))
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.3), { maxZoom: 8, animate: true })
      }
    }
  }, [vessels.length > 0]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

// --- Zone configs ---
const ZONE_STYLES: Record<string, { color: string; fillOpacity: number }> = {
  hormuz_strait: { color: '#ef4444', fillOpacity: 0.08 },
  persian_gulf: { color: '#f97316', fillOpacity: 0.04 },
  gulf_of_oman: { color: '#eab308', fillOpacity: 0.04 },
}

// ============================================================================
// Main Component
// ============================================================================

interface CrisisMapClientProps {
  readonly vessels: VesselPosition[]
  readonly events: MapEvent[]
  readonly layers: MapLayerConfig
}

export default function CrisisMapClient({ vessels, events, layers }: CrisisMapClientProps) {
  const { locale } = useLocale()
  const isKo = locale === 'ko'

  const eventIcons = useMemo(() => {
    const map = new Map<string, L.DivIcon>()
    for (const evt of events) {
      if (!map.has(evt.event_type)) {
        map.set(evt.event_type, createEventIcon(evt.event_type))
      }
    }
    return map
  }, [events])

  const locationIcons = useMemo(() => {
    const map = new Map<string, L.DivIcon>()
    for (const loc of KEY_LOCATIONS) {
      if (!map.has(loc.icon)) {
        map.set(loc.icon, createLocationIcon(loc.icon))
      }
    }
    return map
  }, [])

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] rounded-lg overflow-hidden border border-[#1a1b23]">
      {/* Custom CSS for DivIcon cleanup */}
      <style>{`
        .crisis-map-event-icon,
        .crisis-map-location-icon {
          background: transparent !important;
          border: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .leaflet-popup-content-wrapper {
          background: #12131a !important;
          color: #e2e2e8 !important;
          border: 1px solid #2a2b35 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
        }
        .leaflet-popup-tip {
          background: #12131a !important;
          border: 1px solid #2a2b35 !important;
        }
        .leaflet-popup-close-button {
          color: #888 !important;
        }
        .leaflet-popup-close-button:hover {
          color: #c8a44e !important;
        }
        .leaflet-control-zoom a {
          background: #12131a !important;
          color: #e2e2e8 !important;
          border-color: #2a2b35 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1b23 !important;
          color: #c8a44e !important;
        }
        .leaflet-control-attribution {
          background: rgba(8,9,13,0.8) !important;
          color: #555 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #666 !important;
        }
      `}</style>

      <MapContainer
        center={[26.0, 54.0]}
        zoom={6}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer url={DARK_TILE_URL} attribution={TILE_ATTRIBUTION} />

        {/* Auto-fit bounds on first load */}
        {vessels.length === 0 && <MapBoundsUpdater vessels={vessels} />}

        {/* === Security Zones Layer === */}
        {layers.securityZones && (
          <>
            {Object.entries(SECURITY_ZONES).map(([key, zone]) => {
              const style = ZONE_STYLES[key] ?? { color: '#94a3b8', fillOpacity: 0.04 }
              return (
                <Polygon
                  key={key}
                  positions={zone.coords}
                  pathOptions={{
                    color: style.color,
                    weight: 1.5,
                    dashArray: '6 4',
                    fillColor: style.color,
                    fillOpacity: style.fillOpacity,
                  }}
                >
                  <Popup>
                    <div className="text-xs">
                      <div className="font-bold text-sm" style={{ color: style.color }}>
                        {isKo ? zone.nameKo : zone.name}
                      </div>
                      <div className="text-gray-400 mt-1">
                        {isKo ? '보안 구역' : 'Security Zone'}
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              )
            })}
          </>
        )}

        {/* === Vessel Layer === */}
        {layers.vessels && vessels.map((vessel) => (
          <CircleMarker
            key={vessel.id}
            center={[vessel.latitude, vessel.longitude]}
            radius={getVesselRadius(vessel)}
            pathOptions={{
              color: getVesselColor(vessel),
              fillColor: getVesselColor(vessel),
              fillOpacity: 0.8,
              weight: 1.5,
            }}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-[180px]">
                <div className="font-bold text-sm text-[#c8a44e]">
                  {vessel.vessel_name ?? 'Unknown Vessel'}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-300">
                  <span className="text-gray-500">MMSI</span>
                  <span>{vessel.mmsi}</span>
                  {vessel.vessel_type && (
                    <>
                      <span className="text-gray-500">{isKo ? '유형' : 'Type'}</span>
                      <span className="capitalize">{vessel.vessel_type.replace('_', ' ')}</span>
                    </>
                  )}
                  {vessel.status && (
                    <>
                      <span className="text-gray-500">{isKo ? '상태' : 'Status'}</span>
                      <span
                        className="font-medium capitalize"
                        style={{ color: getVesselColor(vessel) }}
                      >
                        {vessel.status.replace('_', ' ')}
                      </span>
                    </>
                  )}
                  {vessel.speed_knots != null && (
                    <>
                      <span className="text-gray-500">{isKo ? '속도' : 'Speed'}</span>
                      <span>{vessel.speed_knots.toFixed(1)} kn</span>
                    </>
                  )}
                  {vessel.heading != null && (
                    <>
                      <span className="text-gray-500">{isKo ? '방향' : 'Heading'}</span>
                      <span>{vessel.heading}°</span>
                    </>
                  )}
                  {vessel.destination && (
                    <>
                      <span className="text-gray-500">{isKo ? '목적지' : 'Dest'}</span>
                      <span className="truncate">{vessel.destination}</span>
                    </>
                  )}
                </div>
                <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-700">
                  {formatTimestamp(vessel.timestamp)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* === War Events Layer === */}
        {layers.warEvents && events.map((evt) => {
          const icon = eventIcons.get(evt.event_type) ?? createEventIcon(evt.event_type)
          const eventMeta = EVENT_ICONS[evt.event_type]
          return (
            <Marker
              key={evt.id}
              position={[evt.latitude, evt.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="text-xs space-y-1.5 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{eventMeta?.icon ?? '📍'}</span>
                    <div>
                      <div className="font-bold text-sm text-[#e2e2e8]">{evt.title}</div>
                      <div className="text-[10px] text-gray-500">
                        {isKo ? eventMeta?.labelKo : eventMeta?.labelEn}
                      </div>
                    </div>
                  </div>
                  {evt.description && (
                    <p className="text-gray-300 leading-relaxed">{evt.description}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    {evt.severity && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${getSeverityColor(evt.severity)}20`,
                          color: getSeverityColor(evt.severity),
                        }}
                      >
                        {evt.severity}
                      </span>
                    )}
                    {evt.is_verified && (
                      <span className="text-[10px] text-emerald-400">✓ {isKo ? '확인됨' : 'Verified'}</span>
                    )}
                  </div>
                  {evt.source_name && (
                    <div className="text-[10px] text-gray-500">
                      {isKo ? '출처' : 'Source'}: {evt.source_name}
                    </div>
                  )}
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-700">
                    {formatTimestamp(evt.event_date)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* === Infrastructure Layer === */}
        {layers.infrastructure && KEY_LOCATIONS.map((loc) => {
          const icon = locationIcons.get(loc.icon) ?? createLocationIcon(loc.icon)
          return (
            <Marker
              key={`${loc.name}-${loc.lat}-${loc.lon}`}
              position={[loc.lat, loc.lon]}
              icon={icon}
            >
              <Popup>
                <div className="text-xs space-y-1 min-w-[160px]">
                  <div className="font-bold text-sm text-[#c8a44e]">
                    {isKo ? loc.nameKo : loc.name}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-300">
                    <span className="text-gray-500">{isKo ? '유형' : 'Type'}</span>
                    <span className="capitalize">{loc.type.replace(/_/g, ' ')}</span>
                    {loc.country && (
                      <>
                        <span className="text-gray-500">{isKo ? '국가' : 'Country'}</span>
                        <span>{loc.country}</span>
                      </>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
