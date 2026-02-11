import React from 'react'
import {
    Plus,
    PanelLeftClose,
    PanelLeft,
    Sparkles,
    MessageSquare,
    Package,
    CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversationListItem } from '@/lib/api'
import { ConversationItem } from './ConversationItem'
import { UserSwitcher } from './UserSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { NavButton } from './NavButton'
import { Separator } from '@/components/ui/separator'

import { useConversations } from '@/hooks/useConversations'
import { Message as ApiMessage } from '@/lib/api'

interface SidebarProps {
    userId: string
    onUserChange: (userId: string) => void
    activeConversationId: string | null
    onConversationSelect: (id: string, messages: any[]) => void
    onChatClear: () => void
    isMobile: boolean
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    activeView: 'chat' | 'orders' | 'payments'
    onViewChange: (view: 'chat' | 'orders' | 'payments') => void
    refreshTrigger?: number
}

export function Sidebar({
    userId,
    onUserChange,
    activeConversationId,
    onConversationSelect,
    onChatClear,
    isMobile,
    isOpen,
    onOpenChange,
    activeView,
    onViewChange,
    refreshTrigger = 0
}: SidebarProps) {
    const {
        conversations,
        refresh: refreshConversations,
        removeConversation,
        loadConversationMessages,
    } = useConversations({ userId })

    // Refresh when trigger changes (e.g. after a new conversation is created in App)
    React.useEffect(() => {
        if (refreshTrigger > 0) {
            refreshConversations()
        }
    }, [refreshTrigger, refreshConversations])

    const handleNewChat = () => {
        onChatClear()
        if (isMobile) onOpenChange(false)
    }

    const handleSelectConversation = async (conversationId: string) => {
        if (conversationId === activeConversationId) return

        if (isMobile) onOpenChange(false)

        const convMessages = await loadConversationMessages(conversationId)
        const formattedMessages = convMessages.map((msg: ApiMessage) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            agentType: msg.agentType,
        }))
        onConversationSelect(conversationId, formattedMessages)
    }

    const handleDeleteConversation = async (conversationId: string) => {
        await removeConversation(conversationId)
        if (activeConversationId === conversationId) {
            handleNewChat()
        }
    }

    const handleUserChange = (newUserId: string) => {
        onUserChange(newUserId)
        handleNewChat()
    }

    return (
        <aside className={cn(
            "flex flex-col border-r border-border bg-[hsl(var(--sidebar))] transition-all duration-300 ease-in-out z-50 shrink-0",
            isMobile
                ? cn("fixed inset-y-0 left-0 w-72 transform shadow-2xl transition-transform duration-300", isOpen ? "translate-x-0" : "-translate-x-full")
                : cn(isOpen ? "w-72" : "w-20")
        )}>
            <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 h-16 shrink-0">
                    <div className={cn("flex items-center gap-3 transition-all duration-300",
                        (isMobile || isOpen) ? "opacity-100 scale-100" : "opacity-0 scale-90 invisible w-0")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/10">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight italic">SwadesAI</span>
                    </div>
                    {!isMobile && (
                        <button
                            onClick={() => onOpenChange(!isOpen)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                        >
                            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                <Separator className="bg-border/30 mx-4 w-auto" />

                {/* New Chat Action */}
                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        className={cn(
                            "flex items-center gap-3 w-full p-3 rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-md shadow-primary/10 active:scale-[0.98] group overflow-hidden whitespace-nowrap",
                            !isMobile && !isOpen && "justify-center p-3"
                        )}
                    >
                        <Plus className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-90" />
                        {(isMobile || isOpen) && <span className="font-semibold text-sm">New Chat</span>}
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
                    <div className={cn("mb-6 transition-all duration-300", (!isMobile && !isOpen) && "px-1")}>
                        {(isMobile || isOpen) && (
                            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Navigation</p>
                        )}
                        <div className="space-y-1">
                            <NavButton
                                active={activeView === 'chat'}
                                onClick={() => onViewChange('chat')}
                                icon={<MessageSquare className="h-5 w-5" />}
                                label="Chat Explorer"
                                collapsed={!isMobile && !isOpen}
                            />
                            <NavButton
                                active={activeView === 'orders'}
                                onClick={() => onViewChange('orders')}
                                icon={<Package className="h-5 w-5" />}
                                label="My Logistics"
                                collapsed={!isMobile && !isOpen}
                            />
                            <NavButton
                                active={activeView === 'payments'}
                                onClick={() => onViewChange('payments')}
                                icon={<CreditCard className="h-5 w-5" />}
                                label="Financials"
                                collapsed={!isMobile && !isOpen}
                            />
                        </div>
                    </div>

                    {activeView === 'chat' && (isMobile || isOpen) && (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Recent History</p>
                            <div className="space-y-1">
                                {conversations.length > 0 ? (
                                    conversations.map((conv: ConversationListItem) => (
                                        <ConversationItem
                                            key={conv.id}
                                            conversation={conv}
                                            isActive={conv.id === activeConversationId}
                                            onClick={() => handleSelectConversation(conv.id)}
                                            onDelete={() => handleDeleteConversation(conv.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="px-3 py-6 text-center">
                                        <p className="text-[10px] text-muted-foreground/60 italic">No activity yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* User Profile & System */}
                <div className="p-4 bg-muted/20 border-t border-border/30 mt-auto">
                    <div className="flex items-center justify-between px-2 mb-3">
                        {(isMobile || isOpen) && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Interface</p>}
                        <ThemeToggle />
                    </div>
                    <UserSwitcher
                        currentUserId={userId}
                        onUserChange={handleUserChange}
                        collapsed={!isMobile && !isOpen}
                    />
                </div>
            </div>
        </aside>
    )
}

