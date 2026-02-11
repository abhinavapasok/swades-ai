import React, { useState, useCallback, useMemo } from 'react'
import {
    Plus,
    PanelLeftClose,
    PanelLeft,
    Sparkles,
    MessageSquare,
    Package,
    CreditCard,
    Menu,
    LogOut,
    Search
} from 'lucide-react'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { EmptyState } from './components/EmptyState'
import { ConversationItem } from './components/ConversationItem'
import { useChat, ChatMessage } from './hooks/useChat'
import { useConversations } from './hooks/useConversations'
import { UserSwitcher } from './components/UserSwitcher'
import { ThemeToggle } from './components/ThemeToggle'
import { OrdersView } from './components/OrdersView'
import { PaymentsView } from './components/PaymentsView'
import { cn } from '@/lib/utils'
import {
    ConversationListItem,
    Message as ApiMessage
} from '@/lib/api'
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// For demo, we use a fixed initial userId.
const INITIAL_USER_ID = 'demo-user-001'

type ViewType = 'chat' | 'orders' | 'payments'

function App() {
    const [userId, setUserId] = useState(INITIAL_USER_ID)
    const [activeView, setActiveView] = useState<ViewType>('chat')
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [inputValue, setInputValue] = useState('')

    const {
        conversations,
        refresh: refreshConversations,
        removeConversation,
        loadConversationMessages,
    } = useConversations({ userId })

    const handleConversationCreated = useCallback((newConversationId: string) => {
        setActiveConversationId(newConversationId)
        refreshConversations()
    }, [refreshConversations])

    const {
        messages,
        isLoading,
        typing,
        error,
        sendMessage,
        clearChat,
        loadConversation,
    } = useChat({
        userId,
        onConversationCreated: handleConversationCreated,
    })

    const handleNewChat = () => {
        clearChat()
        setActiveConversationId(null)
    }

    const handleSelectConversation = async (conversationId: string) => {
        if (conversationId === activeConversationId) return

        setActiveConversationId(conversationId)
        const convMessages = await loadConversationMessages(conversationId)
        const formattedMessages = convMessages.map((msg: ApiMessage) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            agentType: msg.agentType,
        }))
        loadConversation(conversationId, formattedMessages)
    }

    const handleDeleteConversation = async (conversationId: string) => {
        await removeConversation(conversationId)
        if (activeConversationId === conversationId) {
            handleNewChat()
        }
    }

    const handleSuggestion = (suggestion: string) => {
        setInputValue(suggestion)
    }

    const handleViewAction = (prompt: string) => {
        setInputValue(prompt)
        setActiveView('chat')
    }

    const handleUserChange = (newUserId: string) => {
        setUserId(newUserId)
        clearChat()
        setActiveConversationId(null)
        // refreshConversations will happen automatically due to useConversations hook dependency on userId
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Left Main Navigation Sidebar */}
            <aside className={cn(
                "flex flex-col border-r border-border bg-[hsl(var(--sidebar))] transition-all duration-300 ease-in-out z-20 shrink-0",
                sidebarOpen ? "w-72" : "w-16"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 h-16 shrink-0">
                        <div className={cn("flex items-center gap-3 transition-opacity duration-300", sidebarOpen ? "opacity-100" : "opacity-0 invisible w-0")}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">SwadesAI</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                        >
                            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                        </button>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Main Actions */}
                    <div className="p-3 space-y-1">
                        <button
                            onClick={handleNewChat}
                            className={cn(
                                "flex items-center gap-3 w-full p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]",
                                !sidebarOpen && "justify-center"
                            )}
                        >
                            <Plus className="h-5 w-5 shrink-0" />
                            {sidebarOpen && <span className="font-semibold text-sm">New Chat</span>}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <div className={cn("mb-6", !sidebarOpen && "hidden")}>
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Main Menu</p>
                            <div className="space-y-1">
                                <NavButton
                                    active={activeView === 'chat'}
                                    onClick={() => setActiveView('chat')}
                                    icon={<MessageSquare className="h-5 w-5" />}
                                    label="Chat Support"
                                    collapsed={!sidebarOpen}
                                />
                                <NavButton
                                    active={activeView === 'orders'}
                                    onClick={() => setActiveView('orders')}
                                    icon={<Package className="h-5 w-5" />}
                                    label="My Orders"
                                    collapsed={!sidebarOpen}
                                />
                                <NavButton
                                    active={activeView === 'payments'}
                                    onClick={() => setActiveView('payments')}
                                    icon={<CreditCard className="h-5 w-5" />}
                                    label="Payments"
                                    collapsed={!sidebarOpen}
                                />
                            </div>
                        </div>

                        {activeView === 'chat' && sidebarOpen && (
                            <div className="animate-fade-up">
                                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Recent Chats</p>
                                <div className="space-y-0.5">
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
                                        <p className="px-3 py-4 text-xs text-muted-foreground italic">No conversations yet</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* Footer / User Switcher */}
                    <div className="p-3 bg-muted/30 shrink-0">
                        <div className="flex items-center justify-between px-3 mb-2">
                            {sidebarOpen && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">System</p>}
                            <ThemeToggle />
                        </div>
                        <UserSwitcher
                            currentUserId={userId}
                            onUserChange={handleUserChange}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex flex-1 flex-col min-w-0 bg-background relative z-10">
                {/* View Content */}
                <div className="flex-1 overflow-hidden">
                    {activeView === 'chat' ? (
                        <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
                            {/* Messages or Empty State */}
                            <div className="flex-1 overflow-hidden">
                                {messages.length === 0 ? (
                                    <EmptyState onSuggestionClick={handleSuggestion} />
                                ) : (
                                    <MessageList messages={messages} typing={typing} />
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="px-6 pb-2">
                                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                                        {error}
                                    </div>
                                </div>
                            )}

                            {/* Chat Input */}
                            <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4">
                                <ChatInput
                                    value={inputValue}
                                    onChange={setInputValue}
                                    onSend={(msg) => {
                                        sendMessage(msg)
                                        setInputValue('')
                                    }}
                                    isLoading={isLoading}
                                    placeholder="Ask anything about your orders, billing, or technical support..."
                                />
                            </div>
                        </div>
                    ) : activeView === 'orders' ? (
                        <div className="h-full overflow-y-auto scrollbar-thin">
                            <OrdersView userId={userId} onAction={handleViewAction} />
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto scrollbar-thin">
                            <PaymentsView userId={userId} onAction={handleViewAction} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

interface NavButtonProps {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    collapsed: boolean
}

function NavButton({ active, onClick, icon, label, collapsed }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                collapsed && "justify-center"
            )}
            title={collapsed ? label : undefined}
        >
            <div className={cn(
                "transition-transform duration-200",
                active ? "scale-110" : "group-hover:scale-110"
            )}>
                {icon}
            </div>
            {!collapsed && <span>{label}</span>}
            {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>
    )
}

export default App
