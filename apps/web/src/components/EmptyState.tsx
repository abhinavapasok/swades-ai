import React from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from './ui/button'

interface EmptyStateProps {
    onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
    'Track my order ORD-2024-002',
    'What is your return policy?',
    'Check refund status for INV-2024-005',
    'Show my recent orders',
    'How do I reset my password?',
    'View my payment history',
]

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6">
                <MessageCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-2">How can we help you today?</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                Our AI-powered support team is ready to assist you with orders, billing, and general inquiries.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {suggestions.map((suggestion, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="hover:border-primary"
                        onClick={() => onSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </Button>
                ))}
            </div>
        </div>
    )
}
