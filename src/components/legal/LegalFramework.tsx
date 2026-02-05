'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { legalLayers as legalLayersKo, legalSystemFeatures as legalSystemFeaturesKo } from '@/data/legal/legal-data'
import { legalLayers as legalLayersEn, legalSystemFeatures as legalSystemFeaturesEn } from '@/data/legal/legal-data.en'
import type { LegalLayer, LegalSystemFeature } from '@/data/legal/legal-data'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function LayerCard({
  layer,
  isActive,
  onSelect,
}: {
  readonly layer: LegalLayer
  readonly isActive: boolean
  readonly onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left transition-all duration-300 ease-out"
    >
      <div
        className={`relative border rounded-xl p-4 transition-all duration-300 ease-out cursor-pointer ${
          isActive
            ? 'border-brd2 bg-bg3 shadow-[0_4px_30px_rgba(0,0,0,0.3),0_0_1px_rgba(200,164,78,0.1)]'
            : 'border-brd bg-bg3/60 hover:border-brd2 hover:bg-bg3/80'
        }`}
        style={{
          boxShadow: isActive ? `inset 0 0 30px ${layer.glowColor}` : undefined,
        }}
      >
        {/* Tier badge */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-bg shrink-0"
            style={{ backgroundColor: layer.color }}
          >
            T{layer.tier}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-t1 truncate">{layer.label}</div>
            <div className="text-xs text-t3">{layer.labelKo}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-t3 leading-relaxed mb-3">
          {layer.description}
        </p>

        {/* Examples */}
        <div className="flex flex-wrap gap-1.5">
          {layer.examples.map((example) => (
            <span
              key={example}
              className="text-[10px] px-2 py-0.5 rounded-full border border-brd bg-bg/60 text-t3"
            >
              {example}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

function HierarchyDiagram({ activeLayer, legalLayers }: { readonly activeLayer: number; readonly legalLayers: readonly LegalLayer[] }) {
  return (
    <div className="relative flex flex-col items-center gap-2 py-4">
      {legalLayers.map((layer, index) => {
        const isActive = activeLayer === index
        const widthPercent = 55 + index * 15

        return (
          <div key={layer.tier} className="w-full flex flex-col items-center">
            {/* Connector line */}
            {index > 0 && (
              <div className="w-px h-3 bg-gradient-to-b from-transparent via-t4/40 to-transparent mb-1" />
            )}

            {/* Layer bar */}
            <div
              className={`relative rounded-lg py-2.5 px-4 text-center transition-all duration-300 border ${
                isActive
                  ? 'border-brd2 shadow-lg'
                  : 'border-brd/60'
              }`}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: isActive
                  ? `${layer.color}18`
                  : 'rgba(21, 24, 34, 0.6)',
                borderColor: isActive ? `${layer.color}50` : undefined,
                boxShadow: isActive
                  ? `0 0 20px ${layer.glowColor}, inset 0 0 20px ${layer.glowColor}`
                  : undefined,
              }}
            >
              <div
                className="text-[11px] font-bold tracking-wide"
                style={{ color: isActive ? layer.color : '#6b7280' }}
              >
                Tier {layer.tier}
              </div>
              <div
                className={`text-xs mt-0.5 transition-colors duration-300 ${
                  isActive ? 'text-t1' : 'text-t3'
                }`}
              >
                {layer.labelKo}
              </div>
            </div>
          </div>
        )
      })}

      {/* Arrow indicator */}
      <div className="mt-2 text-[10px] text-t4 flex items-center gap-1.5">
        <span className="inline-block w-6 h-px bg-t4/50" />
        <span>Top-down hierarchy</span>
        <span className="inline-block w-6 h-px bg-t4/50" />
      </div>
    </div>
  )
}

function FeatureCard({ feature }: { readonly feature: LegalSystemFeature }) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">{feature.icon}</span>
          <div>
            <div className="text-sm font-semibold text-t1 mb-1">{feature.title}</div>
            <p className="text-xs text-t3 leading-relaxed">{feature.description}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function LegalFramework() {
  const [activeLayer, setActiveLayer] = useState(0)
  const legalLayers = useLocalizedData(legalLayersKo, legalLayersEn)
  const legalSystemFeatures = useLocalizedData(legalSystemFeaturesKo, legalSystemFeaturesEn)

  return (
    <div className="space-y-6 mb-8">
      {/* Hierarchy diagram + detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visual hierarchy */}
        <Card>
          <div className="p-5">
            <div className="text-xs text-t3 uppercase tracking-wider mb-3 font-medium">
              Legal System Hierarchy
            </div>
            <HierarchyDiagram activeLayer={activeLayer} legalLayers={legalLayers} />
          </div>
        </Card>

        {/* Right: Layer detail cards */}
        <div className="space-y-3">
          {legalLayers.map((layer, index) => (
            <LayerCard
              key={layer.tier}
              layer={layer}
              isActive={activeLayer === index}
              onSelect={() => setActiveLayer(index)}
            />
          ))}
        </div>
      </div>

      {/* System features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {legalSystemFeatures.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  )
}
