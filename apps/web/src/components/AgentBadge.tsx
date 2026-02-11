import React from 'react'
import { Bot, ShoppingCart, CreditCard, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentBadgeProps {
    type: string
    showLabel?: boolean
    size?: 'sm' | 'md'
}

const agentConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    router: {
        label: 'Router',
        icon: <Bot className="h-3 w-3" />,
        color: 'border-orange-500/50 text-orange-500',
    },
    support: {
        label: 'Support',
        icon: <HelpCircle className="h-3 w-3" />,
        color: 'border-green-500/50 text-green-500',
    },
    order: {
        label: 'Order',
        icon: <ShoppingCart className="h-3 w-3" />,
        color: 'border-blue-500/50 text-blue-500',
    },
    billing: {
        label: 'Billing',
        icon: <CreditCard className="h-3 w-3" />,
        color: 'border-pink-500/50 text-pink-500',
    },
}

export function AgentBadge({ type, showLabel = true }: AgentBadgeProps) {
    const config = agentConfig[type] || agentConfig.support

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-muted/50 text-xs font-medium",
            config.color
        )}>
            {config.icon}
            {showLabel && <span>{config.label}</span>}
        </span>
    )
}
