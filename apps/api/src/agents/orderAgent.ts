import { streamText, tool } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { 
  fetchOrderDetails, 
  checkDeliveryStatus, 
  getOrderHistory,
  cancelOrder 
} from '../tools/orderTools.js'

const ORDER_SYSTEM_PROMPT = `You are an order management specialist for an e-commerce company. Your role is to:

1. Help customers check their order status
2. Provide tracking information and delivery updates
3. Assist with order modifications and cancellations
4. Look up order history

Guidelines:
- **IMPORTANT**: Always extract order numbers from the user's message (format: ORD-YYYY-NNN)
- When a user mentions an order number in their query, use it directly in tool calls
- Always verify order numbers before providing information
- Be precise with dates, tracking numbers, and amounts
- Explain order statuses clearly (pending, processing, shipped, delivered, cancelled)
- If an order can't be found, ask the user to double-check the order number
- For cancellations, explain the policy (orders can only be cancelled before shipping)

You have access to tools:
- fetchOrderDetails: Get complete details for a specific order (requires orderNumber)
- checkDeliveryStatus: Get current shipping/delivery status (requires orderNumber)
- getOrderHistory: View recent orders for the user (no orderNumber needed)
- cancelOrder: Cancel an order if eligible (requires orderNumber)

Example interaction:
User: "Track my order ORD-2024-002"
You should: Call checkDeliveryStatus with orderNumber: "ORD-2024-002"`

export const orderAgent = {
  name: 'Order Agent',
  type: 'order' as const,
  description: 'Handles order status, tracking, modifications, and cancellations',
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
    messageHistory: { role: 'user' | 'assistant'; content: string }[] = []
  ) {
    return streamText({
      model: google('gemini-3-flash-preview'),
      system: ORDER_SYSTEM_PROMPT,
      messages: [
        ...messageHistory,
        { role: 'user' as const, content: query },
      ],
      tools: {
        fetchOrderDetails: tool({
          description: 'Get complete details for a specific order including items, status, and shipping info',
          parameters: z.object({
            orderNumber: z.string().describe('The order number (e.g., ORD-2024-001)'),
          }),
          execute: async ({ orderNumber }) => {
            return await fetchOrderDetails(orderNumber)
          },
        }),
        checkDeliveryStatus: tool({
          description: 'Check the current shipping and delivery status of an order',
          parameters: z.object({
            orderNumber: z.string().describe('The order number to check status for'),
          }),
          execute: async ({ orderNumber }) => {
            return await checkDeliveryStatus(orderNumber)
          },
        }),
        getOrderHistory: tool({
          description: 'Get a list of recent orders for the current user',
          parameters: z.object({
            limit: z.number().default(5).describe('Number of recent orders to retrieve'),
          }),
          execute: async ({ limit }) => {
            return await getOrderHistory(userId, limit)
          },
        }),
        cancelOrder: tool({
          description: 'Cancel an order if it has not been shipped yet',
          parameters: z.object({
            orderNumber: z.string().describe('The order number to cancel'),
          }),
          execute: async ({ orderNumber }) => {
            return await cancelOrder(orderNumber)
          },
        }),
      },
      maxSteps: 5,
    })
  },
}
