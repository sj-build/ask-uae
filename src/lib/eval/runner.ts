/**
 * Eval Runner
 *
 * Orchestrates eval runs by calling snapshot functions directly
 * instead of self-referencing HTTP calls.
 */

import { getSupabaseAdmin } from '@/lib/supabase'
import { loadSiteData, buildKnowledgeSnapshot } from './snapshots'
import { extractClaims, extractClaimsFromObject } from './claim-extractor'
import { getActiveSources, checkRules } from './rules-checker'
import { verifyClaim } from './llm-judge'
import type {
  EvalRun,
  EvalIssue,
  RunType,
  ExtractedClaim,
  VerificationResult,
  EvalRunOptions,
  EvalRunResult,
} from './types'

// ---------------------------------------------------------------------------
// DB Helpers
// ---------------------------------------------------------------------------

async function createEvalRun(runType: RunType, scope: Record<string, unknown>): Promise<string> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('eval_runs')
    .insert({
      run_type: runType,
      scope,
      model: 'claude-sonnet-4',
      status: 'running',
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create eval run: ${error.message}`)
  }

  return data.id
}

async function updateEvalRun(
  runId: string,
  update: Partial<Pick<EvalRun, 'status' | 'finished_at' | 'summary' | 'logs'>>
): Promise<void> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from('eval_runs').update(update).eq('id', runId)

  if (error) {
    throw new Error(`Failed to update eval run: ${error.message}`)
  }
}

async function createEvalIssue(
  issue: Omit<EvalIssue, 'id' | 'created_at' | 'updated_at' | 'approved_at' | 'approved_by'>
): Promise<string> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.from('eval_issues').insert(issue).select('id').single()

  if (error) {
    throw new Error(`Failed to create eval issue: ${error.message}`)
  }

  return data.id
}

// ---------------------------------------------------------------------------
// Daily Rules (pattern-based, no LLM)
// ---------------------------------------------------------------------------

async function runDailyRules(runId: string, scope: Record<string, unknown>): Promise<number> {
  const pages = await loadSiteData()
  const sources = await getActiveSources()

  const logs: string[] = []
  let issueCount = 0

  const claims: ExtractedClaim[] = []
  const pagesArray = scope.pages as string[] | undefined

  for (const [pageName, pageData] of Object.entries(pages)) {
    if (pagesArray && !pagesArray.includes(pageName)) continue

    const pageClaims = extractClaimsFromObject(pageData, pageName)
    claims.push(...pageClaims)
    logs.push(`Extracted ${pageClaims.length} claims from ${pageName}`)
  }

  for (const claim of claims) {
    const { hints, relevantSources } = checkRules(claim, sources)

    if (hints.length > 0) {
      await createEvalIssue({
        run_id: runId,
        object_type: 'page',
        object_id: claim.object_locator.split('.')[0],
        object_locator: claim.object_locator,
        claim: claim.claim,
        claim_type: claim.claim_type,
        status: 'open',
        verdict: 'unverifiable',
        severity: 'low',
        confidence: 0.5,
        current_text: claim.current_text,
        suggested_fix: hints.join('; '),
        suggested_patch: null,
        references: relevantSources.map((s) => ({ url: s.base_url, source: s.name })),
      })
      issueCount++
    }
  }

  await updateEvalRun(runId, { logs: logs.join('\n') })

  return issueCount
}

// ---------------------------------------------------------------------------
// Weekly Factcheck (LLM-based)
// ---------------------------------------------------------------------------

async function runWeeklyFactcheck(runId: string, scope: Record<string, unknown>): Promise<number> {
  const pages = await loadSiteData()
  const { documents, insights } = await buildKnowledgeSnapshot({
    since: scope.since as string | undefined,
    limit: 200,
  })
  const sources = await getActiveSources()

  const logs: string[] = []
  let issueCount = 0
  const summary: Record<string, number> = {
    supported: 0,
    needs_update: 0,
    contradicted: 0,
    unverifiable: 0,
  }

  const priorityPages = ['economy', 'legal', 'politics']
  const claims: Array<{ claim: ExtractedClaim; objectType: 'page' | 'document' | 'insight' }> = []

  for (const pageName of priorityPages) {
    if (!pages[pageName]) continue

    const pageContent = JSON.stringify(pages[pageName])
    const extractedClaims = await extractClaims(pageContent.slice(0, 8000), {
      page: pageName,
      locale: 'ko',
    })

    claims.push(...extractedClaims.map((c) => ({ claim: c, objectType: 'page' as const })))
    logs.push(`Extracted ${extractedClaims.length} LLM claims from ${pageName}`)
  }

  const recentDocs = (documents as Array<{ title: string; content: string; id: string }>).slice(0, 10)
  for (const doc of recentDocs) {
    const docClaims = await extractClaims(`${doc.title}\n${doc.content}`.slice(0, 4000), {
      section: 'documents',
    })
    claims.push(...docClaims.map((c) => ({ claim: c, objectType: 'document' as const })))
  }

  logs.push(`Total claims to verify: ${claims.length}`)

  const claimsToVerify = claims.slice(0, 30)

  for (const { claim, objectType } of claimsToVerify) {
    const { relevantSources } = checkRules(claim, sources)

    const result: VerificationResult = await verifyClaim({
      claim,
      sourceContent: '',
      relevantSources,
    })

    summary[result.verdict] = (summary[result.verdict] || 0) + 1

    if (result.verdict !== 'supported') {
      await createEvalIssue({
        run_id: runId,
        object_type: objectType,
        object_id: claim.object_locator.split('.')[0],
        object_locator: claim.object_locator,
        claim: claim.claim,
        claim_type: claim.claim_type,
        status: 'open',
        verdict: result.verdict,
        severity: result.severity,
        confidence: result.confidence,
        current_text: claim.current_text,
        suggested_fix: result.suggested_fix,
        suggested_patch: result.suggested_patch as Record<string, unknown> | null,
        references: result.references,
      })
      issueCount++
    }
  }

  await updateEvalRun(runId, {
    logs: logs.join('\n'),
    summary: { total_claims: claimsToVerify.length, by_verdict: summary },
  })

  return issueCount
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function runEval(options: EvalRunOptions): Promise<EvalRunResult> {
  const { run_type, scope = {}, dry_run } = options

  if (dry_run) {
    return {
      run_id: 'dry_run',
      status: 'done',
      issues_found: 0,
      summary: {},
    }
  }

  const runId = await createEvalRun(run_type, scope)

  try {
    let issueCount = 0

    if (run_type === 'daily_rules') {
      issueCount = await runDailyRules(runId, scope)
    } else if (run_type === 'weekly_factcheck') {
      issueCount = await runWeeklyFactcheck(runId, scope)
    } else {
      issueCount = await runDailyRules(runId, scope)
      issueCount += await runWeeklyFactcheck(runId, scope)
    }

    await updateEvalRun(runId, {
      status: 'done',
      finished_at: new Date().toISOString(),
    })

    return {
      run_id: runId,
      status: 'done',
      issues_found: issueCount,
      summary: {},
    }
  } catch (evalError) {
    await updateEvalRun(runId, {
      status: 'failed',
      finished_at: new Date().toISOString(),
      logs: evalError instanceof Error ? evalError.message : 'Unknown error',
    })

    throw evalError
  }
}
