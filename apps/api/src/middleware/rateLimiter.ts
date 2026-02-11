import { Context, Next } from 'hono'

interface RateLimitRecord {
  count: number
  resetTime: number
}

const requestCounts = new Map<string, RateLimitRecord>()
const RATE_LIMIT = 100 // requests per window
const WINDOW_MS = 60 * 1000 // 1 minute

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key)
    }
  }
}, WINDOW_MS)

export const rateLimiter = (limit: number = RATE_LIMIT, windowMs: number = WINDOW_MS) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 
               c.req.header('x-real-ip') || 
               'unknown'
    
    const now = Date.now()
    const record = requestCounts.get(ip)

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    } else if (record.count >= limit) {
      c.header('X-RateLimit-Limit', limit.toString())
      c.header('X-RateLimit-Remaining', '0')
      c.header('X-RateLimit-Reset', record.resetTime.toString())
      c.header('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString())
      
      return c.json(
        {
          error: {
            message: 'Too many requests. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
          },
        },
        429
      )
    } else {
      record.count++
    }

    // Add rate limit headers to response
    const currentRecord = requestCounts.get(ip)!
    c.header('X-RateLimit-Limit', limit.toString())
    c.header('X-RateLimit-Remaining', Math.max(0, limit - currentRecord.count).toString())
    c.header('X-RateLimit-Reset', currentRecord.resetTime.toString())

    await next()
  }
}
