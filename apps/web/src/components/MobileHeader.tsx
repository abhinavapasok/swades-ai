import { Menu, Sparkles } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface MobileHeaderProps {
    onOpenSidebar: () => void
}

export function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
    return (
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md z-30">
            <button
                onClick={onOpenSidebar}
                className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold text-base tracking-tight italic">SwadesAI</span>
            </div>
            <ThemeToggle />
        </div>
    )
}
