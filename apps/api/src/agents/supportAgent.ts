import { streamText, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { getModel } from './modelConfig.js'
import {
  searchFAQs,
  getConversationHistory,
  getUserInfo,
} from '../tools/supportTools.js'

// ─── System Prompt ───────────────────────────────────────────────────────────

const SUPPORT_SYSTEM_PROMPT = `You are a friendly and helpful customer support agent for an e-commerce company.

Your responsibilities:
1. Answer general support questions clearly and concisely
2. Search FAQs to find relevant information for user queries
3. Use conversation history to maintain context
4. Provide accurate troubleshooting assistance

Guidelines:
- Be friendly, professional, and empathetic
- Keep responses concise but complete
- If you use a tool to find information, summarize the relevant parts for the user
- If you can't help with something, let the user know politely
- Never make up information — use the tools to find accurate data

Available tools:
- searchFAQs: Search the FAQ database for relevant answers
- getConversationHistory: Get previous messages for context
- getUserInfo: Get user account information`

// ─── Agent ───────────────────────────────────────────────────────────────────

export const supportAgent = {
  name: 'Support Agent',
  type: 'support' as const,
  description:
    'Handles general support inquiries, FAQs, and troubleshooting',
  capabilities: [
    'Answer general support questions',
    'Search FAQs for relevant information',
    'Access conversation history for context',
    'Troubleshoot common issues',
    'Provide account information',
  ],

  async run(
    query: string,
    userId: string,
    conversationId: string,
    messageHistory: { role: 'user' | 'assistant'; content: string }[] = [],
  ) {
    return streamText({
      model: getModel(),
      system: SUPPORT_SYSTEM_PROMPT,
      messages: [...messageHistory, { role: 'user' as const, content: query }],
      tools: {
        searchFAQs: tool({
          description:
            'Search the FAQ database for answers to common questions',
          inputSchema: z.object({
            query: z
              .string()
              .describe('The search query to find relevant FAQs'),
            category: z
              .string()
              .optional()
              .describe(
                'Optional category filter: account, orders, returns, shipping, payment, support',
              ),
          }),
          execute: async ({ query, category }) => {
            return await searchFAQs(query, category)
          },
        }),

        getConversationHistory: tool({
          description:
            'Get previous messages from the current conversation for context',
          inputSchema: z.object({
            limit: z
              .number()
              .default(10)
              .describe('Number of recent messages to retrieve'),
          }),
          execute: async ({ limit }) => {
            return await getConversationHistory(conversationId, limit)
          },
        }),

        getUserInfo: tool({
          description:
            'Get information about the current user account',
          inputSchema: z.object({}),
          execute: async () => {
            return await getUserInfo(userId)
          },
        }),
      },
      stopWhen: stepCountIs(5),
    })
  },
}
