import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChatInput } from '../ChatInput'

describe('ChatInput', () => {
    it('should call onSend when enter is pressed', () => {
        const onSend = vi.fn()
        const onChange = vi.fn()

        render(
            <ChatInput
                onSend={onSend}
                onChange={onChange}
                value="Hello"
                isLoading={false}
            />
        )

        const textarea = screen.getByPlaceholderText(/Send a message/i)
        fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

        expect(onSend).toHaveBeenCalledWith('Hello')
    })

    it('should disable textarea when isLoading is true', () => {
        render(
            <ChatInput
                onSend={() => { }}
                onChange={() => { }}
                value=""
                isLoading={true}
            />
        )

        // @ts-ignore - toBeDisabled exists at runtime but type is missing
        expect(textarea).toBeDisabled()
    })

    it('should call onChange when typing', () => {
        const onChange = vi.fn()

        render(
            <ChatInput
                onSend={() => { }}
                onChange={onChange}
                value=""
                isLoading={false}
            />
        )

        const textarea = screen.getByPlaceholderText(/Send a message/i)
        fireEvent.change(textarea, { target: { value: 'New message' } })

        expect(onChange).toHaveBeenCalledWith('New message')
    })
})
