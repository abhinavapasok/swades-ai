import { useState, useEffect } from 'react'

interface TypingIndicatorProps {
    agent?: string
    message?: string
}

const agentLabels: Record<string, string> = {
    router: 'Analyzing your request',
    support: 'Support is thinking',
    order: 'Order agent is thinking',
    billing: 'Billing agent is thinking',
}

const thinkingPhrases = [
    'Thinking',
    'Analyzing',
    'Searching',
    'Processing',
    'Just a second',
    'Gathering data',
    'Almost there',
]

export function TypingIndicator({ agent, message }: TypingIndicatorProps) {
    const [phraseIndex, setPhraseIndex] = useState(0)

    useEffect(() => {
        if (message) return

        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % thinkingPhrases.length)
        }, 2000)

        return () => clearInterval(interval)
    }, [message])

    const label = message || (agent && agentLabels[agent]) || thinkingPhrases[phraseIndex]

    return (
        <div className="flex gap-3 animate-fade-up">
            {/* Avatar placeholder */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card mt-0.5">
                <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-1 w-1 rounded-full bg-muted-foreground animate-dot-bounce"
                            style={{ animationDelay: `${i * 0.16}s` }}
                        />
                    ))}
                </div>
            </div>

            {/* Label */}
            <div className="flex items-center pt-1">
                <span className="text-sm text-muted-foreground">{label}...</span>
            </div>
        </div>
    )
}
