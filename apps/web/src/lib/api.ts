import apiClient from './axiosConfig'

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentType?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Conversation {
  id: string
  userId: string
  title: string | null
  status: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

export interface ConversationListItem {
  id: string
  title: string | null
  status: string
  messageCount: number
  lastMessage?: string
  createdAt: string
  updatedAt: string
}

export interface Agent {
  type: string
  name: string
  description: string
  capabilities: string[]
}

export interface StreamEvent {
  type: 'typing' | 'agent' | 'content' | 'done' | 'error'
  agent?: string
  text?: string
  message?: string
  conversationId?: string
  reasoning?: string
  confidence?: number
}

/**
 * Send a message and stream the response.
 * Uses native fetch because axios doesn't support ReadableStream/SSE.
 */
export async function* sendMessage(
  message: string,
  userId: string,
  conversationId?: string
): AsyncGenerator<StreamEvent> {
  const response = await fetch('/api/chat/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userId, conversationId }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          yield data as StreamEvent
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}

/**
 * Get a conversation with all messages
 */
export async function getConversation(conversationId: string): Promise<Conversation> {
  const { data } = await apiClient.get<Conversation>(`/chat/conversations/${conversationId}`)
  return data
}

/**
 * List all conversations for a user
 */
export async function listConversations(userId: string): Promise<{ conversations: ConversationListItem[] }> {
  const { data } = await apiClient.get<{ conversations: ConversationListItem[] }>('/chat/conversations', {
    params: { userId },
  })
  return data
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  await apiClient.delete(`/chat/conversations/${conversationId}`)
}

/**
 * List all available agents
 */
export async function listAgents(): Promise<{ agents: Agent[] }> {
  const { data } = await apiClient.get<{ agents: Agent[] }>('/agents')
  return data
}

/**
 * Get capabilities for a specific agent
 */
export async function getAgentCapabilities(agentType: string): Promise<Agent> {
  const { data } = await apiClient.get<Agent>(`/agents/${agentType}/capabilities`)
  return data
}
