import React, { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ChatMessage, TypingState } from '../hooks/useChat'

interface MessageListProps {
    messages: ChatMessage[]
    typing: TypingState
}

export function MessageList({ messages, typing }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, typing.isTyping])

    return (
        <div
            ref={scrollRef}
            className="flex-1 h-full overflow-y-auto scrollbar-thin"
        >
            <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
                {messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                {typing.isTyping && (
                    <TypingIndicator agent={typing.agent} message={typing.message} />
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}
