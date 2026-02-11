import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { chatRoutes } from './routes/chat.js'
import { agentRoutes } from './routes/agents.js'
import { healthRoutes } from './routes/health.js'
import { userRoutes } from './routes/users.js'
import { orderRoutes } from './routes/orders.js'
import { paymentRoutes } from './routes/payments.js'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigin = process.env.ALLOWED_ORIGIN
    if (!allowedOrigin || allowedOrigin === '*') return '*'
    return allowedOrigin.split(',').includes(origin) ? origin : allowedOrigin.split(',')[0]
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: true,
}))
app.use('*', errorHandler())

app.use('/api/*', rateLimiter(100, 60 * 1000))

const routes = app
  .route('/api/chat', chatRoutes)
  .route('/api/agents', agentRoutes)
  .route('/api/health', healthRoutes)
  .route('/api/users', userRoutes)
  .route('/api/orders', orderRoutes)
  .route('/api/payments', paymentRoutes)

app.get('/', (c) => {
  return c.json({
    name: 'SwadesAI Customer Support API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      agents: '/api/agents',
      health: '/api/health',
    },
  })
})

app.notFound((c) => {
  return c.json({
    error: {
      message: 'Not found',
      code: 'NOT_FOUND',
    },
  }, 404)
})

const port = parseInt(process.env.PORT || '3001', 10)

console.log(`🚀 Server starting on port ${port}`)

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0'
})

// Export for type inference (Hono RPC)
export type AppType = typeof routes
