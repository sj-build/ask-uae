'use client'

import { useState, useCallback, type FormEvent } from 'react'
import type { NewsItem, NewsSource, NewsPriority } from '@/types/news'

const INITIAL_NEWS: readonly NewsItem[] = [
  {
    id: 'n1',
    title: 'UAE Sovereign Wealth Fund Expands Asian Investment Portfolio',
    url: 'https://example.com/1',
    source: 'google',
    publisher: 'Reuters',
    publishedAt: '2025-01-28T10:00:00Z',
    tags: ['ADIA', 'investment', 'Asia'],
    priority: 'reuters',
  },
  {
    id: 'n2',
    title: 'Mubadala Signs $2B Tech Partnership with Korean Conglomerate',
    url: 'https://example.com/2',
    source: 'google',
    publisher: 'Bloomberg',
    publishedAt: '2025-01-27T08:30:00Z',
    tags: ['Mubadala', 'Korea', 'tech'],
    priority: 'bloomberg',
  },
  {
    id: 'n3',
    title: 'Sheikh Tahnoun Visits Seoul for Strategic Discussions',
    url: 'https://example.com/3',
    source: 'naver',
    publisher: 'Yonhap',
    publishedAt: '2025-01-26T14:00:00Z',
    tags: ['Tahnoun', 'Korea', 'diplomacy'],
    priority: 'other',
  },
  {
    id: 'n4',
    title: 'Abu Dhabi AI Hub Attracts Global Tech Companies',
    url: 'https://example.com/4',
    source: 'google',
    publisher: 'Gulf News',
    publishedAt: '2025-01-25T09:15:00Z',
    tags: ['AI', 'Abu Dhabi', 'tech'],
    priority: 'gulf_news',
  },
] as const

interface AddNewsFormProps {
  readonly onAdd: (item: NewsItem) => void
  readonly onCancel: () => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function sourceLabel(source: NewsSource): string {
  const labels: Record<NewsSource, string> = {
    google: 'Google',
    naver: 'Naver',
    manual: 'Manual',
  }
  return labels[source]
}

function priorityColor(priority: NewsPriority): string {
  const colors: Record<NewsPriority, string> = {
    reuters: 'text-accent-orange',
    bloomberg: 'text-accent-blue',
    financial_times: 'text-accent-orange',
    wsj: 'text-accent-orange',
    the_national: 'text-accent-cyan',
    khaleej_times: 'text-accent-cyan',
    arab_news: 'text-accent-cyan',
    gulf_news: 'text-accent-cyan',
    wam: 'text-accent-green',
    other: 'text-t3',
  }
  return colors[priority]
}

function AddNewsForm({ onAdd, onCancel }: AddNewsFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [publisher, setPublisher] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()

    const newItem: NewsItem = {
      id: `manual-${Date.now()}`,
      title,
      url,
      source: 'manual',
      publisher,
      publishedAt: new Date().toISOString(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      priority: 'other',
    }

    onAdd(newItem)
  }, [title, url, publisher, tags, onAdd])

  return (
    <div className="bg-bg2 border border-brd2 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-gold mb-4">Add News Item</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="news-title" className="block text-[11px] text-t3 mb-1">Title</label>
            <input
              id="news-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-bg3 border border-brd rounded-lg text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-gold/40 transition-colors duration-200"
              placeholder="Article title"
              required
            />
          </div>
          <div>
            <label htmlFor="news-url" className="block text-[11px] text-t3 mb-1">URL</label>
            <input
              id="news-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-bg3 border border-brd rounded-lg text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-gold/40 transition-colors duration-200"
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <label htmlFor="news-publisher" className="block text-[11px] text-t3 mb-1">Publisher</label>
            <input
              id="news-publisher"
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full px-3 py-2 bg-bg3 border border-brd rounded-lg text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-gold/40 transition-colors duration-200"
              placeholder="Source name"
              required
            />
          </div>
          <div>
            <label htmlFor="news-tags" className="block text-[11px] text-t3 mb-1">Tags (comma-separated)</label>
            <input
              id="news-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-bg3 border border-brd rounded-lg text-sm text-t1 placeholder:text-t4 focus:outline-none focus:border-gold/40 transition-colors duration-200"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-gold bg-gold/10 border border-gold/20 rounded-lg hover:bg-gold/20 transition-all duration-200"
          >
            Add News
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-t3 hover:text-t2 bg-bg3 border border-brd rounded-lg hover:bg-bg4 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function triggerCrawl() {
  alert('Crawl triggered. Backend integration coming in Phase 3.')
}

export default function AdminNewsPage() {
  const [newsItems, setNewsItems] = useState<readonly NewsItem[]>(INITIAL_NEWS)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = useCallback((item: NewsItem) => {
    setNewsItems((prev) => [item, ...prev])
    setShowForm(false)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setNewsItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-xl font-bold text-t1 tracking-wide">
            News Management
          </h1>
          <p className="text-t3 text-sm mt-1">
            View, add, and manage intelligence news items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={triggerCrawl}
            className="px-4 py-2 text-xs font-semibold text-accent-blue bg-accent-blue/10 border border-accent-blue/20 rounded-lg hover:bg-accent-blue/20 transition-all duration-200"
          >
            Trigger Crawl
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-xs font-semibold text-gold bg-gold/10 border border-gold/20 rounded-lg hover:bg-gold/20 transition-all duration-200"
          >
            + Add Manual
          </button>
        </div>
      </div>

      {showForm && (
        <AddNewsForm
          onAdd={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-bg2 border border-brd rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brd">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">Source</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">Tags</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsItems.map((item) => (
                <tr key={item.id} className="border-b border-brd/50 hover:bg-bg3/30 transition-colors duration-150">
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-t2">{sourceLabel(item.source)}</span>
                      <span className={`text-[10px] ${priorityColor(item.priority)}`}>
                        {item.publisher}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-t1 hover:text-gold transition-colors duration-150 line-clamp-1"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="text-xs text-t3">{formatDate(item.publishedAt)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 text-[10px] text-t3 bg-bg3 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 text-[10px] font-medium text-accent-red hover:bg-accent-red/10 rounded transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {newsItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-t3">
                    No news items. Add one manually or trigger a crawl.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
