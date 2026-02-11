import { prisma } from '../db/client.js'

/**
 * Search FAQs by query and optional category
 */
export async function searchFAQs(query: string, category?: string) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
  
  const faqs = await prisma.fAQ.findMany({
    where: {
      ...(category && { category }),
      OR: [
        {
          question: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          answer: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          keywords: {
            hasSome: searchTerms,
          },
        },
      ],
    },
    take: 5,
  })

  if (faqs.length === 0) {
    return {
      found: false,
      message: 'No FAQs found matching your query.',
      suggestions: 'Try rephrasing your question or ask for general help.',
    }
  }

  return {
    found: true,
    count: faqs.length,
    results: faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    })),
  }
}

/**
 * Get conversation history for context
 */
export async function getConversationHistory(conversationId: string, limit: number = 10) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      role: true,
      content: true,
      agentType: true,
      createdAt: true,
    },
  })

  return {
    conversationId,
    messageCount: messages.length,
    messages: messages.reverse().map(msg => ({
      role: msg.role,
      content: msg.content,
      agentType: msg.agentType,
      timestamp: msg.createdAt.toISOString(),
    })),
  }
}

/**
 * Get user information for personalized support
 */
export async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          conversations: true,
        },
      },
    },
  })

  if (!user) {
    return { found: false, message: 'User not found' }
  }

  return {
    found: true,
    name: user.name,
    email: user.email,
    memberSince: user.createdAt.toISOString(),
    totalOrders: user._count.orders,
    totalConversations: user._count.conversations,
  }
}
