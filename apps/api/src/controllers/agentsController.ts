import { Context } from 'hono'
import { getAgentInfo } from '../agents/index.js'

export class AgentsController {
  /**
   * GET /api/agents
   * List all available agents
   */
  static listAgents = async (c: Context) => {
    const agents = getAgentInfo()
    return c.json({ agents })
  }

  /**
   * GET /api/agents/:type/capabilities
   * Get capabilities for a specific agent type
   */
  static getCapabilities = async (c: Context) => {
    const type = c.req.param('type')
    const agents = getAgentInfo()
    
    const agent = agents.find(a => a.type === type)
    
    if (!agent) {
      return c.json(
        { error: { message: `Agent type '${type}' not found` } },
        404
      )
    }
    
    return c.json({
      type: agent.type,
      name: agent.name,
      description: agent.description,
      capabilities: agent.capabilities,
    })
  }
}
