import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

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
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
        }
    }, [value])

    const handleSubmit = () => {
        if (value.trim() && !isLoading) {
            onSend(value.trim())
            setValue('')
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="border-t border-border bg-card/50 p-4 backdrop-blur-sm">
            <div className="mx-auto flex max-w-4xl items-end gap-3">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || 'Type a message...'}
                    rows={1}
                    disabled={isLoading}
                    className="resize-none"
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!value.trim() || isLoading}
                    size="icon"
                    className="h-10 w-10 shrink-0"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
