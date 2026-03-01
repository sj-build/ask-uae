'use client'

import { useState, useCallback } from 'react'

// ============================================================================
// Types
// ============================================================================

type FactionKey = 'attacker' | 'iran' | 'struck' | 'mediator' | 'indirect'

interface FactionInfo {
  color: string
  label: string
  glow: string
}

interface Country {
  id: string
  name: string
  faction: FactionKey
  x: number
  y: number
  note: string
  flag: string
  large?: boolean
}

interface Strike {
  from: string
  to: string
  label: string
}

interface StrikeCity {
  name: string
  x: number
  y: number
  detail: string
}

// ============================================================================
// Data
// ============================================================================

const FACTIONS: Record<FactionKey, FactionInfo> = {
  attacker: { color: '#2563eb', label: '공격 주도 (미국·이스라엘)', glow: '#3b82f6' },
  iran: { color: '#dc2626', label: '이란 + 저항의 축', glow: '#ef4444' },
  struck: { color: '#f59e0b', label: '전쟁 반대했으나 피격', glow: '#fbbf24' },
  mediator: { color: '#8b5cf6', label: '중재·전쟁 반대', glow: '#a78bfa' },
  indirect: { color: '#64748b', label: '간접 지원/관망', glow: '#94a3b8' },
}

const COUNTRIES: Country[] = [
  { id: 'us', name: '미국', faction: 'attacker', x: 80, y: 52, note: '합동작전 수행, 항모 2척 전개', flag: '🇺🇸' },
  { id: 'israel', name: '이스라엘', faction: 'attacker', x: 258, y: 268, note: 'Operation Shield of Judah 개시', flag: '🇮🇱' },
  { id: 'iran', name: '이란', faction: 'iran', x: 450, y: 220, note: '테헤란·이스파한·쿰 등 피격, 즉각 반격', flag: '🇮🇷', large: true },
  { id: 'uae', name: 'UAE', faction: 'struck', x: 420, y: 345, note: '아부다비·두바이 폭발, 1명 사망, 영공 폐쇄', flag: '🇦🇪' },
  { id: 'qatar', name: '카타르', faction: 'struck', x: 395, y: 325, note: '알우데이드 기지 타격, 미사일 요격', flag: '🇶🇦' },
  { id: 'bahrain', name: '바레인', faction: 'struck', x: 390, y: 310, note: '미 5함대 본부 피격', flag: '🇧🇭' },
  { id: 'kuwait', name: '쿠웨이트', faction: 'struck', x: 370, y: 275, note: '알살렘 기지 타격', flag: '🇰🇼' },
  { id: 'saudi', name: '사우디', faction: 'mediator', x: 330, y: 330, note: '영공 사용 거부, 리야드 폭발 보도', flag: '🇸🇦', large: true },
  { id: 'oman', name: '오만', faction: 'mediator', x: 445, y: 345, note: '중재 채널, 간접 대화 주선', flag: '🇴🇲' },
  { id: 'turkey', name: '튀르키예', faction: 'mediator', x: 280, y: 175, note: '중재 시도, 영공 사용 거부', flag: '🇹🇷' },
  { id: 'egypt', name: '이집트', faction: 'mediator', x: 230, y: 295, note: '외교적 해법 촉구', flag: '🇪🇬' },
  { id: 'iraq', name: '이라크', faction: 'iran', x: 350, y: 235, note: '이라크 영공 폐쇄, 시아민병대 동향 주시', flag: '🇮🇶' },
  { id: 'jordan', name: '요르단', faction: 'mediator', x: 290, y: 260, note: '탄도미사일 2발 요격', flag: '🇯🇴' },
  { id: 'lebanon', name: '레바논', faction: 'iran', x: 270, y: 240, note: '헤즈볼라 약화, 폭발음 청취', flag: '🇱🇧' },
  { id: 'yemen', name: '예멘 (후티)', faction: 'iran', x: 310, y: 410, note: '후티, 동향 주시 중', flag: '🇾🇪' },
  { id: 'china', name: '중국', faction: 'indirect', x: 590, y: 145, note: '이란에 드론 제공, 탄도미사일 판매 논의', flag: '🇨🇳' },
  { id: 'uk', name: '영국', faction: 'indirect', x: 160, y: 100, note: '기지 사용 거부 (페어포드, 디에고가르시아)', flag: '🇬🇧' },
  { id: 'russia', name: '러시아', faction: 'indirect', x: 420, y: 90, note: '외교적 지원, 직접 개입 안 함', flag: '🇷🇺' },
]

const STRIKES_US_ISRAEL: Strike[] = [
  { from: 'israel', to: 'iran', label: '선제공격' },
]

const STRIKES_IRAN: Strike[] = [
  { from: 'iran', to: 'israel', label: '탄도미사일 반격' },
  { from: 'iran', to: 'uae', label: '알다프라 기지' },
  { from: 'iran', to: 'qatar', label: '알우데이드 기지' },
  { from: 'iran', to: 'bahrain', label: '5함대 본부' },
  { from: 'iran', to: 'kuwait', label: '알살렘 기지' },
]

const IRAN_STRIKE_CITIES: StrikeCity[] = [
  { name: '테헤란', x: 452, y: 205, detail: '하메네이 관저, IRGC 본부' },
  { name: '이스파한', x: 438, y: 240, detail: '핵시설' },
  { name: '쿰', x: 443, y: 222, detail: '군사시설' },
  { name: '카라즈', x: 445, y: 210, detail: '군사시설' },
  { name: '케르만샤', x: 405, y: 225, detail: '군사시설' },
]

// ============================================================================
// Sub-components
// ============================================================================

function PulsingDot({
  cx, cy, color, size = 4, delay = 0,
}: {
  readonly cx: number
  readonly cy: number
  readonly color: string
  readonly size?: number
  readonly delay?: number
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={size} fill={color} opacity={0.9}>
        <animate attributeName="r" values={`${size};${size + 6};${size}`} dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={size * 0.6} fill={color} />
    </g>
  )
}

function StrikeLine({
  x1, y1, x2, y2, color, delay = 0,
}: {
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
  readonly color: string
  readonly delay?: number
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} opacity={0.15} strokeDasharray="4 4" />
      <circle r={3} fill={color} opacity={0.85}>
        <animateMotion
          path={`M${x1},${y1} L${x2},${y2}`}
          dur={`${1.5 + len / 300}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </circle>
      <circle r={6} fill={color} opacity={0.25}>
        <animateMotion
          path={`M${x1},${y1} L${x2},${y2}`}
          dur={`${1.5 + len / 300}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  )
}

function ExplosionIcon({
  cx, cy, delay = 0,
}: {
  readonly cx: number
  readonly cy: number
  readonly delay?: number
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={2} fill="#ff4444" opacity={0}>
        <animate attributeName="r" values="2;12;2" dur="1.5s" begin={`${delay}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" begin={`${delay}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={1} fill="#ffaa00" opacity={0}>
        <animate attributeName="r" values="1;8;1" dur="1.5s" begin={`${delay + 0.2}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="1.5s" begin={`${delay + 0.2}s`} repeatCount="indefinite" />
      </circle>
    </g>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function MiddleEastConflictMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [showStrikes, setShowStrikes] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')

  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  const getCountryPos = useCallback((id: string): { x: number; y: number } => {
    const c = COUNTRIES.find((country) => country.id === id)
    return c ? { x: c.x, y: c.y } : { x: 0, y: 0 }
  }, [])

  const filteredCountries = activeTab === 'all' ? COUNTRIES : COUNTRIES.filter((c) => c.faction === activeTab)
  const selected = selectedCountry ? COUNTRIES.find((c) => c.id === selectedCountry) ?? null : null

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0e1a',
        fontFamily: "'Noto Sans KR', 'SF Pro Display', -apple-system, sans-serif",
        color: '#e2e8f0',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;600&display=swap');
        .faction-btn {
          padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); color: #94a3b8; cursor: pointer;
          font-size: 11px; font-family: 'Noto Sans KR', sans-serif; transition: all 0.2s;
          white-space: nowrap;
        }
        .faction-btn:hover { background: rgba(255,255,255,0.1); }
        .faction-btn.active { background: rgba(255,255,255,0.15); color: #f1f5f9; border-color: rgba(255,255,255,0.3); }
        .country-dot { cursor: pointer; transition: transform 0.2s; }
        .country-dot:hover { transform: scale(1.3); }
        .glow { filter: url(#glow); }
        .info-card {
          background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9));
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          padding: 16px; backdrop-filter: blur(20px);
        }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes conflict-pulse { from { opacity: 1; } to { opacity: 0.4; } }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                animation: 'conflict-pulse 1s infinite alternate',
              }}
            />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: '#ef4444', letterSpacing: 2 }}>
              LIVE
            </span>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              중동 분쟁 현황 — {dateStr}
            </h2>
          </div>
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 3, fontFamily: "'JetBrains Mono'" }}>
            US-Israel strikes on Iran · Iranian retaliation across Gulf
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`faction-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            전체
          </button>
          {(Object.entries(FACTIONS) as [FactionKey, FactionInfo][]).map(([key, val]) => (
            <button
              key={key}
              className={`faction-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
              style={activeTab === key ? { borderColor: val.color, color: val.color } : {}}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: val.color,
                  marginRight: 6,
                }}
              />
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100% - 65px)' }}>
        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="30 50 620 430" style={{ width: '100%', height: '100%' }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="bg-grad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#0a0e1a" />
              </radialGradient>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="30" y="50" width="620" height="430" fill="url(#bg-grad)" />
            <rect x="30" y="50" width="620" height="430" fill="url(#grid)" />

            {/* Region outlines */}
            {/* Mediterranean */}
            <path
              d="M180,180 Q200,200 220,210 Q240,230 255,260 L245,265 Q230,240 210,220 Q195,205 175,190Z"
              fill="rgba(59,130,246,0.05)"
              stroke="rgba(59,130,246,0.1)"
              strokeWidth="0.5"
            />
            {/* Persian Gulf */}
            <path
              d="M360,280 Q380,290 395,305 Q400,315 410,330 Q420,340 430,345 L425,352 Q415,348 405,338 Q395,322 388,312 Q375,298 355,288Z"
              fill="rgba(59,130,246,0.08)"
              stroke="rgba(59,130,246,0.12)"
              strokeWidth="0.5"
            />
            {/* Red Sea */}
            <path
              d="M265,290 Q270,320 280,350 Q290,380 300,400 L294,404 Q284,384 274,354 Q264,324 260,295Z"
              fill="rgba(59,130,246,0.05)"
              stroke="rgba(59,130,246,0.1)"
              strokeWidth="0.5"
            />

            {/* Water body labels */}
            <text x="430" y="338" fill="rgba(147,197,253,0.3)" fontSize="6" fontFamily="JetBrains Mono" transform="rotate(-30, 430, 338)">
              호르무즈 해협
            </text>
            <text x="200" y="230" fill="rgba(147,197,253,0.2)" fontSize="6" fontFamily="JetBrains Mono">
              지중해
            </text>
            <text x="380" y="305" fill="rgba(147,197,253,0.2)" fontSize="6" fontFamily="JetBrains Mono">
              페르시아만
            </text>

            {/* Strike lines */}
            {showStrikes && (
              <g>
                {STRIKES_US_ISRAEL.map((s, i) => {
                  const from = getCountryPos(s.from)
                  const to = getCountryPos(s.to)
                  return <StrikeLine key={`us-${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} color="#3b82f6" delay={i * 0.5} />
                })}
                {STRIKES_IRAN.map((s, i) => {
                  const from = getCountryPos(s.from)
                  const to = getCountryPos(s.to)
                  return <StrikeLine key={`ir-${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} color="#ef4444" delay={i * 0.4 + 0.2} />
                })}
              </g>
            )}

            {/* Iran strike cities */}
            {(activeTab === 'all' || activeTab === 'iran') &&
              IRAN_STRIKE_CITIES.map((city, i) => (
                <g key={city.name}>
                  <ExplosionIcon cx={city.x} cy={city.y} delay={i * 0.6} />
                  <text x={city.x + 8} y={city.y + 3} fill="#fca5a5" fontSize="6" fontFamily="Noto Sans KR" fontWeight="500">
                    {city.name}
                  </text>
                </g>
              ))}

            {/* Country dots */}
            {filteredCountries.map((c) => {
              const faction = FACTIONS[c.faction]
              const isSelected = selectedCountry === c.id
              const dotSize = c.large ? 6 : 4
              return (
                <g key={c.id} className="country-dot" onClick={() => setSelectedCountry(isSelected ? null : c.id)}>
                  {isSelected && (
                    <circle cx={c.x} cy={c.y} r={dotSize + 10} fill="none" stroke={faction.color} strokeWidth="1" opacity="0.4">
                      <animate attributeName="r" values={`${dotSize + 8};${dotSize + 14};${dotSize + 8}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <PulsingDot cx={c.x} cy={c.y} color={faction.color} size={dotSize} delay={Math.random() * 2} />
                  <text
                    x={c.x}
                    y={c.y - dotSize - 5}
                    fill={isSelected ? '#f1f5f9' : '#94a3b8'}
                    fontSize={isSelected ? '9' : '7.5'}
                    fontFamily="Noto Sans KR"
                    fontWeight={isSelected ? '700' : '500'}
                    textAnchor="middle"
                  >
                    {c.flag} {c.name}
                  </text>
                </g>
              )
            })}

            {/* US carrier positions */}
            <g opacity="0.5">
              <text x="415" y="370" fill="#60a5fa" fontSize="5.5" fontFamily="JetBrains Mono">⚓ USS Abraham Lincoln</text>
              <text x="220" y="255" fill="#60a5fa" fontSize="5.5" fontFamily="JetBrains Mono">⚓ USS Gerald R. Ford</text>
            </g>
          </svg>

          {/* Toggle */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowStrikes(!showStrikes)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: showStrikes ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                color: showStrikes ? '#fca5a5' : '#64748b',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: "'Noto Sans KR'",
              }}
            >
              {showStrikes ? '🚀 미사일 경로 ON' : '🚀 미사일 경로 OFF'}
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div
          className="hidden lg:block"
          style={{
            width: 300,
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            padding: 14,
            overflowY: 'auto',
            background: 'rgba(15,23,42,0.5)',
          }}
        >
          {selected ? (
            <div>
              <button
                onClick={() => setSelectedCountry(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: 11,
                  cursor: 'pointer',
                  marginBottom: 12,
                  fontFamily: "'Noto Sans KR'",
                }}
              >
                ← 전체 보기
              </button>
              <div className="info-card" style={{ borderLeft: `3px solid ${FACTIONS[selected.faction].color}` }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{selected.flag}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selected.name}</h3>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${FACTIONS[selected.faction].color}22`,
                    color: FACTIONS[selected.faction].color,
                    fontSize: 10,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  {FACTIONS[selected.faction].label}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#cbd5e1' }}>{selected.note}</p>
              </div>

              {/* Relevant strikes */}
              {(() => {
                const relatedStrikes = [
                  ...STRIKES_US_ISRAEL.map((s) => ({ ...s, strikeType: 'us' as const })),
                  ...STRIKES_IRAN.map((s) => ({ ...s, strikeType: 'iran' as const })),
                ].filter((s) => s.from === selected.id || s.to === selected.id)

                if (relatedStrikes.length === 0) return null

                return (
                  <div style={{ marginTop: 16 }}>
                    <h4
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: 8,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      관련 공격
                    </h4>
                    {relatedStrikes.map((s, i) => {
                      const from = COUNTRIES.find((c) => c.id === s.from)
                      const to = COUNTRIES.find((c) => c.id === s.to)
                      return (
                        <div
                          key={i}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            marginBottom: 6,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ color: s.strikeType === 'us' ? '#3b82f6' : '#ef4444' }}>
                            {s.strikeType === 'us' ? '🔵' : '🔴'}
                          </span>{' '}
                          {from?.flag} {from?.name} → {to?.flag} {to?.name}
                          <span style={{ color: '#64748b', marginLeft: 6 }}>({s.label})</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#f1f5f9' }}>📋 진영별 현황</h3>

              {(Object.entries(FACTIONS) as [FactionKey, FactionInfo][]).map(([key, faction]) => {
                const members = COUNTRIES.filter((c) => c.faction === key)
                return (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: faction.color,
                          boxShadow: `0 0 6px ${faction.color}`,
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: faction.color }}>{faction.label}</span>
                    </div>
                    {members.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedCountry(m.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          marginBottom: 4,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                          e.currentTarget.style.borderColor = `${faction.color}44`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 500 }}>
                          {m.flag} {m.name}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{m.note}</div>
                      </div>
                    ))}
                  </div>
                )
              })}

              {/* Key stat */}
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(59,130,246,0.1))',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>⚡ 핵심 포인트</div>
                <div style={{ fontSize: 11, lineHeight: 1.7, color: '#cbd5e1' }}>
                  걸프 국가들은 <span style={{ color: '#fbbf24' }}>전쟁을 반대</span>하며 기지·영공 사용을 거부했으나, 이란의 직접
                  미사일 공격으로 <span style={{ color: '#ef4444' }}>피해를 입었음</span>. 중립 유지 전략이 근본적으로 시험받는 상황.
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: 16,
                  borderRadius: 12,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}
              >
                <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 4, fontWeight: 600 }}>🇦🇪 UAE 영향</div>
                <div style={{ fontSize: 11, lineHeight: 1.7, color: '#cbd5e1' }}>
                  아부다비 1명 사망, 사디야트·칼리파시티 등 잔해 낙하. 두바이·아부다비 공항 운항 중단. 영공 부분 폐쇄. UAE는
                  &quot;대응권 유보&quot; 선언.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
