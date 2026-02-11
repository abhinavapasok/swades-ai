import { useState, useCallback, useEffect } from 'react'
import { listConversations, deleteConversation, getConversation, ConversationListItem } from '../lib/api'

interface UseConversationsOptions {
  userId: string
}

export function useConversations({ userId }: UseConversationsOptions) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listConversations(userId)
      setConversations(data.conversations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const removeConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId)
      setConversations(prev => prev.filter(c => c.id !== conversationId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
    }
  }, [])

  const loadConversationMessages = useCallback(async (conversationId: string) => {
    try {
      const conversation = await getConversation(conversationId)
      return conversation.messages || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation')
      return []
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return {
    conversations,
    isLoading,
    error,
    refresh: fetchConversations,
    removeConversation,
    loadConversationMessages,
  }
}
