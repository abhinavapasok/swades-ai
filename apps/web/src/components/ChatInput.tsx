import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'

interface ChatInputProps {
    onSend: (message: string) => void
    isLoading: boolean
    placeholder?: string
}

export function ChatInput({ onSend, isLoading, placeholder }: ChatInputProps) {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
        }
    }, [value])

    const handleSubmit = () => {
        if (value.trim() && !isLoading) {
            onSend(value.trim())
            setValue('')
            // Reset height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const canSend = value.trim().length > 0 && !isLoading

    return (
        <div className="px-4 pb-4 pt-2">
            <div className="mx-auto max-w-3xl">
                <div className="relative flex items-end rounded-2xl border border-border bg-card shadow-lg transition-colors focus-within:border-muted-foreground/40">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || 'Send a message...'}
                        rows={1}
                        disabled={isLoading}
                        className="flex-1 resize-none bg-transparent px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 max-h-[200px] scrollbar-hide"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!canSend}
                        className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background transition-all duration-200 hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
                    SwadesAI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    )
}
