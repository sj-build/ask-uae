'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage } from '@/types/search'
import { CONVERSATION_LIMITS } from '@/types/search'
import type { SourceReference } from '@/lib/supabase'

const STORAGE_KEY = 'uae-dashboard-conversations'
const MAX_SAVED_CONVERSATIONS = 10

export interface SavedConversation {
  readonly id: string
  readonly title: string
  readonly messages: readonly ChatMessage[]
  readonly createdAt: string
  readonly updatedAt: string
}

function generateId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadConversations(): SavedConversation[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveConversations(conversations: SavedConversation[]): void {
  if (typeof window === 'undefined') return
  try {
    // Keep only the most recent conversations
    const toSave = conversations.slice(0, MAX_SAVED_CONVERSATIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

interface StreamEvent {
  type: 'metadata' | 'content' | 'done' | 'error'
  text?: string
  turnCount?: number
  limitReached?: boolean
  sources?: SourceReference[]
  error?: string
  truncated?: boolean
}

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [sources, setSources] = useState<SourceReference[]>([])
  const [truncated, setTruncated] = useState(false)
  const [isContinuing, setIsContinuing] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const searchIdRef = useRef(0)
  const conversationIdRef = useRef<string | null>(null)

  // Sync ref with state
  useEffect(() => {
    conversationIdRef.current = currentConversationId
  }, [currentConversationId])

  // Load saved conversations on mount
  useEffect(() => {
    setSavedConversations(loadConversations())
  }, [])

  // Save current conversation when messages change
  useEffect(() => {
    if (messages.length === 0) return

    const now = new Date().toISOString()
    const firstUserMessage = messages.find(m => m.role === 'user')
    const title = firstUserMessage?.content.slice(0, 50) || 'New Conversation'

    const existingId = conversationIdRef.current

    if (existingId) {
      // Update existing conversation
      setSavedConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === existingId
            ? { ...conv, messages: [...messages], updatedAt: now }
            : conv
        )
        saveConversations(updated)
        return updated
      })
    } else {
      // Create new conversation
      const newId = generateId()
      conversationIdRef.current = newId
      setCurrentConversationId(newId)

      const newConv: SavedConversation = {
        id: newId,
        title,
        messages: [...messages],
        createdAt: now,
        updatedAt: now,
      }

      setSavedConversations(prev => {
        const updated = [newConv, ...prev]
        saveConversations(updated)
        return updated
      })
    }
  }, [messages])

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return
    if (limitReached) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const currentSearchId = ++searchIdRef.current

    // Add user message to state immediately
    const userMessage: ChatMessage = { role: 'user', content: query }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setStreamingContent('')
    setTruncated(false)

    try {
      // Build messages for API (current messages + new user message)
      const currentMessages = [...messages, userMessage]

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          messages: currentMessages,
          stream: true,
        }),
        signal: controller.signal,
      })

      // Check if streaming response
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No reader available')

        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let doneReceived = false
        let messageSaved = false
        let buffer = '' // Buffer for partial SSE lines split across chunks

        const processEvent = (event: StreamEvent) => {
          if (event.type === 'metadata') {
            if (event.turnCount !== undefined) {
              setTurnCount(event.turnCount)
            }
            if (event.limitReached) {
              setLimitReached(true)
            }
            if (event.sources && event.sources.length > 0) {
              setSources(event.sources)
            }
          } else if (event.type === 'content' && event.text) {
            accumulatedContent += event.text
            setStreamingContent(accumulatedContent)
          } else if (event.type === 'done') {
            doneReceived = true
            messageSaved = true
            if (event.truncated) {
              setTruncated(true)
            }
            const assistantMessage: ChatMessage = { role: 'assistant', content: accumulatedContent }
            setMessages(prev => [...prev, assistantMessage])
            setStreamingContent('')
          } else if (event.type === 'error') {
            throw new Error(event.error || 'Stream error')
          }
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')

            // Keep last (potentially incomplete) line in buffer
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const event: StreamEvent = JSON.parse(line.slice(6))
                  processEvent(event)
                } catch (parseError) {
                  if (parseError instanceof Error && parseError.message !== 'Stream error' && !parseError.message.startsWith('Stream')) {
                    continue
                  }
                  throw parseError
                }
              }
            }
          }

          // Process any remaining buffered data after stream ends
          if (buffer.startsWith('data: ')) {
            try {
              const event: StreamEvent = JSON.parse(buffer.slice(6))
              processEvent(event)
            } catch {
              // Final buffer was incomplete — ignore
            }
          }
        } catch (streamError) {
          // Stream broke — save partial content and mark as truncated
          if (!messageSaved && accumulatedContent) {
            messageSaved = true
            setTruncated(true)
            const assistantMessage: ChatMessage = { role: 'assistant', content: accumulatedContent }
            setMessages(prev => [...prev, assistantMessage])
            setStreamingContent('')
          } else if (!messageSaved && !accumulatedContent) {
            throw streamError
          }
        }

        // Safety net: stream ended normally but done event was never received (Vercel timeout)
        if (!messageSaved && accumulatedContent) {
          setTruncated(true)
          const assistantMessage: ChatMessage = { role: 'assistant', content: accumulatedContent }
          setMessages(prev => [...prev, assistantMessage])
          setStreamingContent('')
        }
      } else {
        // Handle non-streaming response (fallback)
        const data = await response.json()

        if (data.success && data.html) {
          const assistantMessage: ChatMessage = { role: 'assistant', content: data.html }
          setMessages(prev => [...prev, assistantMessage])
          setTurnCount(data.turnCount ?? turnCount + 1)

          if (data.limitReached) {
            setLimitReached(true)
          }
          if (data.sources && data.sources.length > 0) {
            setSources(data.sources)
          }
        } else {
          // Remove the user message on error
          setMessages(prev => prev.slice(0, -1))
        }
      }
    } catch (error) {
      // Only remove user message if no assistant response was added
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1]
        // If last message is the user's question (no response yet), remove it
        if (lastMsg?.role === 'user') return prev.slice(0, -1)
        // Otherwise an assistant response exists — keep everything
        return prev
      })
      setStreamingContent('')

      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Search error:', error.message)
      }
    } finally {
      // Only the latest search can clear loading state (prevents abort race condition)
      if (currentSearchId === searchIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [messages, limitReached, turnCount])

  const continueResponse = useCallback(async () => {
    if (isContinuing || isLoading) return

    // Get the last assistant message content
    const lastAssistantIndex = messages.length - 1
    const lastAssistant = messages[lastAssistantIndex]
    if (!lastAssistant || lastAssistant.role !== 'assistant') {
      return
    }

    const existingContent = lastAssistant.content

    // Cancel any existing request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsContinuing(true)
    setTruncated(false)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '이어서 계속 작성해주세요. 중단된 부분부터 이어서 써주세요.',
          messages: messages, // includes the last assistant message
          stream: true,
          continuation: true,
        }),
        signal: controller.signal,
      })

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('text/event-stream')) {
        // Non-streaming fallback — nothing to do
        setIsContinuing(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setIsContinuing(false)
        return
      }

      // Only move content to streaming after request is established
      setMessages(prev => prev.slice(0, -1))
      setStreamingContent(existingContent)

      const decoder = new TextDecoder()
      let accumulatedContent = existingContent
      let buffer = ''
      let stillTruncated = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: StreamEvent = JSON.parse(line.slice(6))
              if (event.type === 'content' && event.text) {
                accumulatedContent += event.text
                setStreamingContent(accumulatedContent)
              } else if (event.type === 'done') {
                if (event.truncated) {
                  stillTruncated = true
                }
              }
            } catch {
              continue
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.startsWith('data: ')) {
        try {
          const event: StreamEvent = JSON.parse(buffer.slice(6))
          if (event.type === 'content' && event.text) {
            accumulatedContent += event.text
          } else if (event.type === 'done' && event.truncated) {
            stillTruncated = true
          }
        } catch {
          // incomplete buffer, mark as truncated
          if (accumulatedContent.length > existingContent.length) {
            stillTruncated = true
          }
        }
      }

      // Save combined content as assistant message
      const combinedMessage: ChatMessage = { role: 'assistant', content: accumulatedContent }
      setMessages(prev => [...prev, combinedMessage])
      setStreamingContent('')

      if (stillTruncated) {
        setTruncated(true)
      }
    } catch (error) {
      // Restore what we had
      setMessages(prev => [...prev, { role: 'assistant' as const, content: existingContent }])
      setStreamingContent('')
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Continue response error:', error.message)
      }
    } finally {
      setIsContinuing(false)
    }
  }, [messages, isContinuing, isLoading])

  const clearConversation = useCallback(() => {
    setMessages([])
    setStreamingContent('')
    setLimitReached(false)
    setTurnCount(0)
    setSources([])
    setTruncated(false)
    setCurrentConversationId(null)
    conversationIdRef.current = null
  }, [])

  const loadConversation = useCallback((conversationId: string) => {
    const conversation = savedConversations.find(c => c.id === conversationId)
    if (conversation) {
      conversationIdRef.current = conversationId
      setCurrentConversationId(conversationId)
      setMessages([...conversation.messages])
      const userMessageCount = conversation.messages.filter(m => m.role === 'user').length
      setTurnCount(userMessageCount)
      setLimitReached(userMessageCount >= CONVERSATION_LIMITS.MAX_TURNS)
    }
  }, [savedConversations])

  const deleteConversation = useCallback((conversationId: string) => {
    setSavedConversations(prev => {
      const updated = prev.filter(c => c.id !== conversationId)
      saveConversations(updated)
      return updated
    })
    if (currentConversationId === conversationId) {
      clearConversation()
    }
  }, [currentConversationId, clearConversation])

  const isNearLimit = turnCount >= CONVERSATION_LIMITS.WARNING_TURNS

  return {
    isLoading,
    messages,
    streamingContent,
    turnCount,
    limitReached,
    isNearLimit,
    sources,
    truncated,
    isContinuing,
    search,
    clearConversation,
    continueResponse,
    // Conversation history
    savedConversations,
    currentConversationId,
    loadConversation,
    deleteConversation,
  } as const
}
