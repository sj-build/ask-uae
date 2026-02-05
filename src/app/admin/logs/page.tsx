'use client'

import { useState, useMemo } from 'react'
import type { UpdateLog } from '@/types/admin'

const MOCK_LOGS: readonly UpdateLog[] = [
  {
    id: 'log-1',
    type: 'auto',
    action: 'Crawl completed',
    timestamp: '2025-01-28T12:00:00Z',
    details: '14 new articles from Google News',
  },
  {
    id: 'log-2',
    type: 'manual',
    action: 'News item added',
    timestamp: '2025-01-28T10:30:00Z',
    details: 'Reuters: UAE SWF expands Asia portfolio',
  },
  {
    id: 'log-3',
    type: 'auto',
    action: 'Crawl completed',
    timestamp: '2025-01-28T06:00:00Z',
    details: '8 new articles from Naver News',
  },
  {
    id: 'log-4',
    type: 'manual',
    action: 'Keyword added',
    timestamp: '2025-01-27T16:45:00Z',
    details: 'Layer 3: "UAE defense industry"',
  },
  {
    id: 'log-5',
    type: 'auto',
    action: 'Crawl completed',
    timestamp: '2025-01-27T12:00:00Z',
    details: '11 new articles from Google News',
  },
  {
    id: 'log-6',
    type: 'manual',
    action: 'Content updated',
    timestamp: '2025-01-27T09:15:00Z',
    details: 'Power Structure section revised',
  },
  {
    id: 'log-7',
    type: 'auto',
    action: 'Crawl completed',
    timestamp: '2025-01-27T06:00:00Z',
    details: '5 new articles from Naver News',
  },
  {
    id: 'log-8',
    type: 'manual',
    action: 'Keyword deactivated',
    timestamp: '2025-01-26T14:00:00Z',
    details: 'Layer 3: "NEOM partnership" set inactive',
  },
  {
    id: 'log-9',
    type: 'auto',
    action: 'Crawl completed',
    timestamp: '2025-01-26T12:00:00Z',
    details: '19 new articles from Google News',
  },
  {
    id: 'log-10',
    type: 'manual',
    action: 'News item deleted',
    timestamp: '2025-01-26T08:30:00Z',
    details: 'Duplicate article removed',
  },
] as const

type FilterType = 'all' | 'auto' | 'manual'

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function typeBadge(type: 'auto' | 'manual'): string {
  return type === 'auto'
    ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
    : 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
}

export default function AdminLogsPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredLogs = useMemo(() => {
    if (filter === 'all') {
      return MOCK_LOGS
    }
    return MOCK_LOGS.filter((log) => log.type === filter)
  }, [filter])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-xl font-bold text-t1 tracking-wide">
            Update Logs
          </h1>
          <p className="text-t3 text-sm mt-1">
            Track system and manual update activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="log-filter" className="text-xs text-t3">
            Filter:
          </label>
          <select
            id="log-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-1.5 bg-bg3 border border-brd rounded-lg text-xs text-t1 focus:outline-none focus:border-gold/30 transition-colors duration-200 appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="auto">Auto Only</option>
            <option value="manual">Manual Only</option>
          </select>
        </div>
      </div>

      <div className="bg-bg2 border border-brd rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brd">
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider w-32">
                Date
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider w-24">
                Type
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">
                Action
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-brd/50 hover:bg-bg3/30 transition-colors duration-150"
              >
                <td className="px-5 py-3">
                  <span className="text-xs text-t3 whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-medium border rounded ${typeBadge(log.type)}`}>
                    {log.type}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm text-t1">{log.action}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs text-t3">{log.details}</span>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-t3">
                  No logs matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right">
        <span className="text-[11px] text-t4">
          Showing {filteredLogs.length} of {MOCK_LOGS.length} entries
        </span>
      </div>
    </div>
  )
}
