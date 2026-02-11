import { prisma } from '../db/client.js'
import {
  classifyIntent,
  supportAgent,
  orderAgent,
  billingAgent,
  type AgentType
} from '../agents/index.js'

export interface MessageData {
  conversationId: string
  role: string
  content: string
  agentType?: string
  metadata?: object
}

export class ChatService {
  /**
   * Create a new conversation for a user
   */
  static async createConversation(userId: string, title?: string) {
    // Ensure user exists (handles fresh DB or unknown userId from frontend)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@guest.local`,
        name: 'Guest User',
      },
    })

    return prisma.conversation.create({
      data: {
        userId,
        title,
      },
    })
  }

  /**
   * Get a conversation by ID
   */
  static async getConversation(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
    })
  }

  /**
   * Get a conversation with all its messages
   */
  static async getConversationWithMessages(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  /**
   * List all conversations for a user
   */
  static async listUserConversations(userId: string, limit: number = 20) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { messages: true },
        },
      },
    })
  }

  /**
   * Delete a conversation and its messages
   */
  static async deleteConversation(conversationId: string) {
    return prisma.conversation.delete({
      where: { id: conversationId },
    })
  }

  /**
   * Save a message to a conversation
   */
  static async saveMessage(data: MessageData) {
    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: data.role,
        content: data.content,
        agentType: data.agentType,
        metadata: data.metadata as any,
      },
    })

    // Update conversation title if it's the first user message
    if (data.role === 'user') {
      const messageCount = await prisma.message.count({
        where: { conversationId: data.conversationId, role: 'user' },
      })

      if (messageCount === 1) {
        // Set title to first 50 chars of first message
        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: { title: data.content.slice(0, 50) + (data.content.length > 50 ? '...' : '') },
        })
      }
    }

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    })

    return message
  }

  /**
   * Get recent messages for a conversation
   */
  static async getRecentMessages(conversationId: string, limit: number = 10) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return messages.reverse()
  }

  /**
   * Process a message and return streaming response
   */
  static async processMessage(
    message: string,
    userId: string,
    conversationId: string
  ) {
    // Get conversation history for context
    const history = await this.getRecentMessages(conversationId)
    const historyText = history.map(m => `${m.role}: ${m.content}`)
    const messageHistory = history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Classify intent with Router Agent
    const classification = await classifyIntent(message, historyText)

    // Select and run the appropriate agent
    let agentResult
    let agentType: AgentType = classification.agentType

    switch (classification.agentType) {
      case 'order':
        agentResult = await orderAgent.run(message, userId, conversationId, messageHistory)
        break
      case 'billing':
        agentResult = await billingAgent.run(message, userId, conversationId, messageHistory)
        break
      case 'support':
      default:
        agentResult = await supportAgent.run(message, userId, conversationId, messageHistory)
        agentType = 'support'
        break
    }

    return {
      stream: agentResult,
      agentType,
      classification,
    }
  }

  /**
   * Update conversation status
   */
  static async updateConversationStatus(conversationId: string, status: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    })
  }
}
