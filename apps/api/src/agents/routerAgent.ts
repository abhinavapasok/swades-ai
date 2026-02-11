import { generateObject } from 'ai'
import { z } from 'zod'
import { getModel } from './modelConfig.js'

export type AgentType = 'support' | 'order' | 'billing'

export interface ClassificationResult {
  agentType: AgentType
  confidence: number
  reasoning: string
}

const classificationSchema = z.object({
  agentType: z.enum(['support', 'order', 'billing']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

const CLASSIFICATION_SYSTEM_PROMPT = `You are a customer support router. Analyze the user's query and classify it into one of these categories:

1. SUPPORT - General inquiries, FAQs, troubleshooting, how-to questions, account issues, password resets, general help
2. ORDER - Order status, tracking, modifications, cancellations, delivery inquiries, shipping questions, order history
3. BILLING - Payment issues, refunds, invoices, subscription queries, pricing, charges, payment methods

Consider the conversation context when making your decision. If the user follows up on a previous topic, maintain context.

Provide:
- agentType: "support", "order", or "billing"
- confidence: 0.0-1.0 (how confident you are in this classification)
- reasoning: Brief explanation of why you chose this classification`

/**
 * Classify user intent and determine which agent should handle the query
 */
export async function classifyIntent(
  query: string,
  conversationHistory: string[] = []
): Promise<ClassificationResult> {
  const contextText = conversationHistory.length > 0
    ? `\n\nPrevious conversation context:\n${conversationHistory.slice(-5).join('\n')}`
    : ''

  try {
    const result = await generateObject({
      model: getModel(),
      schema: classificationSchema,
      system: CLASSIFICATION_SYSTEM_PROMPT,
      prompt: `${contextText}\n\nCurrent user query: "${query}"`,
    })

    return result.object
  } catch (error) {
    console.error('Classification error:', error)
    // Default to support agent on classification failure
    return {
      agentType: 'support',
      confidence: 0.5,
      reasoning: 'Classification failed, defaulting to support agent',
    }
  }
}

/**
 * Get information about all available agents
 */
export function getAgentInfo() {
  return [
    {
      type: 'router',
      name: 'Router Agent',
      description: 'Analyzes incoming queries and delegates to specialized agents',
      capabilities: [
        'Intent classification',
        'Query routing',
        'Context analysis',
        'Fallback handling',
      ],
    },
    {
      type: 'support',
      name: 'Support Agent',
      description: 'Handles general support inquiries and FAQs',
      capabilities: [
        'Answer general questions',
        'Search FAQs',
        'Access conversation history',
        'Troubleshoot issues',
      ],
    },
    {
      type: 'order',
      name: 'Order Agent',
      description: 'Handles order-related queries',
      capabilities: [
        'Fetch order details',
        'Check delivery status',
        'View order history',
        'Track shipments',
      ],
    },
    {
      type: 'billing',
      name: 'Billing Agent',
      description: 'Handles payment and billing inquiries',
      capabilities: [
        'Get invoice details',
        'Check refund status',
        'View payment history',
        'Explain charges',
      ],
    },
  ]
}
