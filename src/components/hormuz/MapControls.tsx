'use client'

import { Layers, Ship, Crosshair, Shield, Building2 } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import type { MapLayerConfig } from '@/types/hormuz'

interface MapControlsProps {
  readonly layers: MapLayerConfig
  readonly onToggleLayer: (layer: keyof MapLayerConfig) => void
  readonly isConnected: boolean
  readonly autoRefresh: boolean
  readonly onToggleAutoRefresh: () => void
  readonly vesselCount: number
  readonly eventCount: number
}

const LAYER_CONFIG: {
  key: keyof MapLayerConfig
  labelKo: string
  labelEn: string
  icon: React.ReactNode
  color: string
}[] = [
  {
    key: 'vessels',
    labelKo: '선박',
    labelEn: 'Vessels',
    icon: <Ship className="w-3.5 h-3.5" />,
    color: '#22c55e',
  },
  {
    key: 'warEvents',
    labelKo: '전쟁 이벤트',
    labelEn: 'War Events',
    icon: <Crosshair className="w-3.5 h-3.5" />,
    color: '#ef4444',
  },
  {
    key: 'securityZones',
    labelKo: '보안 구역',
    labelEn: 'Security Zones',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: '#f97316',
  },
  {
    key: 'infrastructure',
    labelKo: '인프라',
    labelEn: 'Infrastructure',
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: '#3b82f6',
  },
]

export function MapControls({
  layers,
  onToggleLayer,
  isConnected,
  autoRefresh,
  onToggleAutoRefresh,
  vesselCount,
  eventCount,
}: MapControlsProps) {
  const { locale } = useLocale()
  const isKo = locale === 'ko'

  return (
    <div className="absolute top-3 right-3 z-[1000] w-[180px]">
      {/* Live status */}
      <div className="bg-[#12131a]/95 backdrop-blur-sm border border-[#2a2b35] rounded-lg p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isConnected ? 'text-emerald-400' : 'text-gray-500'
            }`}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
          <button
            onClick={onToggleAutoRefresh}
            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
              autoRefresh
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-gray-500/15 text-gray-500'
            }`}
          >
            {autoRefresh ? (isKo ? '자동' : 'Auto') : (isKo ? '수동' : 'Manual')}
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{isKo ? '선박' : 'Vessels'}: <span className="text-[#c8a44e] font-medium">{vesselCount}</span></span>
          <span>{isKo ? '이벤트' : 'Events'}: <span className="text-[#c8a44e] font-medium">{eventCount}</span></span>
        </div>
      </div>

      {/* Layer toggles */}
      <div className="bg-[#12131a]/95 backdrop-blur-sm border border-[#2a2b35] rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[#2a2b35]">
          <Layers className="w-3.5 h-3.5 text-[#c8a44e]" />
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            {isKo ? '레이어' : 'Layers'}
          </span>
        </div>
        <div className="space-y-1.5">
          {LAYER_CONFIG.map((layer) => (
            <label
              key={layer.key}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={layers[layer.key]}
                onChange={() => onToggleLayer(layer.key)}
                className="sr-only"
              />
              <div
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                  layers[layer.key]
                    ? 'border-transparent'
                    : 'border-gray-600 bg-transparent'
                }`}
                style={layers[layer.key] ? { backgroundColor: layer.color } : undefined}
              >
                {layers[layer.key] && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className="flex items-center gap-1.5 text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors"
                style={layers[layer.key] ? { color: layer.color } : undefined}
              >
                {layer.icon}
                {isKo ? layer.labelKo : layer.labelEn}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
