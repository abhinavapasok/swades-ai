import { Hono } from 'hono'
import { AgentsController } from '../controllers/agentsController.js'

const app = new Hono()

export const agentRoutes = app
    .get('/', AgentsController.listAgents)
    .get('/:type/capabilities', AgentsController.getCapabilities)
