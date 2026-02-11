import { useCallback } from 'react'
import useSWR from 'swr'
import { deleteConversation, getConversation, ConversationListItem, swrFetcher } from '../lib/api'

interface UseConversationsOptions {
  userId: string
}

export function useConversations({ userId }: UseConversationsOptions) {
  const {
    data,
    error: swrError,
    isLoading,
    mutate
  } = useSWR(userId ? `/chat/conversations?userId=${userId}` : null, swrFetcher)

  const conversations = data?.conversations || []

  const removeConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId)
      mutate() // Revalidate
    } catch (err) {
      console.error('Failed to delete conversation', err)
    }
  }, [mutate])

  const loadConversationMessages = useCallback(async (conversationId: string) => {
    try {
      const conversation = await getConversation(conversationId)
      return conversation.messages || []
    } catch (err) {
      console.error('Failed to load conversation', err)
      return []
    }
  }, [])

  return {
    conversations,
    isLoading,
    error: swrError?.message || null,
    refresh: mutate,
    removeConversation,
    loadConversationMessages,
  }
}
