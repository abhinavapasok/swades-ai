import { streamText, tool, stepCountIs, type StreamTextResult } from 'ai'
import { z } from 'zod'
import { getModel } from '../lib/modelConfig.js'
import {
  fetchOrderDetails,
  checkDeliveryStatus,
  getOrderHistory,
  cancelOrder,
} from '../tools/orderTools.js'

// ─── System Prompt ───────────────────────────────────────────────────────────

const ORDER_SYSTEM_PROMPT = `You are an order management specialist for an e-commerce company.

Your responsibilities:
1. Help customers check their order status
2. Provide tracking information and delivery updates
3. Assist with order modifications and cancellations
4. Look up order history

Guidelines:
- Always extract order numbers from the user's message (format: ORD-YYYY-NNN)
- When a user mentions an order number, use it directly in tool calls
- Be precise with dates, tracking numbers, and amounts
- Explain order statuses clearly (pending, processing, shipped, delivered, cancelled)
- If an order can't be found, ask the user to double-check the order number
- For cancellations, explain the policy (orders can only be cancelled before shipping)

Available tools:
- fetchOrderDetails: Get complete order details (items, status, shipping info)
- checkDeliveryStatus: Get current shipping/delivery status
- getOrderHistory: View recent orders for the user
- cancelOrder: Cancel an order if eligible

Example: User says "Track my order ORD-2024-002"
→ Call checkDeliveryStatus with orderNumber "ORD-2024-002"
→ Summarize the result for the user`

// ─── Tool Definitions ────────────────────────────────────────────────────────

const orderTools = {
  fetchOrderDetails: tool({
    description:
      'Get complete details for a specific order including items, status, and shipping info',
    inputSchema: z.object({
      orderNumber: z
        .string()
        .describe('The order number (e.g., ORD-2024-001)'),
    }),
    execute: async ({ orderNumber }) => {
      return await fetchOrderDetails(orderNumber)
    },
  }),

  checkDeliveryStatus: tool({
    description:
      'Check the current shipping and delivery status of an order',
    inputSchema: z.object({
      orderNumber: z
        .string()
        .describe('The order number to check status for'),
    }),
    execute: async ({ orderNumber }) => {
      return await checkDeliveryStatus(orderNumber)
    },
  }),

  getOrderHistory: tool({
    description: 'Get a list of recent orders for the current user',
    inputSchema: z.object({
      limit: z
        .number()
        .default(5)
        .describe('Number of recent orders to retrieve'),
    }),
    execute: async ({ limit }) => {
      // userId is injected at runtime via closure in the agent's run()
      return { message: 'Use via agent run() for userId injection', limit }
    },
  }),

  cancelOrder: tool({
    description: 'Cancel an order if it has not been shipped yet',
    inputSchema: z.object({
      orderNumber: z.string().describe('The order number to cancel'),
    }),
    execute: async ({ orderNumber }) => {
      return await cancelOrder(orderNumber)
    },
  }),
}

// ─── Agent ───────────────────────────────────────────────────────────────────

export const orderAgent = {
  name: 'Order Agent',
  type: 'order' as const,
  description:
    'Handles order status, tracking, modifications, and cancellations',
  capabilities: [
    'Fetch order details by order number',
    'Check real-time delivery status',
    'View order history for a user',
    'Provide tracking information',
    'Process order cancellations',
  ],

  async run(
    query: string,
    userId: string,
    conversationId: string,
    messageHistory: { role: 'user' | 'assistant'; content: string }[] = [],
  ): Promise<StreamTextResult<any, any>> {
    return streamText({
      model: getModel(),
      system: ORDER_SYSTEM_PROMPT,
      messages: [...messageHistory, { role: 'user' as const, content: query }],
      tools: {
        ...orderTools,
        // Override getOrderHistory to inject userId via closure
        getOrderHistory: tool({
          description: 'Get a list of recent orders for the current user',
          inputSchema: z.object({
            limit: z
              .number()
              .default(5)
              .describe('Number of recent orders to retrieve'),
          }),
          execute: async ({ limit }) => {
            return await getOrderHistory(userId, limit)
          },
        }),
      },
      stopWhen: stepCountIs(5),
    })
  },
}
