import { prisma } from '../db/client.js'

/**
 * Get invoice/payment details by invoice number
 */
export async function getInvoiceDetails(invoiceNumber: string) {
  const payment = await prisma.payment.findUnique({
    where: { invoiceNumber },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  })

  if (!payment) {
    return {
      found: false,
      message: `Invoice ${invoiceNumber} not found. Please check the invoice number and try again.`,
    }
  }

  return {
    found: true,
    invoiceNumber: payment.invoiceNumber,
    amount: payment.amount.toString(),
    status: payment.status,
    paymentMethod: payment.paymentMethod,
    refundStatus: payment.refundStatus,
    refundAmount: payment.refundAmount?.toString(),
    createdAt: payment.createdAt.toISOString().split('T')[0],
    customerName: payment.user.name,
    customerEmail: payment.user.email,
  }
}

/**
 * Check refund status for an invoice
 */
export async function checkRefundStatus(invoiceNumber: string) {
  const payment = await prisma.payment.findUnique({
    where: { invoiceNumber },
    select: {
      invoiceNumber: true,
      amount: true,
      status: true,
      refundStatus: true,
      refundAmount: true,
      updatedAt: true,
    },
  })

  if (!payment) {
    return {
      found: false,
      message: `Invoice ${invoiceNumber} not found.`,
    }
  }

  if (!payment.refundStatus) {
    return {
      found: true,
      invoiceNumber: payment.invoiceNumber,
      hasRefund: false,
      message: 'No refund has been requested for this invoice.',
      currentStatus: payment.status,
    }
  }

  const refundMessages: Record<string, string> = {
    requested: 'Your refund request is being reviewed.',
    processing: 'Your refund is being processed.',
    completed: 'Your refund has been completed.',
    rejected: 'Your refund request was rejected.',
  }

  return {
    found: true,
    invoiceNumber: payment.invoiceNumber,
    hasRefund: true,
    originalAmount: payment.amount.toString(),
    refundAmount: payment.refundAmount?.toString(),
    refundStatus: payment.refundStatus,
    refundMessage: refundMessages[payment.refundStatus] || 'Status unknown',
    lastUpdated: payment.updatedAt.toISOString(),
  }
}

/**
 * Get payment history for a user
 */
export async function getPaymentHistory(userId: string, limit: number = 10) {
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  if (payments.length === 0) {
    return {
      found: false,
      message: 'No payment history found for this user.',
    }
  }

  const totalPaid = payments
    .filter((p: any) => p.status === 'paid')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

  const totalRefunded = payments
    .filter((p: any) => p.refundStatus === 'completed')
    .reduce((sum: number, p: any) => sum + Number(p.refundAmount || 0), 0)

  return {
    found: true,
    totalPayments: payments.length,
    totalPaidAmount: totalPaid.toFixed(2),
    totalRefundedAmount: totalRefunded.toFixed(2),
    payments: payments.map((payment: any) => ({
      invoiceNumber: payment.invoiceNumber,
      amount: payment.amount.toString(),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      refundStatus: payment.refundStatus,
      createdAt: payment.createdAt.toISOString().split('T')[0],
    })),
  }
}

/**
 * Request a refund for an invoice
 */
export async function requestRefund(invoiceNumber: string, amount?: number, reason?: string) {
  const payment = await prisma.payment.findUnique({
    where: { invoiceNumber },
  })

  if (!payment) {
    return {
      success: false,
      message: `Invoice ${invoiceNumber} not found.`,
    }
  }

  if (payment.status !== 'paid') {
    return {
      success: false,
      message: `Cannot request refund. Invoice status: ${payment.status}`,
    }
  }

  if (payment.refundStatus) {
    return {
      success: false,
      message: `A refund has already been ${payment.refundStatus} for this invoice.`,
      currentRefundStatus: payment.refundStatus,
    }
  }

  const refundAmount = amount || Number(payment.amount)
  if (refundAmount > Number(payment.amount)) {
    return {
      success: false,
      message: 'Refund amount cannot exceed the original payment amount.',
    }
  }

  await prisma.payment.update({
    where: { invoiceNumber },
    data: {
      refundStatus: 'requested',
      refundAmount: refundAmount,
    },
  })

  return {
    success: true,
    message: 'Refund request submitted successfully.',
    invoiceNumber,
    refundAmount: refundAmount.toFixed(2),
    estimatedProcessingTime: '5-7 business days',
  }
}
