import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class PaymentController {
    static async listPayments(c: Context) {
        const userId = c.req.query('userId')
        if (!userId) {
            return c.json({ error: 'userId is required' }, 400)
        }

        try {
            const payments = await prisma.payment.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            })
            return c.json({ data: payments })
        } catch (error) {
            console.error('Error listing payments:', error)
            return c.json({ error: 'Failed to list payments' }, 500)
        }
    }

    static async getPayment(c: Context) {
        const id = c.req.param('id')
        try {
            const payment = await prisma.payment.findUnique({
                where: { id },
            })
            if (!payment) {
                return c.json({ error: 'Payment not found' }, 404)
            }
            return c.json({ data: payment })
        } catch (error) {
            console.error('Error getting payment:', error)
            return c.json({ error: 'Failed to get payment' }, 500)
        }
    }
}
