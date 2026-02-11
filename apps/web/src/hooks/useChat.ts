import { useState, useCallback, useRef, useEffect } from 'react'
import { sendMessage, StreamEvent } from '../lib/api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  agentType?: string
  isStreaming?: boolean
}

export interface TypingState {
  isTyping: boolean
  agent?: string
  message?: string
}

interface UseChatOptions {
  userId: string
  onConversationCreated?: (conversationId: string) => void
}

export function useChat({ userId, onConversationCreated }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [typing, setTyping] = useState<TypingState>({ isTyping: false })
  const [currentAgent, setCurrentAgent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const streamingMessageIdRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendUserMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)
    setIsLoading(true)

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    }
    setMessages(prev => [...prev, userMessage])

    // Clear any previous streaming message tracking
    streamingMessageIdRef.current = null

    try {
      const stream = sendMessage(content, userId, conversationId || undefined)

      for await (const event of stream) {
        handleStreamEvent(event)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Cleanup empty assistant message on error if it was created
      const id = streamingMessageIdRef.current
      if (id) {
        setMessages(prev => prev.filter(m => m.id !== id || m.content))
      }
    } finally {
      setIsLoading(false)
      setTyping({ isTyping: false })
    }
  }, [userId, conversationId, isLoading])

  const handleStreamEvent = useCallback((event: StreamEvent) => {
    const getOrCreateAssistantMessage = () => {
      if (streamingMessageIdRef.current) return streamingMessageIdRef.current

      const newId = `assistant-${Date.now()}`
      streamingMessageIdRef.current = newId
      setMessages(prev => [...prev, {
        id: newId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }])
      return newId
    }

    switch (event.type) {
      case 'typing':
        setTyping({
          isTyping: true,
          agent: event.agent,
          message: event.message,
        })
        break

      case 'agent': {
        const id = getOrCreateAssistantMessage()
        setTyping({ isTyping: false }) // Clear typing indicator once an agent takes over
        setCurrentAgent(event.agent || null)
        setMessages(prev => prev.map(m =>
          m.id === id ? { ...m, agentType: event.agent } : m
        ))
        break
      }

      case 'content': {
        const id = getOrCreateAssistantMessage()
        setTyping({ isTyping: false })
        setMessages(prev => prev.map(m =>
          m.id === id
            ? { ...m, content: m.content + (event.text || '') }
            : m
        ))
        break
      }

      case 'done': {
        const id = streamingMessageIdRef.current
        if (id) {
          setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, isStreaming: false } : m
          ))
        }
        if (event.conversationId && !conversationId) {
          setConversationId(event.conversationId)
          onConversationCreated?.(event.conversationId)
        }
        break
      }

      case 'error':
        setError(event.message || 'An error occurred')
        break
    }
  }, [conversationId, onConversationCreated])

  const clearChat = useCallback(() => {
    setMessages([])
    setConversationId(null)
    setCurrentAgent(null)
    setError(null)
  }, [])

  const loadConversation = useCallback((convId: string, convMessages: ChatMessage[]) => {
    setConversationId(convId)
    setMessages(convMessages)
  }, [])

  return {
    messages,
    conversationId,
    isLoading,
    typing,
    currentAgent,
    error,
    sendMessage: sendUserMessage,
    clearChat,
    loadConversation,
  }
}
