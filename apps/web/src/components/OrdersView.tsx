import React from 'react'
import useSWR from 'swr'
import { Package, Truck, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface OrdersViewProps {
    userId: string
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'pending': return <Clock className="h-4 w-4" />
        case 'processing': return <Package className="h-4 w-4" />
        case 'shipped': return <Truck className="h-4 w-4" />
        case 'delivered': return <CheckCircle2 className="h-4 w-4" />
        case 'cancelled': return <XCircle className="h-4 w-4" />
        default: return null
    }
}

export function OrdersView({ userId }: OrdersViewProps) {
    const { data, error, isLoading } = useSWR(`http://localhost:3001/api/orders?userId=${userId}`, fetcher)

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
    if (error) return <div className="p-8 text-center text-destructive">Failed to load orders</div>

    const orders = data?.data || []

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                <Package className="h-12 w-12 mb-4 opacity-20" />
                <p>No orders found for this user.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Your Orders</h2>
            <div className="grid gap-4">
                {orders.map((order: any) => (
                    <div key={order.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                                <p className="text-base font-semibold uppercase tracking-wider">{order.orderNumber}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={cn("flex items-center gap-1.5 px-3 py-1 capitalize", statusColors[order.status])}>
                                    <StatusIcon status={order.status} />
                                    {order.status}
                                </Badge>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="text-xl font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6 mt-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-widest">Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-medium">
                                                {item.quantity}x
                                            </div>
                                            <span className="font-medium">{item.productName}</span>
                                        </div>
                                        <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-border text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-medium">Shipping to:</span>
                                <span className="truncate max-w-[200px] sm:max-w-none">{order.shippingAddress}</span>
                            </div>
                            {order.trackingNumber && (
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-medium">Tracking:</span>
                                    <span className="font-mono text-primary">{order.trackingNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
