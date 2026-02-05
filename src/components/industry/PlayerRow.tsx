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
}

const DEFAULT_CHAIN_STYLE = 'bg-gold/10 text-gold border-gold/20'

function getValueChainStyle(position: string | undefined): string {
  if (!position) return DEFAULT_CHAIN_STYLE
  for (const [key, style] of Object.entries(VALUE_CHAIN_COLORS)) {
    if (position.includes(key)) return style
  }
  return DEFAULT_CHAIN_STYLE
}

export function PlayerRow({ player }: PlayerRowProps) {
  const displayRevenue = player.revenueUsd ?? player.revenue
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2 py-2.5 border-b border-brd/30 text-xs last:border-b-0">
      <div className="min-w-0">
        <span className="font-semibold text-t1 block truncate">{player.name}</span>
        {player.owner && <span className="text-[10px] text-t3 block truncate">{player.owner}</span>}
      </div>

      {player.valueChainPosition ? (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap ${getValueChainStyle(player.valueChainPosition)}`}>
          {player.valueChainPosition}
        </span>
      ) : (
        <span />
      )}

      {player.marketCapUsd ? (
        <span className="font-mono text-[10px] text-t2 whitespace-nowrap text-right">
          {player.marketCapUsd}
        </span>
      ) : (
        <span />
      )}

      {displayRevenue ? (
        <span className="font-mono text-[11px] text-accent-green whitespace-nowrap text-right">
          {displayRevenue}
        </span>
      ) : (
        <span />
      )}

      {player.note ? (
        <span className="text-[10px] text-t3 text-right truncate">
          {player.note}
        </span>
      ) : (
        <span />
      )}
    </div>
  )
}
