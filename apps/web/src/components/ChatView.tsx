import React from 'react'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { EmptyState } from './EmptyState'
import { ChatMessage, TypingState } from '../hooks/useChat'

interface ChatViewProps {
    messages: ChatMessage[]
    typing: TypingState
    error: string | null
    inputValue: string
    onInputChange: (value: string) => void
    onSendMessage: (content: string) => void
    isLoading: boolean
    onSuggestionClick: (suggestion: string) => void
}

export function ChatView({
    messages,
    typing,
    error,
    inputValue,
    onInputChange,
    onSendMessage,
    isLoading,
    onSuggestionClick
}: ChatViewProps) {
    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
                {messages.length === 0 ? (
                    <EmptyState onSuggestionClick={onSuggestionClick} />
                ) : (
                    <MessageList messages={messages} typing={typing} />
                )}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="px-6 pb-2 animate-in slide-in-from-bottom-2">
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center gap-3 backdrop-blur-sm">
                        <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {/* Chat Input Container */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
                <ChatInput
                    value={inputValue}
                    onChange={onInputChange}
                    onSend={onSendMessage}
                    isLoading={isLoading}
                    placeholder="How can SwadesAI help you today?"
                />
            </div>
        </div>
    )
}
