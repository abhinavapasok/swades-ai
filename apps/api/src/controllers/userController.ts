import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserController {
    static async listUsers(c: Context) {
        try {
            const users = await prisma.user.findMany({
                orderBy: { name: 'asc' },
            })
            return c.json({ data: users })
        } catch (error) {
            console.error('Error listing users:', error)
            return c.json({ error: 'Failed to list users' }, 500)
        }
    }

    static async getUser(c: Context) {
        const id = c.req.param('id')
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            })
            if (!user) {
                return c.json({ error: 'User not found' }, 404)
            }
            return c.json({ data: user })
        } catch (error) {
            console.error('Error getting user:', error)
            return c.json({ error: 'Failed to get user' }, 500)
        }
    }
}
