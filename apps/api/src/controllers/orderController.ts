import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class OrderController {
    static async listOrders(c: Context) {
        const userId = c.req.query('userId')
        if (!userId) {
            return c.json({ error: 'userId is required' }, 400)
        }

        try {
            const orders = await prisma.order.findMany({
                where: { userId },
                include: { items: true },
                orderBy: { createdAt: 'desc' },
            })
            return c.json({ data: orders })
        } catch (error) {
            console.error('Error listing orders:', error)
            return c.json({ error: 'Failed to list orders' }, 500)
        }
    }

    static async getOrder(c: Context) {
        const id = c.req.param('id')
        try {
            const order = await prisma.order.findUnique({
                where: { id },
                include: { items: true },
            })
            if (!order) {
                return c.json({ error: 'Order not found' }, 404)
            }
            return c.json({ data: order })
        } catch (error) {
            console.error('Error getting order:', error)
            return c.json({ error: 'Failed to get order' }, 500)
        }
    }
}
