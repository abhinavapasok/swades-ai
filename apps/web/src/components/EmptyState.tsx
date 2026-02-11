import React from 'react'
import { Package, CreditCard, HelpCircle, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
    onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
    {
        icon: <Package className="h-4 w-4 text-blue-400" />,
        title: 'Track my order',
        description: 'Check status of ORD-2024-002',
        prompt: 'Track my order ORD-2024-002',
    },
    {
        icon: <HelpCircle className="h-4 w-4 text-green-400" />,
        title: 'Return policy',
        description: 'Learn about our return process',
        prompt: 'What is your return policy?',
    },
    {
        icon: <CreditCard className="h-4 w-4 text-purple-400" />,
        title: 'Refund status',
        description: 'Check refund for INV-2024-005',
        prompt: 'Check refund status for INV-2024-005',
    },
    {
        icon: <Package className="h-4 w-4 text-amber-400" />,
        title: 'Recent orders',
        description: 'View your order history',
        prompt: 'Show my recent orders',
    },
]

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center h-full p-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Greeting */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                        How can I help you today?
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        I can help with orders, billing, and general support.
                    </p>
                </div>

                {/* Suggestion Cards — 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => onSuggestionClick(suggestion.prompt)}
                            className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:bg-accent hover:border-muted-foreground/30"
                        >
                            <div className="flex items-center gap-2 w-full">
                                {suggestion.icon}
                                <span className="text-sm font-medium text-foreground">
                                    {suggestion.title}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground leading-relaxed">
                                {suggestion.description}
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
