import React, { useState, useCallback } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { EmptyState } from './components/EmptyState'
import { ConversationItem } from './components/ConversationItem'
import { AgentBadge } from './components/AgentBadge'
import { Button } from './components/ui/button'
import { ScrollArea } from './components/ui/scroll-area'
import { useChat, ChatMessage } from './hooks/useChat'
import { useConversations } from './hooks/useConversations'

// For demo, we use a fixed userId. In production, this would come from auth.
const DEMO_USER_ID = 'cmlgauwyx0000x1ilgfzy36jw'

function App() {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

    const {
        conversations,
        refresh: refreshConversations,
        removeConversation,
        loadConversationMessages,
    } = useConversations({ userId: DEMO_USER_ID })

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
        userId: DEMO_USER_ID,
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
        const formattedMessages: ChatMessage[] = convMessages.map((msg: any) => ({
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
        sendMessage(suggestion)
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                            <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            SwadesAI
                        </span>
                    </div>
                    <Button
                        onClick={handleNewChat}
                        className="w-full"
                        size="sm"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </Button>
                </div>
                <ScrollArea className="flex-1 p-2">
                    {conversations.length > 0 && (
                        <>
                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Recent
                            </div>
                            <div className="space-y-1">
                                {conversations.map(conv => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        onClick={() => handleSelectConversation(conv.id)}
                                        onDelete={() => handleDeleteConversation(conv.id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </ScrollArea>
            </aside>

            {/* Main Chat Area */}
            <main className="flex flex-1 flex-col min-w-0">
                <header className="flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
                    <h1 className="text-lg font-semibold">
                        {activeConversationId
                            ? conversations.find(c => c.id === activeConversationId)?.title || 'Chat'
                            : 'New Conversation'
                        }
                    </h1>
                    <div className="flex gap-2">
                        <AgentBadge type="support" />
                        <AgentBadge type="order" />
                        <AgentBadge type="billing" />
                    </div>
                </header>

                {messages.length === 0 ? (
                    <EmptyState onSuggestionClick={handleSuggestion} />
                ) : (
                    <MessageList messages={messages} typing={typing} />
                )}

                {error && (
                    <div className="mx-6 mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        Error: {error}
                    </div>
                )}

                <ChatInput
                    onSend={sendMessage}
                    isLoading={isLoading}
                    placeholder="Ask about orders, billing, or get support..."
                />
            </main>
        </div>
    )
}

export default App
