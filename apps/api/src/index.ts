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

// Create Hono app
const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: true,
}))
app.use('*', errorHandler())

// Rate limiting for API routes
app.use('/api/*', rateLimiter(100, 60 * 1000)) // 100 requests per minute

// API Routes
app.route('/api/chat', chatRoutes)
app.route('/api/agents', agentRoutes)
app.route('/api/health', healthRoutes)
app.route('/api/users', userRoutes)
app.route('/api/orders', orderRoutes)
app.route('/api/payments', paymentRoutes)

// Root route
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

// 404 handler
app.notFound((c) => {
  return c.json({
    error: {
      message: 'Not found',
      code: 'NOT_FOUND',
    },
  }, 404)
})

// Start server
const port = parseInt(process.env.PORT || '3001', 10)

console.log(`🚀 Server starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

// Export for type inference (Hono RPC)
export type AppType = typeof app
