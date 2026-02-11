import { streamText, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { getModel } from './modelConfig.js'
import {
  getInvoiceDetails,
  checkRefundStatus,
  getPaymentHistory,
  requestRefund,
} from '../tools/billingTools.js'

// ─── System Prompt ───────────────────────────────────────────────────────────

const BILLING_SYSTEM_PROMPT = `You are a billing specialist for an e-commerce company.

Your responsibilities:
1. Help customers with invoice and payment inquiries
2. Check and explain refund statuses
3. Provide payment history information
4. Assist with refund requests

Guidelines:
- Be accurate with all financial information (amounts, dates, statuses)
- Always verify invoice numbers before providing details
- Explain payment statuses clearly (paid, pending, failed, refunded)
- For refunds, explain the process and typical processing times (5-7 business days)
- Be empathetic when dealing with payment issues or refund requests

Payment Methods: credit_card, paypal, bank_transfer
Refund Statuses: requested, processing, completed, rejected

Available tools:
- getInvoiceDetails: Get details for a specific invoice
- checkRefundStatus: Check the status of a refund
- getPaymentHistory: View payment history for the user
- requestRefund: Submit a refund request for an invoice`

// ─── Agent ───────────────────────────────────────────────────────────────────

export const billingAgent = {
  name: 'Billing Agent',
  type: 'billing' as const,
  description:
    'Handles payment issues, refunds, invoices, and billing inquiries',
  capabilities: [
    'Retrieve invoice details',
    'Check refund status',
    'View payment history',
    'Explain billing charges',
    'Process refund requests',
  ],

  async run(
    query: string,
    userId: string,
    conversationId: string,
    messageHistory: { role: 'user' | 'assistant'; content: string }[] = [],
  ) {
    return streamText({
      model: getModel(),
      system: BILLING_SYSTEM_PROMPT,
      messages: [...messageHistory, { role: 'user' as const, content: query }],
      tools: {
        getInvoiceDetails: tool({
          description:
            'Get complete details for a specific invoice including payment status and refund info',
          inputSchema: z.object({
            invoiceNumber: z
              .string()
              .describe('The invoice number (e.g., INV-2024-001)'),
          }),
          execute: async ({ invoiceNumber }) => {
            return await getInvoiceDetails(invoiceNumber)
          },
        }),

        checkRefundStatus: tool({
          description:
            'Check if a refund has been requested and its current status',
          inputSchema: z.object({
            invoiceNumber: z
              .string()
              .describe('The invoice number to check refund status for'),
          }),
          execute: async ({ invoiceNumber }) => {
            return await checkRefundStatus(invoiceNumber)
          },
        }),

        getPaymentHistory: tool({
          description:
            'Get a list of payment transactions for the current user',
          inputSchema: z.object({
            limit: z
              .number()
              .default(10)
              .describe('Number of recent payments to retrieve'),
          }),
          execute: async ({ limit }) => {
            return await getPaymentHistory(userId, limit)
          },
        }),

        requestRefund: tool({
          description: 'Submit a refund request for a paid invoice',
          inputSchema: z.object({
            invoiceNumber: z
              .string()
              .describe('The invoice number to request refund for'),
            amount: z
              .number()
              .optional()
              .describe(
                'Partial refund amount (leave empty for full refund)',
              ),
            reason: z
              .string()
              .optional()
              .describe('Reason for the refund request'),
          }),
          execute: async ({ invoiceNumber, amount, reason }) => {
            return await requestRefund(invoiceNumber, amount, reason)
          },
        }),
      },
      stopWhen: stepCountIs(5),
    })
  },
}
