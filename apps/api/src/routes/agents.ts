import { Hono } from 'hono'
import { AgentsController } from '../controllers/agentsController.js'

export const agentRoutes = new Hono()

// GET /api/agents - List available agents
agentRoutes.get('/', AgentsController.listAgents)

// GET /api/agents/:type/capabilities - Get agent capabilities
agentRoutes.get('/:type/capabilities', AgentsController.getCapabilities)
