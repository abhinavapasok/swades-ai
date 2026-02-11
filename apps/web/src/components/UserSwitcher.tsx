import useSWR from 'swr'
import { ChevronDown, User, Check } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { User as ApiUser } from '@/lib/api'
import client from '@/lib/client'

interface UserSwitcherProps {
    currentUserId: string
    onUserChange: (userId: string) => void
    collapsed?: boolean
}

export function UserSwitcher({ currentUserId, onUserChange, collapsed = false }: UserSwitcherProps) {
    const { data, error: _error } = useSWR(
        'users',
        async () => {
            const res = await client.api.users.$get()
            if (!res.ok) throw new Error('Failed to fetch users')
            return await res.json()
        }
    )

    const users: ApiUser[] = data?.data || []
    const currentUser = users.find((u) => u.id === currentUserId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "justify-between border border-border bg-background hover:bg-accent text-foreground transition-all duration-200 shadow-sm overflow-hidden",
                        collapsed ? "w-10 h-10 p-0 rounded-xl" : "w-full min-h-[44px] px-3 rounded-xl"
                    )}
                >
                    <div className={cn("flex items-center gap-2.5 min-w-0", collapsed && "justify-center w-full")}>
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner">
                            <User className="h-4 w-4" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col items-start min-w-0 overflow-hidden">
                                <span className="text-xs font-semibold truncate w-full">{currentUser?.name || 'Loading...'}</span>
                                <span className="text-[10px] text-muted-foreground truncate w-full">Current User</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover text-popover-foreground border-border shadow-xl animate-in fade-in-0 zoom-in-95" align={collapsed ? "center" : "end"} side={collapsed ? "right" : "bottom"}>
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Select Account</div>
                <Separator className="my-1 opacity-50" />
                {users.map((user: any) => (
                    <DropdownMenuItem
                        key={user.id}
                        onClick={() => onUserChange(user.id)}
                        className={cn(
                            "flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer transition-colors",
                            user.id === currentUserId ? "bg-accent/50 font-medium" : "hover:bg-accent"
                        )}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                                <User className="h-3 w-3" />
                            </div>
                            <span className="truncate text-sm">{user.name}</span>
                        </div>
                        {user.id === currentUserId && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-2.5 w-2.5 stroke-[3px]" />
                            </div>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
