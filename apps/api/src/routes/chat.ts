import { Hono } from 'hono'
import { ChatController } from '../controllers/chatController.js'

export const chatRoutes = new Hono()

// POST /api/chat/messages - Send new message (streaming)
chatRoutes.post('/messages', ChatController.sendMessage)

// GET /api/chat/conversations/:id - Get conversation history
chatRoutes.get('/conversations/:id', ChatController.getConversation)

// GET /api/chat/conversations - List user conversations
chatRoutes.get('/conversations', ChatController.listConversations)

// DELETE /api/chat/conversations/:id - Delete conversation
chatRoutes.delete('/conversations/:id', ChatController.deleteConversation)
