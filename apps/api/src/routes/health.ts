import { Hono } from 'hono'
import { prisma } from '../db/client.js'

export const healthRoutes = new Hono()

// GET /api/health - Health check
healthRoutes.get('/', async (c) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'up',
      database: 'unknown',
    },
  }

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    healthCheck.services.database = 'up'
  } catch (error) {
    healthCheck.services.database = 'down'
    healthCheck.status = 'degraded'
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503
  return c.json(healthCheck, statusCode)
})
