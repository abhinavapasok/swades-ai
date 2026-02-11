import { Context } from 'hono'
import { streamSSE } from 'hono/streaming'
import { ChatService } from '../services/chatService.js'

export class ChatController {
  /**
   * POST /api/chat/messages
   * Send a new message and stream the response
   */
  static sendMessage = async (c: Context) => {
    const body = await c.req.json()
    const { conversationId, message, userId } = body

    if (!message || !userId) {
      return c.json({ error: { message: 'Message and userId are required' } }, 400)
    }

    // Create or get conversation
    let conversation
    if (conversationId) {
      conversation = await ChatService.getConversation(conversationId)
      if (!conversation) {
        return c.json({ error: { message: 'Conversation not found' } }, 404)
      }
    } else {
      conversation = await ChatService.createConversation(userId)
    }

    // Save user message
    await ChatService.saveMessage({
      conversationId: conversation.id,
      role: 'user',
      content: message,
    })

    // Process with agents and stream response
    return streamSSE(c, async (stream) => {
      try {
        // Send typing indicator with router agent
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'typing',
            agent: 'router',
            message: 'Analyzing your request...'
          }),
        })

        // Process message
        const result = await ChatService.processMessage(
          message,
          userId,
          conversation.id
        )

        // Send agent assignment
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'agent',
            agent: result.agentType,
            reasoning: result.classification.reasoning,
            confidence: result.classification.confidence,
          }),
        })

        // Send typing indicator with assigned agent
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'typing',
            agent: result.agentType,
            message: 'Thinking...',
          }),
        })

        // Stream the response
        let fullContent = ''

        for await (const chunk of result.stream.textStream) {
          fullContent += chunk
          await stream.writeSSE({
            data: JSON.stringify({
              type: 'content',
              text: chunk,
            }),
          })
        }

        // Save assistant message
        await ChatService.saveMessage({
          conversationId: conversation.id,
          role: 'assistant',
          content: fullContent,
          agentType: result.agentType,
          metadata: {
            classification: result.classification,
          },
        })

        // Send completion
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'done',
            conversationId: conversation.id,
            agentType: result.agentType,
          }),
        })
      } catch (error) {
        console.error('Streaming error:', error)
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'An error occurred',
          }),
        })
      }
    })
  }

  /**
   * GET /api/chat/conversations/:id
   * Get a conversation with all messages
   */
  static getConversation = async (c: Context) => {
    const id = c.req.param('id')

    const conversation = await ChatService.getConversationWithMessages(id)

    if (!conversation) {
      return c.json({ error: { message: 'Conversation not found' } }, 404)
    }

    return c.json(conversation)
  }

  /**
   * GET /api/chat/conversations
   * List all conversations for a user
   */
  static listConversations = async (c: Context) => {
    const userId = c.req.query('userId')

    if (!userId) {
      return c.json({ error: { message: 'userId query parameter is required' } }, 400)
    }

    const conversations = await ChatService.listUserConversations(userId)

    return c.json({
      conversations: conversations.map((conv: any) => ({
        id: conv.id,
        title: conv.title,
        status: conv.status,
        messageCount: conv._count.messages,
        lastMessage: conv.messages[0]?.content,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      })),
    })
  }

  /**
   * DELETE /api/chat/conversations/:id
   * Delete a conversation
   */
  static deleteConversation = async (c: Context) => {
    const id = c.req.param('id')

    try {
      await ChatService.deleteConversation(id)
      return c.json({ success: true, message: 'Conversation deleted' })
    } catch (error) {
      return c.json({ error: { message: 'Conversation not found' } }, 404)
    }
  }
}
