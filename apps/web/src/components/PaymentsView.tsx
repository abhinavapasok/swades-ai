import React from 'react'
import useSWR from 'swr'
import { CreditCard, DollarSign, Calendar, AlertCircle, CheckCircle2, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PaymentsViewProps {
    userId: string
}

const statusColors: Record<string, string> = {
    paid: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
    refunded: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export function PaymentsView({ userId }: PaymentsViewProps) {
    const { data, error, isLoading } = useSWR(`http://localhost:3001/api/payments?userId=${userId}`, fetcher)

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading payments...</div>
    if (error) return <div className="p-8 text-center text-destructive">Failed to load payments</div>

    const payments = data?.data || []

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                <CreditCard className="h-12 w-12 mb-4 opacity-20" />
                <p>No payments found for this user.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
            <div className="grid gap-4">
                {payments.map((payment: any) => (
                    <div key={payment.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Invoice</p>
                                        <p className="text-base font-semibold">{payment.invoiceNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-muted-foreground italic">{payment.paymentMethod.replace('_', ' ')}</p>
                                        <p className="text-2xl font-bold tracking-tight">${Number(payment.amount).toFixed(2)}</p>
                                    </div>
                                    <Badge variant="outline" className={cn("px-3 py-1 capitalize", statusColors[payment.status])}>
                                        {payment.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                                </div>
                                {payment.refundAmount && (
                                    <div className="flex items-center gap-2 text-purple-600 font-medium">
                                        <History className="h-4 w-4" />
                                        <span>Refunded: ${Number(payment.refundAmount).toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
