import type { Player } from '@/types/sector'

interface PlayerRowProps {
  readonly player: Player
}

const VALUE_CHAIN_COLORS: Record<string, string> = {
  'Upstream': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  'DC': 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  'AI': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
  '규제': 'bg-accent-red/15 text-accent-red border-accent-red/20',
  '거래소': 'bg-accent-green/15 text-accent-green border-accent-green/20',
  '디벨로퍼': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  '유틸리티': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  '병원': 'bg-accent-green/15 text-accent-green border-accent-green/20',
  '리테일': 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  '유통': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  '방위': 'bg-accent-red/15 text-accent-red border-accent-red/20',
  '플랫폼': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
  '투자': 'bg-gold/10 text-gold border-gold/20',
  '인프라': 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  '서비스': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  '클라우드': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
  '브랜드': 'bg-accent-green/15 text-accent-green border-accent-green/20',
  '네트워크': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  '이커머스': 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  '콘텐츠': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  '테마파크': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  '스테이블': 'bg-gold/10 text-gold border-gold/20',
  '채굴': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  '저탄소': 'bg-accent-green/15 text-accent-green border-accent-green/20',
  '재생': 'bg-accent-green/15 text-accent-green border-accent-green/20',
  '원자력': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
  '위성': 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  '우주': 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  'R&D': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
}

const DEFAULT_CHAIN_STYLE = 'bg-gold/10 text-gold border-gold/20'

function getValueChainStyle(position: string | undefined): string {
  if (!position) return DEFAULT_CHAIN_STYLE
  for (const [key, style] of Object.entries(VALUE_CHAIN_COLORS)) {
    if (position.includes(key)) return style
  }
  return DEFAULT_CHAIN_STYLE
}

function buildKeyFacts(player: Player): string {
  const facts: string[] = []

  const displayRevenue = player.revenueUsd ?? player.revenue
  if (displayRevenue) {
    facts.push(displayRevenue)
  }

  if (player.note) {
    facts.push(player.note)
  }

  return facts.join(' · ')
}

export function PlayerRow({ player }: PlayerRowProps) {
  const keyFacts = buildKeyFacts(player)

  return (
    <div className="grid grid-cols-[minmax(100px,140px)_minmax(70px,100px)_1fr] items-start gap-3 py-2.5 border-b border-brd/30 text-xs last:border-b-0">
      {/* Company */}
      <div className="min-w-0">
        <span className="font-semibold text-t1 block truncate">{player.name}</span>
        {player.owner && <span className="text-[10px] text-t3 block truncate">{player.owner}</span>}
      </div>

      {/* Position */}
      {player.valueChainPosition ? (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap w-fit ${getValueChainStyle(player.valueChainPosition)}`}>
          {player.valueChainPosition}
        </span>
      ) : (
        <span />
      )}

      {/* Key Facts */}
      {keyFacts ? (
        <span className="text-[11px] text-t2 leading-relaxed">
          {keyFacts}
        </span>
      ) : (
        <span />
      )}
    </div>
  )
}
