'use client'

import { useState, useEffect, useCallback } from 'react'

interface EvalRun {
  id: string
  run_type: 'daily_rules' | 'weekly_factcheck' | 'on_demand'
  status: 'running' | 'done' | 'failed'
  started_at: string
  finished_at: string | null
  summary: {
    total_claims?: number
    by_verdict?: Record<string, number>
    by_severity?: Record<string, number>
  }
}

interface EvalIssue {
  id: string
  run_id: string | null
  object_type: string
  object_locator: string | null
  claim: string
  claim_type: string | null
  status: 'open' | 'triaged' | 'fixed' | 'dismissed'
  verdict: 'supported' | 'needs_update' | 'contradicted' | 'unverifiable'
  severity: 'high' | 'med' | 'low'
  confidence: number
  suggested_fix: string | null
  created_at: string
}

const RUN_TYPE_LABELS: Record<string, string> = {
  daily_rules: 'Daily Rules',
  weekly_factcheck: 'Weekly Factcheck',
  on_demand: 'On Demand',
}

const STATUS_COLORS: Record<string, string> = {
  running: 'text-accent-blue',
  done: 'text-accent-green',
  failed: 'text-accent-red',
  open: 'text-accent-orange',
  triaged: 'text-accent-blue',
  fixed: 'text-accent-green',
  dismissed: 'text-t4',
}

const VERDICT_COLORS: Record<string, string> = {
  supported: 'text-accent-green',
  needs_update: 'text-accent-orange',
  contradicted: 'text-accent-red',
  unverifiable: 'text-t4',
}

const SEVERITY_COLORS: Record<string, string> = {
  high: 'bg-accent-red/20 text-accent-red',
  med: 'bg-accent-orange/20 text-accent-orange',
  low: 'bg-t4/20 text-t3',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EvalAdminPage() {
  const [runs, setRuns] = useState<EvalRun[]>([])
  const [issues, setIssues] = useState<EvalIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [triggeringRun, setTriggeringRun] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'runs' | 'issues'>('issues')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch from internal admin API
      const response = await fetch('/api/admin/eval')

      if (!response.ok) {
        throw new Error('Failed to fetch eval data')
      }

      const data = await response.json()
      setRuns(data.runs || [])
      setIssues(data.issues || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const triggerRun = async (runType: 'daily_rules' | 'weekly_factcheck' | 'on_demand') => {
    setTriggeringRun(true)
    try {
      const response = await fetch('/api/admin/eval/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_type: runType }),
      })

      if (!response.ok) {
        throw new Error('Failed to trigger run')
      }

      // Refresh data
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger run')
    } finally {
      setTriggeringRun(false)
    }
  }

  const updateIssueStatus = async (issueId: string, status: EvalIssue['status']) => {
    try {
      const response = await fetch('/api/admin/eval/issues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: issueId, status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update issue')
      }

      // Update local state
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? { ...issue, status } : issue))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update issue')
    }
  }

  const openIssues = issues.filter((i) => i.status === 'open')
  const highSeverityCount = openIssues.filter((i) => i.severity === 'high').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold text-t1 tracking-wide">
          Eval Agent
        </h1>
        <p className="text-t3 text-sm mt-1">
          Content verification and fact-checking status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg2 border border-brd rounded-xl p-5">
          <p className="text-t3 text-xs font-medium mb-2">Open Issues</p>
          <p className={`text-2xl font-bold ${openIssues.length > 0 ? 'text-accent-orange' : 'text-accent-green'}`}>
            {openIssues.length}
          </p>
          <p className="text-t4 text-[11px] mt-1">
            {highSeverityCount > 0 ? `${highSeverityCount} high severity` : 'No high severity'}
          </p>
        </div>
        <div className="bg-bg2 border border-brd rounded-xl p-5">
          <p className="text-t3 text-xs font-medium mb-2">Total Runs</p>
          <p className="text-2xl font-bold text-accent-blue">{runs.length}</p>
          <p className="text-t4 text-[11px] mt-1">
            {runs.filter((r) => r.status === 'done').length} completed
          </p>
        </div>
        <div className="bg-bg2 border border-brd rounded-xl p-5">
          <p className="text-t3 text-xs font-medium mb-2">Last Run</p>
          <p className="text-2xl font-bold text-gold">
            {runs.length > 0 ? formatDate(runs[0].started_at) : 'Never'}
          </p>
          <p className="text-t4 text-[11px] mt-1">
            {runs.length > 0 ? RUN_TYPE_LABELS[runs[0].run_type] : '-'}
          </p>
        </div>
        <div className="bg-bg2 border border-brd rounded-xl p-5">
          <p className="text-t3 text-xs font-medium mb-2">Fixed Issues</p>
          <p className="text-2xl font-bold text-accent-green">
            {issues.filter((i) => i.status === 'fixed').length}
          </p>
          <p className="text-t4 text-[11px] mt-1">
            {issues.filter((i) => i.status === 'dismissed').length} dismissed
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-t2 mb-3">Trigger Evaluation</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => triggerRun('daily_rules')}
            disabled={triggeringRun}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 hover:border-accent-blue/35 transition-all duration-200 disabled:opacity-50"
          >
            {triggeringRun ? 'Running...' : 'Run Daily Rules'}
          </button>
          <button
            onClick={() => triggerRun('weekly_factcheck')}
            disabled={triggeringRun}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20 hover:bg-accent-purple/20 hover:border-accent-purple/35 transition-all duration-200 disabled:opacity-50"
          >
            {triggeringRun ? 'Running...' : 'Run Weekly Factcheck'}
          </button>
          <button
            onClick={() => triggerRun('on_demand')}
            disabled={triggeringRun}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 hover:border-gold/35 transition-all duration-200 disabled:opacity-50"
          >
            {triggeringRun ? 'Running...' : 'Run Full Evaluation'}
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-bg3 text-t2 border border-brd hover:border-brd2 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-brd">
        <button
          onClick={() => setSelectedTab('issues')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            selectedTab === 'issues'
              ? 'text-gold border-b-2 border-gold'
              : 'text-t3 hover:text-t1'
          }`}
        >
          Issues ({issues.length})
        </button>
        <button
          onClick={() => setSelectedTab('runs')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            selectedTab === 'runs'
              ? 'text-gold border-b-2 border-gold'
              : 'text-t3 hover:text-t1'
          }`}
        >
          Runs ({runs.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-t3 text-sm py-8 text-center">Loading...</div>
      ) : selectedTab === 'issues' ? (
        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="text-t3 text-sm py-8 text-center">No issues found</div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-bg2 border border-brd rounded-xl p-4 hover:border-brd2 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${SEVERITY_COLORS[issue.severity]}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-t1 font-medium line-clamp-2">{issue.claim}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="text-t4">{issue.object_type}</span>
                      {issue.object_locator && (
                        <span className="text-t4 font-mono">{issue.object_locator}</span>
                      )}
                      <span className={VERDICT_COLORS[issue.verdict]}>{issue.verdict}</span>
                      <span className="text-t4">{Math.round(issue.confidence * 100)}% confidence</span>
                    </div>
                    {issue.suggested_fix && (
                      <p className="text-xs text-accent-blue mt-2 bg-accent-blue/5 px-2 py-1 rounded">
                        💡 {issue.suggested_fix}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {issue.status === 'open' && (
                      <>
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'fixed')}
                          className="px-2 py-1 text-[10px] font-medium bg-accent-green/10 text-accent-green rounded hover:bg-accent-green/20"
                        >
                          Fixed
                        </button>
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'dismissed')}
                          className="px-2 py-1 text-[10px] font-medium bg-t4/10 text-t3 rounded hover:bg-t4/20"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    <span className={`px-2 py-1 text-[10px] font-medium ${STATUS_COLORS[issue.status]}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {runs.length === 0 ? (
            <div className="text-t3 text-sm py-8 text-center">No runs yet</div>
          ) : (
            runs.map((run) => (
              <div
                key={run.id}
                className="bg-bg2 border border-brd rounded-xl p-4 hover:border-brd2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-t1 font-medium">
                      {RUN_TYPE_LABELS[run.run_type]}
                    </p>
                    <p className="text-xs text-t3 mt-1">
                      Started: {formatDate(run.started_at)}
                      {run.finished_at && ` • Finished: ${formatDate(run.finished_at)}`}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${STATUS_COLORS[run.status]}`}>
                    {run.status}
                  </span>
                </div>
                {run.summary.total_claims && (
                  <div className="mt-3 pt-3 border-t border-brd/50 text-xs text-t3">
                    Claims checked: {run.summary.total_claims}
                    {run.summary.by_verdict && (
                      <span className="ml-3">
                        {Object.entries(run.summary.by_verdict)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
