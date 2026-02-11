import React from 'react'
import { cn } from '@/lib/utils'

export interface NavButtonProps {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    collapsed: boolean
}

export function NavButton({ active, onClick, icon, label, collapsed }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                active
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),.1)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                collapsed && "justify-center"
            )}
            title={collapsed ? label : undefined}
        >
            <div className={cn(
                "transition-all duration-300",
                active ? "scale-110 rotate-0" : "group-hover:scale-110 group-hover:-rotate-3"
            )}>
                {icon}
            </div>
            {!collapsed && (
                <span className={cn(
                    "transition-all duration-200",
                    active ? "font-bold tracking-tight" : "group-hover:translate-x-0.5"
                )}>
                    {label}
                </span>
            )}
            {active && (
                <div
                    className={cn(
                        "absolute rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),.4)] animate-in fade-in zoom-in duration-300",
                        collapsed
                            ? "right-1 bottom-1 w-1.5 h-1.5"
                            : "right-3 w-1.5 h-1.5"
                    )}
                />
            )}
        </button>
    )
}
