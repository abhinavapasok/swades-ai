import React from 'react'
import useSWR from 'swr'
import { ChevronDown, User, Check } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { swrFetcher, User as ApiUser } from '@/lib/api'

interface UserSwitcherProps {
    currentUserId: string
    onUserChange: (userId: string) => void
}

export function UserSwitcher({ currentUserId, onUserChange }: UserSwitcherProps) {
    const { data, error } = useSWR('/users', swrFetcher)

    const users: ApiUser[] = data?.data || []
    const currentUser = users.find((u) => u.id === currentUserId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-[200px] justify-between border border-border bg-background hover:bg-accent text-foreground">
                    <div className="flex items-center gap-2 truncate">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="truncate">{currentUser?.name || 'Loading...'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-popover text-popover-foreground border-border">
                {users.map((user: any) => (
                    <DropdownMenuItem
                        key={user.id}
                        onClick={() => onUserChange(user.id)}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <span className="truncate">{user.name}</span>
                        </div>
                        {user.id === currentUserId && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
