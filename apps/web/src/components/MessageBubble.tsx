import React from 'react'
import ReactMarkdown from 'react-markdown'
import { User, Bot, ShoppingCart, CreditCard, HelpCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ChatMessage } from '../hooks/useChat'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
    message: ChatMessage
}

const agentConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    support: {
        icon: <HelpCircle className="h-3.5 w-3.5" />,
        label: 'Support Agent',
        color: 'text-green-500'
    },
    order: {
        icon: <ShoppingCart className="h-3.5 w-3.5" />,
        label: 'Order Agent',
        color: 'text-blue-500'
    },
    billing: {
        icon: <CreditCard className="h-3.5 w-3.5" />,
        label: 'Billing Agent',
        color: 'text-pink-500'
    },
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user'
    const agentType = message.agentType || 'support'
    const agent = agentConfig[agentType]

    return (
        <div className={cn(
            "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "ml-auto flex-row-reverse" : "mr-auto"
        )}>
            <Avatar className={cn(
                "h-9 w-9 shrink-0",
                isUser && "bg-gradient-to-br from-primary to-secondary"
            )}>
                <AvatarFallback className={cn(
                    isUser ? "bg-transparent text-primary-foreground" : cn("bg-muted", agent?.color)
                )}>
                    {isUser ? (
                        <User className="h-4 w-4" />
                    ) : (
                        agent?.icon || <Bot className="h-4 w-4" />
                    )}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "rounded-lg px-4 py-2.5 shadow-sm",
                isUser
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                    : "border border-border bg-card"
            )}>
                {!isUser && message.agentType && (
                    <div className={cn(
                        "mb-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                        "bg-muted/50",
                        agent?.color
                    )}>
                        {agent?.icon}
                        <span>{agent?.label}</span>
                    </div>
                )}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    {isUser ? (
                        <p className="m-0 whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown>
                                {message.content || (message.isStreaming ? '...' : '')}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
