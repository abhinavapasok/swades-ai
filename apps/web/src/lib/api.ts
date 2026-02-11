import client from './client'
import { hc } from 'hono/client'
import type { InferResponseType } from 'hono/client'
import type { AppType } from '@swadesai/api'
import {
  type StreamEvent,
  type AgentType,
} from '@swadesai/shared'

export type { StreamEvent, AgentType }

type Client = ReturnType<typeof hc<AppType>>

// Use InferResponseType for exact API response matching, but export them
export type Conversation = Extract<InferResponseType<Client['api']['chat']['conversations'][':id']['$get']>, { id: string }>
export type Message = Conversation extends { messages: (infer M)[] } ? M : any
export type ConversationListItem = Extract<InferResponseType<Client['api']['chat']['conversations']['$get']>, { conversations: any }> extends { conversations: (infer C)[] } ? C : any
export type Agent = Extract<InferResponseType<Client['api']['agents']['$get']>, { agents: any }> extends { agents: (infer A)[] } ? A : any
export type User = Extract<InferResponseType<Client['api']['users']['$get']>, { data: any }> extends { data: (infer U)[] } ? U : any
export type Order = Extract<InferResponseType<Client['api']['orders']['$get']>, { data: any }> extends { data: (infer O)[] } ? O : any
export type Payment = Extract<InferResponseType<Client['api']['payments']['$get']>, { data: any }> extends { data: (infer P)[] } ? P : any

export type OrderItem = Order extends { items: (infer I)[] } ? I : any
export async function* sendMessage(
  message: string,
  userId: string,
  conversationId?: string
): AsyncGenerator<StreamEvent> {
  const response = await client.api.chat.messages.$post({
    json: { message, userId, conversationId }
  })

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    try {
      const errorData = await response.json() as any
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

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

export async function getConversation(conversationId: string): Promise<Conversation> {
  const res = await client.api.chat.conversations[':id'].$get({
    param: { id: conversationId }
  })
  if (!res.ok) throw new Error('Failed to fetch conversation')
  return await res.json() as unknown as Conversation
}

export async function listConversations(userId: string): Promise<{ conversations: ConversationListItem[] }> {
  const res = await client.api.chat.conversations.$get({
    query: { userId }
  })
  if (!res.ok) throw new Error('Failed to fetch conversations')
  return await res.json() as unknown as { conversations: ConversationListItem[] }
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const res = await client.api.chat.conversations[':id'].$delete({
    param: { id: conversationId }
  })
  if (!res.ok) throw new Error('Failed to delete conversation')
}

export async function listAgents(): Promise<{ agents: Agent[] }> {
  const res = await client.api.agents.$get()
  if (!res.ok) throw new Error('Failed to fetch agents')
  return await res.json() as unknown as { agents: Agent[] }
}

export async function getAgentCapabilities(agentType: string): Promise<Agent> {
  const res = await client.api.agents[':type'].capabilities.$get({
    param: { type: agentType }
  })
  if (!res.ok) throw new Error('Failed to fetch agent capabilities')
  return await res.json() as unknown as Agent
}

export async function listUsers(): Promise<{ data: User[] }> {
  const res = await client.api.users.$get()
  if (!res.ok) throw new Error('Failed to fetch users')
  return await res.json() as unknown as { data: User[] }
}

export async function listOrders(userId: string): Promise<{ data: Order[] }> {
  const res = await client.api.orders.$get({
    query: { userId }
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return await res.json() as unknown as { data: Order[] }
}

export async function listPayments(userId: string): Promise<{ data: Payment[] }> {
  const res = await client.api.payments.$get({
    query: { userId }
  })
  if (!res.ok) throw new Error('Failed to fetch payments')
  return await res.json() as unknown as { data: Payment[] }
}
