import ReactMarkdown from 'react-markdown'
import { Bot } from 'lucide-react'
import { ChatMessage, TypingState } from '../hooks/useChat'
import { AgentBadge } from './AgentBadge'


interface MessageBubbleProps {
    message: ChatMessage
    typing?: TypingState
}

export function MessageBubble({ message, typing }: MessageBubbleProps) {
    const isUser = message.role === 'user'
    const agentType = message.agentType || 'support'

    if (isUser) {
        return (
            <div className="flex justify-end animate-fade-up px-4">
                <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground shadow-md shadow-primary/10">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex gap-4 animate-fade-up px-4">
            {/* AI Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 mt-1 shadow-sm">
                <Bot className="h-4 w-4 text-primary" />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0 space-y-2">
                {/* Agent Label */}
                {message.agentType && (
                    <div className="flex items-center gap-2">
                        <AgentBadge type={agentType} />
                    </div>
                )}

                {/* Message Text */}
                <div className="prose-chat text-foreground bg-accent/5 rounded-2xl p-4 border border-border/50 backdrop-blur-sm shadow-sm">
                    {message.content ? (
                        <ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {typing?.isTyping && typing.message && (
                                <span className="text-xs text-muted-foreground animate-pulse">
                                    {typing.message}...
                                </span>
                            )}
                            <div className="flex gap-1 items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
