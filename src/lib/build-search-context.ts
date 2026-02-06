import { bilateralRelations, bilateralInsight } from '@/data/overview/bilateral'
import { initiatives } from '@/data/overview/initiatives'
import { comparisonStats } from '@/data/overview/comparison-stats'
import { governanceConcepts } from '@/data/overview/governance'
import { emirates } from '@/data/overview/emirates'
import { hotIssues } from '@/data/overview/hot-issues'
import { macroRisks } from '@/data/overview/macro-risks'
import { populationGroups } from '@/data/overview/population'
import { tiers } from '@/data/power/tiers'
import { sectors } from '@/data/industry/sectors'
import { connectionTrees } from '@/data/connection/trees'
import {
  kWaveCategories,
  kWaveInsights,
  genZTrends,
  trendDuality,
  dualityInsights,
} from '@/data/society/trends'
import { wastaConcepts, majlisInfo, meetingComparisons } from '@/data/society/business-culture'
import { lawComparisons, visaTypes, goldenVisaInsights } from '@/data/society/essential-knowledge'
import { religionGroups, tolerancePolicies, ramadanInfo } from '@/data/society/religion'
import { demographicStats, nationalityGroups, populationInsights } from '@/data/society/population'

function serializeOverview(): string {
  const statsStr = comparisonStats.map(s => `- ${s.indicator}: UAE ${s.uae} / Korea ${s.korea}`).join('\n')
  const emiratesStr = emirates.map(e => `- ${e.name} (${e.nameAr}): ${e.details.join('; ')}`).join('\n')
  const bilateralStr = bilateralRelations.map(b => `- ${b.category}: ${b.content} (${b.amount}) — ${b.significance}`).join('\n')
  const initiativesStr = initiatives.map(i => `- ${i.title}: ${i.subtitle}`).join('\n')
  const govStr = governanceConcepts.map(g => `- ${g.title}: ${g.description}`).join('\n')
  const popStr = populationGroups.map(p => `- ${p.label}: ${p.count} (${p.percentage}%)`).join('\n')
  const hotStr = hotIssues.map(h => `- ${h.title}\n  Opportunities: ${h.opportunities.join('; ')}\n  Risks: ${h.risks.join('; ')}`).join('\n')
  const riskStr = macroRisks.map(r => `- ${r.title}: ${r.summary}`).join('\n')

  return `## UAE Overview
${statsStr}

## 7 Emirates
${emiratesStr}

## Korea-UAE Bilateral Relations
${bilateralStr}
Insight: ${bilateralInsight}

## Government Key Initiatives (2025-2031)
${initiativesStr}

## Governance Concepts
${govStr}

## Population
${popStr}

## Hot Issues
${hotStr}

## Macro Risks
${riskStr}`
}

function serializePowerStructure(): string {
  return tiers.map(tier => {
    const personsStr = tier.persons.map(p => {
      const detailStr = p.details.join('; ')
      return `  - ${p.name}: ${p.title?.split('\n')[0] ?? ''} | ${p.aum ?? ''} | ${detailStr}`
    }).join('\n')
    return `### Tier ${tier.level}: ${tier.label}
${tier.subtitle}
${personsStr}`
  }).join('\n\n')
}

function serializeIndustry(): string {
  return sectors.map(s => {
    const playersStr = s.players.map(p => {
      const rev = p.revenueUsd ?? p.revenue ?? ''
      const mcap = p.marketCapUsd ?? ''
      const pos = p.valueChainPosition ?? ''
      return `  - ${p.name} (${p.owner ?? 'N/A'}) | Position: ${pos} | MCap: ${mcap} | Rev: ${rev} | ${p.note ?? ''}`
    }).join('\n')
    return `### ${s.icon} ${s.name}
Market: ${s.size} | Growth: ${s.cagr}
${playersStr}
${s.insight ? `Insight: ${s.insight}` : ''}`
  }).join('\n\n')
}

function serializeConnections(): string {
  return connectionTrees.map(t => {
    const linesStr = t.lines.map(line => {
      const text = line.spans.map(s => s.text).join('')
      return `  ${text}`
    }).join('\n')
    return `### ${t.title}
${linesStr}`
  }).join('\n\n')
}

function serializeSociety(): string {
  const kWaveStr = kWaveCategories.map(k => `- ${k.category}: ${k.items.join(', ')} (Challenge: ${k.challenge})`).join('\n')
  const trendsStr = genZTrends.map(t => `- ${t.trend}: ${t.description} (Opportunity: ${t.opportunity})`).join('\n')
  const wastaStr = wastaConcepts.map(w => `- ${w.concept}: ${w.description}`).join('\n')
  const majlisStr = majlisInfo.map(m => `- ${m.label}: ${m.content}`).join('\n')
  const meetingStr = meetingComparisons.map(m => `- ${m.situation}: Korea ${m.korea} / UAE ${m.uae}`).join('\n')
  const lawStr = lawComparisons.map(l => `- ${l.category}: UAE ${l.uaeRule} / Korea ${l.koreaDifference} (Violation: ${l.violation})`).join('\n')
  const visaStr = visaTypes.map(v => `- ${v.name}: ${v.target} (${v.duration}) — ${v.keyCondition}`).join('\n')
  const religionStr = religionGroups.map(r => `- ${r.name}: ${r.percentage}% — ${r.note}`).join('\n')
  const toleranceStr = tolerancePolicies.map(t => `- ${t.name}: ${t.description}`).join('\n')
  const ramadanStr = ramadanInfo.map(r => `- ${r.label}: ${r.content}`).join('\n')
  const demoStr = demographicStats.map(d => `- ${d.label}: ${d.value}`).join('\n')
  const nationalStr = nationalityGroups.map(n => `- ${n.name}: ${n.percentage}% (${n.population})`).join('\n')

  return `## K-Wave in UAE
${kWaveStr}
Insights: ${kWaveInsights.join('; ')}

## Gen Z Trends
${trendsStr}

## Tradition vs Innovation
Tradition: ${trendDuality.tradition.items.join(', ')}
Innovation: ${trendDuality.innovation.items.join(', ')}
Analysis: ${dualityInsights.join('; ')}

## Business Culture — Wasta
${wastaStr}

## Majlis Culture
${majlisStr}

## Meeting Culture (Korea vs UAE)
${meetingStr}

## Law Comparison
${lawStr}

## Visa Types
${visaStr}
Golden Visa: ${goldenVisaInsights.join('; ')}

## Religion
${religionStr}

## Religious Tolerance
${toleranceStr}

## Ramadan
${ramadanStr}

## Demographics
${demoStr}

## Nationality Composition
${nationalStr}
Insights: ${populationInsights.join('; ')}`
}

export function buildSearchContext(): string {
  return `${serializeOverview()}

## Power Structure
${serializePowerStructure()}

## Industry Map
${serializeIndustry()}

## Power Networks
${serializeConnections()}

## Society & Culture
${serializeSociety()}`
}
