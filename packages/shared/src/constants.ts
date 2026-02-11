export const AGENT_TYPES = ['router', 'support', 'order', 'billing'] as const;
export const CONVERSATION_STATUSES = ['active', 'resolved', 'archived'] as const;
export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_STATUSES = ['paid', 'pending', 'failed', 'refunded'] as const;
export const PAYMENT_METHODS = ['credit_card', 'paypal', 'bank_transfer'] as const;
export const REFUND_STATUSES = ['requested', 'processing', 'completed', 'rejected'] as const;
export const MESSAGE_ROLES = ['user', 'assistant', 'system'] as const;

export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LOCALE = 'en-US';
