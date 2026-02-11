const API_BASE_URL = '/api'

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
 * Send a message and stream the response
 */
export async function* sendMessage(
  message: string,
  userId: string,
  conversationId?: string
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      userId,
      conversationId,
    }),
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
  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * List all conversations for a user
 */
export async function listConversations(userId: string): Promise<{ conversations: ConversationListItem[] }> {
  const response = await fetch(`${API_BASE_URL}/chat/conversations?userId=${userId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

/**
 * List all available agents
 */
export async function listAgents(): Promise<{ agents: Agent[] }> {
  const response = await fetch(`${API_BASE_URL}/agents`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * Get capabilities for a specific agent
 */
export async function getAgentCapabilities(agentType: string): Promise<Agent> {
  const response = await fetch(`${API_BASE_URL}/agents/${agentType}/capabilities`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}
