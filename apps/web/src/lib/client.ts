import { hc } from 'hono/client'
import type { AppType } from '@swadesai/api'

const client = hc<AppType>(import.meta.env.VITE_API_URL || '/')

export default client
