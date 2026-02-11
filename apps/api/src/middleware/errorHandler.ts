import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler = () => {
  return async (c: Context, next: Next) => {
    try {
      await next()
    } catch (error) {
      console.error('Error:', error)

      if (error instanceof AppError) {
        return c.json(
          {
            error: {
              message: error.message,
              code: error.code,
            },
          },
          error.statusCode as 400 | 401 | 403 | 404 | 500
        )
      }

      if (error instanceof HTTPException) {
        return c.json(
          {
            error: {
              message: error.message,
            },
          },
          error.status
        )
      }

      // Handle Prisma errors
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; message: string }
        if (prismaError.code === 'P2025') {
          return c.json(
            {
              error: {
                message: 'Record not found',
                code: 'NOT_FOUND',
              },
            },
            404
          )
        }
      }

      return c.json(
        {
          error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
          },
        },
        500
      )
    }
  }
}
