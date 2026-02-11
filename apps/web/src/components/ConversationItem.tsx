import React from 'react'
import { Trash2 } from 'lucide-react'
import { ConversationListItem } from '../lib/api'
import { cn } from '@/lib/utils'

interface ConversationItemProps {
    conversation: ConversationListItem
    isActive: boolean
    onClick: () => void
    onDelete: () => void
}

export function ConversationItem({ conversation, isActive, onClick, onDelete }: ConversationItemProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete()
    }

    return (
        <div
            className={cn(
                "group relative flex items-center rounded-lg px-3 py-2 cursor-pointer text-sm transition-colors",
                isActive
                    ? "bg-[hsl(var(--sidebar-active))] text-foreground"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-accent/50 hover:text-foreground"
            )}
            onClick={onClick}
        >
            <span className="truncate flex-1">
                {conversation.title || 'New conversation'}
            </span>
            <button
                className="absolute right-1 p-1 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 hover:bg-accent transition-all"
                onClick={handleDelete}
                title="Delete conversation"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </div>
    )
}
