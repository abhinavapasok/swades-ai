import React from 'react'

interface TypingIndicatorProps {
    agent?: string
    message?: string
}

const agentLabels: Record<string, string> = {
    router: 'Analyzing your request',
    support: 'Support Agent is thinking',
    order: 'Order Agent is thinking',
    billing: 'Billing Agent is thinking',
}

export function TypingIndicator({ agent, message }: TypingIndicatorProps) {
    const label = message || (agent && agentLabels[agent]) || 'AI is thinking'

    return (
        <div className="flex items-center gap-3 px-4 py-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.4s' }}
                    />
                ))}
            </div>
            <span className="text-sm italic text-muted-foreground">{label}...</span>
        </div>
    )
}
