import React, { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ScrollArea } from './ui/scroll-area'
import { ChatMessage, TypingState } from '../hooks/useChat'

interface MessageListProps {
    messages: ChatMessage[]
    typing: TypingState
}

export function MessageList({ messages, typing }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, typing.isTyping])

    return (
        <ScrollArea className="flex-1">
            <div ref={scrollRef} className="flex flex-col gap-4 p-6">
                {messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                {typing.isTyping && (
                    <TypingIndicator agent={typing.agent} message={typing.message} />
                )}
            </div>
        </ScrollArea>
    )
}
