import { useCallback } from 'react'
import useSWR from 'swr'
import { deleteConversation, getConversation, ConversationListItem } from '../lib/api'
import client from '../lib/client'

interface UseConversationsOptions {
  userId: string
}

export function useConversations({ userId }: UseConversationsOptions) {
  const {
    data,
    error: swrError,
    isLoading,
    mutate
  } = useSWR(
    userId ? ['conversations', userId] : null,
    async () => {
      const res = await client.api.chat.conversations.$get({ query: { userId } })
      if (!res.ok) throw new Error('Failed to fetch conversations')
      return await res.json()
    }
  )

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
