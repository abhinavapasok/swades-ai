import apiClient from './axiosConfig'

// --- Types & Interfaces ---

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

export interface User {
  id: string
  name: string
  email: string
}

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  shippingAddress: string
  trackingNumber?: string
  items: OrderItem[]
  createdAt: string
}

export interface Payment {
  id: string
  invoiceNumber: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  refundAmount?: number
  createdAt: string
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

// --- Fetchers & SWR ---

/**
 * Standard SWR fetcher using the centralized apiClient (Axios)
 */
export const swrFetcher = (url: string) => apiClient.get(url).then((res) => res.data)

// --- API Functions ---

/**
 * Send a message and stream the response.
 * NOTE: Uses native fetch because Axios does not natively support ReadableStream/SSE streaming as well as fetch does.
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
 * Get a single conversation with all its messages
 */
export async function getConversation(conversationId: string): Promise<Conversation> {
  const { data } = await apiClient.get<Conversation>(`/chat/conversations/${conversationId}`)
  return data
}

/**
 * List all conversations for a specific user
 */
export async function listConversations(userId: string): Promise<{ conversations: ConversationListItem[] }> {
  const { data } = await apiClient.get<{ conversations: ConversationListItem[] }>('/chat/conversations', {
    params: { userId },
  })
  return data
}

/**
 * Delete a specific conversation by ID
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  await apiClient.delete(`/chat/conversations/${conversationId}`)
}

/**
 * List all available AI agents in the system
 */
export async function listAgents(): Promise<{ agents: Agent[] }> {
  const { data } = await apiClient.get<{ agents: Agent[] }>('/agents')
  return data
}

/**
 * Get capabilities and details for a specific agent type
 */
export async function getAgentCapabilities(agentType: string): Promise<Agent> {
  const { data } = await apiClient.get<Agent>(`/agents/${agentType}/capabilities`)
  return data
}

/**
 * List all users (demo purposes)
 */
export async function listUsers(): Promise<{ data: User[] }> {
  const { data } = await apiClient.get<{ data: User[] }>('/users')
  return data
}

/**
 * List all orders for a specific user
 */
export async function listOrders(userId: string): Promise<{ data: Order[] }> {
  const { data } = await apiClient.get<{ data: Order[] }>('/orders', {
    params: { userId },
  })
  return data
}

/**
 * List all payments for a specific user
 */
export async function listPayments(userId: string): Promise<{ data: Payment[] }> {
  const { data } = await apiClient.get<{ data: Payment[] }>('/payments', {
    params: { userId },
  })
  return data
}
