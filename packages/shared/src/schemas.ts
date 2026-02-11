import { z } from 'zod';
import { AGENT_TYPES } from './constants';

// Agent types schema
export const AgentTypeSchema = z.enum(AGENT_TYPES);

// Classification result schema
export const ClassificationResultSchema = z.object({
    agentType: AgentTypeSchema,
    confidence: z.number().min(0).max(1),
    reasoning: z.string(),
});

// Stream event schema
export const StreamEventSchema = z.object({
    type: z.enum(['typing', 'agent', 'content', 'done', 'error']),
    agent: z.string().optional(),
    text: z.string().optional(),
    message: z.string().optional(),
    conversationId: z.string().optional(),
    reasoning: z.string().optional(),
    confidence: z.number().optional(),
});
