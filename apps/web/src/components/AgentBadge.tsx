import React from 'react'
import { Bot, ShoppingCart, CreditCard, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentBadgeProps {
    type: string
    showLabel?: boolean
}

const agentConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    router: {
        label: 'Router',
        icon: <Bot className="h-3 w-3" />,
        color: 'text-orange-400 bg-orange-400/10',
    },
    support: {
        label: 'Support',
        icon: <HelpCircle className="h-3 w-3" />,
        color: 'text-green-400 bg-green-400/10',
    },
    order: {
        label: 'Order',
        icon: <ShoppingCart className="h-3 w-3" />,
        color: 'text-blue-400 bg-blue-400/10',
    },
    billing: {
        label: 'Billing',
        icon: <CreditCard className="h-3 w-3" />,
        color: 'text-purple-400 bg-purple-400/10',
    },
}

export function AgentBadge({ type, showLabel = true }: AgentBadgeProps) {
    const config = agentConfig[type] || agentConfig.support

    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
            config.color
        )}>
            {config.icon}
            {showLabel && <span>{config.label}</span>}
        </span>
    )
}
