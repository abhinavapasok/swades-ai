import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MessageBubble } from '../MessageBubble'
import { ChatMessage } from '../../hooks/useChat'

describe('MessageBubble', () => {
    it('should render user message correctly', () => {
        const userMessage: ChatMessage = {
            id: '1',
            role: 'user',
            content: 'Hello, I need help',
        }

        render(<MessageBubble message={userMessage} />)

        expect(screen.getByText('Hello, I need help')).toBeDefined()
    })

    it('should render assistant message with agent badge', () => {
        const assistantMessage: ChatMessage = {
            id: '2',
            role: 'assistant',
            content: 'I can help with that',
            agentType: 'support',
        }

        render(<MessageBubble message={assistantMessage} />)

        expect(screen.getByText('I can help with that')).toBeDefined()
        expect(screen.getByText(/Support/i)).toBeDefined()
    })

    it('should render reasoning when provided', () => {
        const message: ChatMessage = {
            id: '3',
            role: 'assistant',
            content: 'OK',
            reasoning: 'Analyzing user request...',
        }

        render(<MessageBubble message={message} />)

        expect(screen.getByText('Analyzing user request...')).toBeDefined()
    })
})
