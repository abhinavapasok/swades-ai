// Message types
export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentType?: AgentType
  metadata?: Record<string, unknown>
  createdAt: Date
}

// Conversation types
export interface Conversation {
  id: string
  userId: string
  title: string | null
  status: ConversationStatus
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

export type ConversationStatus = 'active' | 'resolved' | 'archived'

// Agent types
export type AgentType = 'router' | 'support' | 'order' | 'billing'

export interface Agent {
  type: AgentType
  name: string
  description: string
  capabilities: string[]
}

export interface ClassificationResult {
  agentType: AgentType
  confidence: number
  reasoning: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

export interface ApiError {
  message: string
  code?: string
}

// Stream event types
export interface StreamEvent {
  type: 'typing' | 'agent' | 'content' | 'done' | 'error'
  agent?: string
  text?: string
  message?: string
  conversationId?: string
  reasoning?: string
  confidence?: number
}

// Order types
export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  totalAmount: string
  shippingAddress: string
  trackingNumber: string | null
  estimatedDelivery: Date | null
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  orderId: string
  productName: string
  quantity: number
  price: string
}

// Payment types
export interface Payment {
  id: string
  userId: string
  invoiceNumber: string
  amount: string
  status: PaymentStatus
  paymentMethod: PaymentMethod
  refundStatus: RefundStatus | null
  refundAmount: string | null
  createdAt: Date
  updatedAt: Date
}

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer'
export type RefundStatus = 'requested' | 'processing' | 'completed' | 'rejected'

// User types
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}
