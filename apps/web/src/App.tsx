import React, { useState, useCallback } from 'react'
import { useChat } from './hooks/useChat'
import { useLayout } from './hooks/useLayout'
import { OrdersView } from './components/OrdersView'
import { PaymentsView } from './components/PaymentsView'
import { cn } from '@/lib/utils'

// Subcomponents
import { ChatView } from './components/ChatView'
import { Sidebar } from './components/Sidebar'
import { MobileHeader } from './components/MobileHeader'

const INITIAL_USER_ID = 'demo-user-001'
type ViewType = 'chat' | 'orders' | 'payments'

function App() {
    const [userId, setUserId] = useState(INITIAL_USER_ID)
    const [activeView, setActiveView] = useState<ViewType>('chat')
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const {
        isMobile,
        sidebarOpen,
        mobileSidebarOpen,
        setSidebar,
        openMobileSidebar,
        closeMobileSidebar,
        isSidebarExpanded
    } = useLayout()

    const handleConversationCreated = useCallback((newId: string) => {
        setActiveConversationId(newId)
        setRefreshTrigger(prev => prev + 1)
    }, [])

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

    const handleViewAction = (prompt: string) => {
        setInputValue(prompt)
        setActiveView('chat')
        closeMobileSidebar()
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20 relative">
            {isMobile && <MobileHeader onOpenSidebar={openMobileSidebar} />}

            {isMobile && mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 animate-in fade-in transition-all duration-300"
                    onClick={closeMobileSidebar}
                />
            )}

            <Sidebar
                userId={userId}
                onUserChange={setUserId}
                activeConversationId={activeConversationId}
                onConversationSelect={(id, msgs) => {
                    setActiveConversationId(id)
                    loadConversation(id, msgs)
                }}
                onChatClear={() => {
                    clearChat()
                    setActiveConversationId(null)
                }}
                isMobile={isMobile}
                isOpen={isSidebarExpanded}
                onOpenChange={setSidebar}
                activeView={activeView}
                onViewChange={setActiveView}
                refreshTrigger={refreshTrigger}
            />

            <main className={cn(
                "flex flex-1 flex-col min-w-0 bg-background relative transition-all duration-300",
                isMobile && "pt-16"
            )}>
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] mask-image-linear-gradient transition-opacity duration-500 pointer-events-none" />

                    {activeView === 'chat' ? (
                        <ChatView
                            messages={messages}
                            typing={typing}
                            error={error}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSendMessage={(msg) => {
                                sendMessage(msg)
                                setInputValue('')
                            }}
                            isLoading={isLoading}
                            onSuggestionClick={setInputValue}
                        />
                    ) : activeView === 'orders' ? (
                        <div className="h-full overflow-y-auto p-4 md:p-8 scrollbar-thin scroll-smooth">
                            <div className="max-w-6xl mx-auto">
                                <OrdersView userId={userId} onAction={handleViewAction} />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto p-4 md:p-8 scrollbar-thin scroll-smooth">
                            <div className="max-w-6xl mx-auto">
                                <PaymentsView userId={userId} onAction={handleViewAction} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default App
