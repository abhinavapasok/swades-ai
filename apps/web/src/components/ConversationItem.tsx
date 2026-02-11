import React from 'react'
import { MessageSquare, Trash2 } from 'lucide-react'
import { ConversationListItem } from '../lib/api'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (diffDays === 1) {
            return 'Yesterday'
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' })
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    return (
        <div
            className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-accent/50",
                isActive && "bg-accent"
            )}
            onClick={onClick}
        >
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">
                    {conversation.title || 'New conversation'}
                </div>
                <div className="text-xs text-muted-foreground">
                    {formatTime(conversation.updatedAt)}
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleDelete}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    )
}
