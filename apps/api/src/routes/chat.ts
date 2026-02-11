import { Hono } from 'hono'
import { ChatController } from '../controllers/chatController.js'

const app = new Hono()

export const chatRoutes = app
    .post('/messages', ChatController.sendMessage)
    .get('/conversations/:id', ChatController.getConversation)
    .get('/conversations', ChatController.listConversations)
    .delete('/conversations/:id', ChatController.deleteConversation)
